/**
 * @file apps/ton-client/src/app/api/songs/route.ts
 * @description 楽曲一覧を取得するAPIエンドポイント
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

// 楽曲カテゴリー列挙型
enum SongCategory {
  POP = 'pop',
  ROCK = 'rock',
  HIPHOP = 'hiphop',
  ELECTRONIC = 'electronic',
  JAZZ = 'jazz',
  CLASSICAL = 'classical',
  ANIME = 'anime',
  GAME = 'game',
  OTHER = 'other',
}

// 楽曲難易度列挙型
enum SongDifficulty {
  BEGINNER = 'beginner',
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard',
  EXPERT = 'expert',
}

// 楽曲検索クエリスキーマ
const songSearchQuerySchema = z.object({
  query: z.string().optional(),
  category: z.nativeEnum(SongCategory).optional(),
  difficulty: z.nativeEnum(SongDifficulty).optional(),
  isNew: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  artistId: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.enum(['title', 'releaseDate', 'popularity', 'difficulty']).default('releaseDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * 楽曲一覧を取得する
 * @route GET /api/songs
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
    const validatedQuery = songSearchQuerySchema.parse({
      query: queryParams.query,
      category: queryParams.category,
      difficulty: queryParams.difficulty,
      isNew: queryParams.isNew === 'true',
      isFeatured: queryParams.isFeatured === 'true',
      artistId: queryParams.artistId,
      page: queryParams.page ? parseInt(queryParams.page) : 1,
      limit: queryParams.limit ? parseInt(queryParams.limit) : 10,
      sortBy: queryParams.sortBy || 'releaseDate',
      sortOrder: queryParams.sortOrder || 'desc',
    });

    // ページネーションの計算
    const { page, limit } = validatedQuery;
    const offset = (page - 1) * limit;

    // Supabaseクライアントを作成
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 楽曲一覧を取得するクエリを構築
    let query = supabase
      .from('songs')
      .select('*, artists(*)', { count: 'exact' });

    // フィルタリング条件を適用
    if (validatedQuery.query) {
      query = query.or(`title.ilike.%${validatedQuery.query}%,artists.name.ilike.%${validatedQuery.query}%`);
    }

    if (validatedQuery.category) {
      query = query.eq('category', validatedQuery.category);
    }

    if (validatedQuery.difficulty) {
      query = query.eq('difficulty', validatedQuery.difficulty);
    }

    if (validatedQuery.isNew !== undefined) {
      // 30日以内にリリースされた曲を「新曲」とする
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (validatedQuery.isNew) {
        query = query.gte('releaseDate', thirtyDaysAgo.toISOString());
      }
    }

    if (validatedQuery.isFeatured !== undefined) {
      query = query.eq('isFeatured', validatedQuery.isFeatured);
    }

    if (validatedQuery.artistId) {
      query = query.eq('artistId', validatedQuery.artistId);
    }

    // ソート条件を適用
    const { sortBy, sortOrder } = validatedQuery;
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // ページネーションを適用
    query = query.range(offset, offset + limit - 1);

    // 楽曲を取得
    const { data: songs, error: songsError, count } = await query;

    if (songsError) {
      throw new ApiError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        '楽曲一覧の取得に失敗しました',
        songsError.message
      );
    }

    // 現在のセッションを取得
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    // ユーザーがログインしている場合、楽曲の再生履歴を取得
    let songPlayHistory: Record<string, any> = {};
    if (session) {
      const { data: playHistory, error: playHistoryError } = await supabase
        .from('song_play_history')
        .select('songId, lastPlayedAt, playCount, highScore')
        .eq('userId', session.user.id);

      if (!playHistoryError && playHistory) {
        // 楽曲IDをキーとした再生履歴のマップを作成
        songPlayHistory = playHistory.reduce((acc, history) => {
          acc[history.songId] = {
            lastPlayedAt: history.lastPlayedAt,
            playCount: history.playCount,
            highScore: history.highScore,
          };
          return acc;
        }, {} as Record<string, any>);
      }
    }

    // 楽曲一覧にユーザーの再生履歴を追加
    const songsWithPlayHistory = songs?.map(song => {
      const history = songPlayHistory[song.id];
      return {
        ...song,
        playHistory: history || null,
      };
    });

    // レスポンスを返す
    return NextResponse.json({
      data: songsWithPlayHistory || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: count ? Math.ceil(count / limit) : 0,
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/songs:', error);

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
