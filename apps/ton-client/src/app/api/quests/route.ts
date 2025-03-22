/**
 * @file apps/ton-client/src/app/api/quests/route.ts
 * @description クエスト一覧を取得するAPIエンドポイント
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

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

// クエストタイプ列挙型
enum QuestType {
  TWITTER_FOLLOW = 'twitter_follow',
  TWITTER_REPOST = 'twitter_repost',
  TWITTER_COMMENT = 'twitter_comment',
  TELEGRAM_JOIN = 'telegram_join',
  TIKTOK_LIKE = 'tiktok_like',
  URL_VISIT = 'url_visit',
  PLAY_SONG = 'play_song',
  ACHIEVE_SCORE = 'achieve_score',
  COMPLETE_DAILY = 'complete_daily',
  CUSTOM = 'custom',
}

// クエスト難易度列挙型
enum QuestDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

// クエスト検索クエリスキーマ
const questSearchQuerySchema = z.object({
  query: z.string().optional(),
  type: z.nativeEnum(QuestType).optional(),
  difficulty: z.nativeEnum(QuestDifficulty).optional(),
  isDaily: z.boolean().optional(),
  isWeekly: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isHidden: z.boolean().optional(),
  isPromoted: z.boolean().optional(),
  requiredLevel: z.number().int().nonnegative().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

/**
 * クエスト一覧を取得する
 * @route GET /api/quests
 */
export async function GET(request: NextRequest) {
  try {
    // クエリパラメータを取得
    const url = new URL(request.url);
    const queryParams: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    // クエリパラメータをバリデーション
    const validatedQuery = questSearchQuerySchema.parse({
      query: queryParams.query,
      type: queryParams.type,
      difficulty: queryParams.difficulty,
      isDaily: queryParams.isDaily === 'true',
      isWeekly: queryParams.isWeekly === 'true',
      isActive: queryParams.isActive === 'true',
      isHidden: queryParams.isHidden === 'true',
      isPromoted: queryParams.isPromoted === 'true',
      requiredLevel: queryParams.requiredLevel ? parseInt(queryParams.requiredLevel) : undefined,
      tags: queryParams.tags ? queryParams.tags.split(',') : undefined,
      category: queryParams.category,
      page: queryParams.page ? parseInt(queryParams.page) : 1,
      limit: queryParams.limit ? parseInt(queryParams.limit) : 10,
    });

    // ページネーションの計算
    const { page, limit } = validatedQuery;
    const offset = (page - 1) * limit;

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

    // クエスト一覧を取得するクエリを構築
    let query = supabase
      .from('quests')
      .select('*', { count: 'exact' });

    // フィルタリング条件を適用
    if (validatedQuery.type) {
      query = query.eq('type', validatedQuery.type);
    }

    if (validatedQuery.difficulty) {
      query = query.eq('difficulty', validatedQuery.difficulty);
    }

    if (validatedQuery.isDaily !== undefined) {
      query = query.eq('isDaily', validatedQuery.isDaily);
    }

    if (validatedQuery.isWeekly !== undefined) {
      query = query.eq('isWeekly', validatedQuery.isWeekly);
    }

    if (validatedQuery.isActive !== undefined) {
      query = query.eq('isActive', validatedQuery.isActive);
    } else {
      // デフォルトではアクティブなクエストのみを表示
      query = query.eq('isActive', true);
    }

    if (validatedQuery.isHidden !== undefined) {
      query = query.eq('isHidden', validatedQuery.isHidden);
    } else {
      // デフォルトでは非表示のクエストは表示しない
      query = query.eq('isHidden', false);
    }

    if (validatedQuery.isPromoted !== undefined) {
      query = query.eq('isPromoted', validatedQuery.isPromoted);
    }

    if (validatedQuery.requiredLevel !== undefined) {
      query = query.lte('requiredLevel', validatedQuery.requiredLevel);
    }

    if (validatedQuery.category) {
      query = query.eq('category', validatedQuery.category);
    }

    if (validatedQuery.query) {
      query = query.or(`title.ilike.%${validatedQuery.query}%,description.ilike.%${validatedQuery.query}%`);
    }

    // 有効期限内のクエストのみを表示
    const now = new Date().toISOString();
    query = query.or(`validPeriod.is.null,and(validPeriod->startDate.lte.${now},validPeriod->endDate.gte.${now})`);

    // ページネーションを適用
    query = query.range(offset, offset + limit - 1);

    // クエストを取得
    const { data: quests, error: questsError, count } = await query;

    if (questsError) {
      throw new ApiError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'クエスト一覧の取得に失敗しました',
        questsError.message
      );
    }

    // ユーザーがログインしている場合、クエスト完了状況を取得
    let questCompletions: Record<string, any> = {};
    if (session) {
      const { data: completions, error: completionsError } = await supabase
        .from('quest_completions')
        .select('questId, completedAt, verificationStatus')
        .eq('userId', session.user.id);

      if (completionsError) {
        console.error('クエスト完了状況の取得に失敗しました:', completionsError);
      } else if (completions) {
        // クエストIDをキーとした完了状況のマップを作成
        questCompletions = completions.reduce((acc, completion) => {
          acc[completion.questId] = {
            completedAt: completion.completedAt,
            verificationStatus: completion.verificationStatus,
          };
          return acc;
        }, {} as Record<string, any>);
      }
    }

    // クエスト一覧にユーザーの完了状況を追加
    const questsWithCompletionStatus = quests?.map(quest => {
      const completion = questCompletions[quest.id];
      return {
        ...quest,
        isCompleted: !!completion,
        completedAt: completion?.completedAt,
        verificationStatus: completion?.verificationStatus,
      };
    });

    // レスポンスを返す
    return NextResponse.json({
      data: questsWithCompletionStatus || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: count ? Math.ceil(count / limit) : 0,
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/quests:', error);

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
