/**
 * @file apps/ton-client/src/app/api/quests/[id]/visit/route.ts
 * @description URL訪問を報告するAPIエンドポイント
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import crypto from 'crypto';

// 環境変数からSupabaseの接続情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// エラーコード列挙型
enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  ALREADY_COMPLETED = 'ALREADY_COMPLETED',
  INVALID_QUEST_TYPE = 'INVALID_QUEST_TYPE',
}

// APIエラークラス
class ApiError extends Error {
  code: ErrorCode;
  details?: any;
  statusCode: number;

  constructor(code: ErrorCode, message: string, details?: any, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    
    // ステータスコードのマッピング
    this.statusCode = statusCode || this.getStatusCodeFromErrorCode(code);
  }

  /**
   * エラーコードからHTTPステータスコードを取得
   */
  private getStatusCodeFromErrorCode(code: ErrorCode): number {
    switch (code) {
      case ErrorCode.UNAUTHORIZED:
        return 401;
      case ErrorCode.NOT_FOUND:
        return 404;
      case ErrorCode.VALIDATION_ERROR:
        return 400;
      case ErrorCode.ALREADY_COMPLETED:
        return 409;
      case ErrorCode.INVALID_QUEST_TYPE:
        return 400;
      case ErrorCode.INTERNAL_SERVER_ERROR:
      default:
        return 500;
    }
  }

  /**
   * エラーレスポンスオブジェクトを生成
   */
  toResponse() {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
    };
  }
}

// URL訪問報告スキーマ
const urlVisitReportSchema = z.object({
  trackingId: z.string(),
  visitDuration: z.number().int().nonnegative().optional(),
  referrer: z.string().optional(),
  userAgent: z.string().optional(),
});

/**
 * URL訪問を報告する
 * @route POST /api/quests/{id}/visit
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questId = params.id;

    if (!questId) {
      throw new ApiError(
        ErrorCode.VALIDATION_ERROR,
        'クエストIDが指定されていません',
      );
    }

    // リクエストボディを取得
    const body = await request.json();

    // リクエストボディをバリデーション
    const validatedBody = urlVisitReportSchema.parse(body);

    // Supabaseクライアントを作成
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 現在のセッションを取得
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new ApiError(
        ErrorCode.UNAUTHORIZED,
        'ログインが必要です',
        sessionError?.message
      );
    }

    // クエスト情報を取得
    const { data: quest, error: questError } = await supabase
      .from('quests')
      .select('*')
      .eq('id', questId)
      .single();

    if (questError) {
      if (questError.code === 'PGRST116') {
        throw new ApiError(
          ErrorCode.NOT_FOUND,
          'クエストが見つかりません',
          questError.message
        );
      }
      throw new ApiError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'クエスト情報の取得に失敗しました',
        questError.message
      );
    }

    // クエストが非アクティブの場合はエラー
    if (!quest.isActive) {
      throw new ApiError(
        ErrorCode.NOT_FOUND,
        'クエストが見つかりません',
      );
    }

    // クエストタイプがURL_VISITでない場合はエラー
    if (quest.type !== 'url_visit') {
      throw new ApiError(
        ErrorCode.INVALID_QUEST_TYPE,
        'このクエストはURL訪問タイプではありません',
      );
    }

    // トラッキングIDを検証
    const { data: tracking, error: trackingError } = await supabase
      .from('quest_tracking')
      .select('*')
      .eq('trackingId', validatedBody.trackingId)
      .eq('questId', questId)
      .eq('userId', session.user.id)
      .single();

    if (trackingError) {
      throw new ApiError(
        ErrorCode.VALIDATION_ERROR,
        'トラッキングIDが無効です',
        trackingError.message
      );
    }

    // 既に完了しているか確認
    const { data: existingCompletion, error: completionError } = await supabase
      .from('quest_completions')
      .select('*')
      .eq('questId', questId)
      .eq('userId', session.user.id)
      .single();

    if (!completionError && existingCompletion) {
      throw new ApiError(
        ErrorCode.ALREADY_COMPLETED,
        'このクエストは既に完了しています',
      );
    }

    // 最低滞在時間を確認
    const minVisitDuration = quest.requirements?.minVisitDuration || 0;
    const visitDuration = validatedBody.visitDuration || 0;

    if (visitDuration < minVisitDuration) {
      throw new ApiError(
        ErrorCode.VALIDATION_ERROR,
        `最低滞在時間（${minVisitDuration}秒）を満たしていません`,
      );
    }

    // 訪問ログを記録
    const { error: visitLogError } = await supabase
      .from('quest_visit_logs')
      .insert({
        questId,
        userId: session.user.id,
        trackingId: validatedBody.trackingId,
        visitDuration,
        referrer: validatedBody.referrer,
        userAgent: validatedBody.userAgent,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
      });

    if (visitLogError) {
      console.error('訪問ログの記録に失敗しました:', visitLogError);
    }

    // クエスト完了を記録
    const now = new Date().toISOString();
    const { data: completion, error: insertError } = await supabase
      .from('quest_completions')
      .insert({
        questId,
        userId: session.user.id,
        completedAt: now,
        verificationStatus: 'verified',
        verificationData: {
          trackingId: validatedBody.trackingId,
          visitDuration,
          timestamp: now,
        },
        rewardsIssued: true,
        pointsAwarded: quest.rewards?.points || 0,
        experienceAwarded: quest.rewards?.experience || 0,
        itemsAwarded: quest.rewards?.itemIds || [],
      })
      .select()
      .single();

    if (insertError) {
      throw new ApiError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'クエスト完了の記録に失敗しました',
        insertError.message
      );
    }

    // ユーザーのポイントと経験値を更新
    const { error: userUpdateError } = await supabase.rpc('update_user_rewards', {
      user_id: session.user.id,
      points_to_add: quest.rewards?.points || 0,
      experience_to_add: quest.rewards?.experience || 0,
    });

    if (userUpdateError) {
      console.error('ユーザーの報酬更新に失敗しました:', userUpdateError);
    }

    // クエストの完了回数を更新
    const { error: questUpdateError } = await supabase
      .from('quests')
      .update({
        completionCount: (quest.completionCount || 0) + 1,
      })
      .eq('id', questId);

    if (questUpdateError) {
      console.error('クエスト完了回数の更新に失敗しました:', questUpdateError);
    }

    // トラッキングレコードを削除
    const { error: deleteTrackingError } = await supabase
      .from('quest_tracking')
      .delete()
      .eq('trackingId', validatedBody.trackingId);

    if (deleteTrackingError) {
      console.error('トラッキングレコードの削除に失敗しました:', deleteTrackingError);
    }

    // レスポンスを返す
    return NextResponse.json({
      data: {
        success: true,
        completion: {
          questId,
          completedAt: now,
          rewards: {
            points: quest.rewards?.points || 0,
            experience: quest.rewards?.experience || 0,
            items: quest.rewards?.itemIds || [],
          },
        },
      },
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error in POST /api/quests/[id]/visit:', error);

    if (error instanceof ApiError) {
      return NextResponse.json(error.toResponse(), { status: error.statusCode });
    }

    if (error instanceof z.ZodError) {
      const apiError = new ApiError(
        ErrorCode.VALIDATION_ERROR,
        'バリデーションエラー',
        error.errors
      );
      return NextResponse.json(apiError.toResponse(), { status: apiError.statusCode });
    }

    const apiError = new ApiError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      '内部サーバーエラー',
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(apiError.toResponse(), { status: apiError.statusCode });
  }
}

/**
 * トラッキングIDを生成する
 * @route GET /api/quests/{id}/visit
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questId = params.id;

    if (!questId) {
      throw new ApiError(
        ErrorCode.VALIDATION_ERROR,
        'クエストIDが指定されていません',
      );
    }

    // Supabaseクライアントを作成
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 現在のセッションを取得
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new ApiError(
        ErrorCode.UNAUTHORIZED,
        'ログインが必要です',
        sessionError?.message
      );
    }

    // クエスト情報を取得
    const { data: quest, error: questError } = await supabase
      .from('quests')
      .select('*')
      .eq('id', questId)
      .single();

    if (questError) {
      if (questError.code === 'PGRST116') {
        throw new ApiError(
          ErrorCode.NOT_FOUND,
          'クエストが見つかりません',
          questError.message
        );
      }
      throw new ApiError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'クエスト情報の取得に失敗しました',
        questError.message
      );
    }

    // クエストが非アクティブの場合はエラー
    if (!quest.isActive) {
      throw new ApiError(
        ErrorCode.NOT_FOUND,
        'クエストが見つかりません',
      );
    }

    // クエストタイプがURL_VISITでない場合はエラー
    if (quest.type !== 'url_visit') {
      throw new ApiError(
        ErrorCode.INVALID_QUEST_TYPE,
        'このクエストはURL訪問タイプではありません',
      );
    }

    // 既に完了しているか確認
    const { data: existingCompletion, error: completionError } = await supabase
      .from('quest_completions')
      .select('*')
      .eq('questId', questId)
      .eq('userId', session.user.id)
      .single();

    if (!completionError && existingCompletion) {
      throw new ApiError(
        ErrorCode.ALREADY_COMPLETED,
        'このクエストは既に完了しています',
      );
    }

    // トラッキングIDを生成
    const trackingId = crypto.randomBytes(16).toString('hex');

    // 既存のトラッキングレコードを削除
    await supabase
      .from('quest_tracking')
      .delete()
      .eq('questId', questId)
      .eq('userId', session.user.id);

    // トラッキングレコードを作成
    const { error: trackingError } = await supabase
      .from('quest_tracking')
      .insert({
        questId,
        userId: session.user.id,
        trackingId,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24時間後に期限切れ
      });

    if (trackingError) {
      throw new ApiError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'トラッキングIDの生成に失敗しました',
        trackingError.message
      );
    }

    // 訪問先URLを取得
    const visitUrl = quest.requirements?.url;
    if (!visitUrl) {
      throw new ApiError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'クエストに訪問先URLが設定されていません',
      );
    }

    // URLにトラッキングIDを追加
    const url = new URL(visitUrl);
    url.searchParams.append('tracking_id', trackingId);

    // レスポンスを返す
    return NextResponse.json({
      data: {
        trackingId,
        url: url.toString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/quests/[id]/visit:', error);

    if (error instanceof ApiError) {
      return NextResponse.json(error.toResponse(), { status: error.statusCode });
    }

    const apiError = new ApiError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      '内部サーバーエラー',
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(apiError.toResponse(), { status: apiError.statusCode });
  }
}
