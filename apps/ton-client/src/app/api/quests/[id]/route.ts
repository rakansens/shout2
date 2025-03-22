/**
 * @file apps/ton-client/src/app/api/quests/[id]/route.ts
 * @description 特定のクエストの詳細情報を取得するAPIエンドポイント
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 環境変数からSupabaseの接続情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// エラーコード列挙型
enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
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

/**
 * 特定のクエストの詳細情報を取得する
 * @route GET /api/quests/{id}
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

    if (sessionError) {
      throw new ApiError(
        ErrorCode.UNAUTHORIZED,
        'セッションの取得に失敗しました',
        sessionError.message
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

    // クエストが非アクティブまたは非表示の場合、管理者以外は閲覧不可
    if ((quest.isActive === false || quest.isHidden === true) && (!session || session.user.role !== 'admin')) {
      throw new ApiError(
        ErrorCode.NOT_FOUND,
        'クエストが見つかりません',
      );
    }

    // ユーザーがログインしている場合、クエスト完了状況を取得
    let completionStatus = null;
    if (session) {
      const { data: completion, error: completionError } = await supabase
        .from('quest_completions')
        .select('*')
        .eq('questId', questId)
        .eq('userId', session.user.id)
        .single();

      if (!completionError && completion) {
        completionStatus = {
          isCompleted: true,
          completedAt: completion.completedAt,
          verificationStatus: completion.verificationStatus,
          pointsAwarded: completion.pointsAwarded,
          experienceAwarded: completion.experienceAwarded,
          itemsAwarded: completion.itemsAwarded,
        };
      }
    }

    // クエスト情報にユーザーの完了状況を追加
    const questWithCompletionStatus = {
      ...quest,
      ...completionStatus ? { completion: completionStatus } : { isCompleted: false },
    };

    // レスポンスを返す
    return NextResponse.json({
      data: questWithCompletionStatus,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/quests/[id]:', error);

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
