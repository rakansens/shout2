/**
 * @file apps/line-client/src/app/api/rankings/monthly/route.ts
 * @description 月間ランキングを取得するAPIエンドポイント
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

// ランキングタイプ列挙型
enum RankingType {
  POINTS = 'points',
  QUESTS = 'quests',
  SONGS = 'songs',
}

// ランキング検索クエリスキーマ
const rankingSearchQuerySchema = z.object({
  type: z.nativeEnum(RankingType).default(RankingType.POINTS),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// ユーザー情報の型定義
interface UserInfo {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  level: number;
}

// ランキングクエリ結果の型定義
interface RankingQueryResult {
  userId: string;
  points?: number;
  count?: number;
  score?: number;
  users: UserInfo;
}

// ランキングエントリーの型定義
interface RankingEntry extends RankingQueryResult {
  rank: number;
  isCurrentUser: boolean;
}

// ユーザーランキング情報の型定義
interface UserRankingInfo extends RankingQueryResult {
  rank: number;
}

/**
 * 月間ランキングを取得する
 * @route GET /api/rankings/monthly
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
    const validatedQuery = rankingSearchQuerySchema.parse({
      type: queryParams.type as RankingType || RankingType.POINTS,
      page: queryParams.page ? parseInt(queryParams.page) : 1,
      limit: queryParams.limit ? parseInt(queryParams.limit) : 20,
    });

    // ページネーションの計算
    const { page, limit } = validatedQuery;
    const offset = (page - 1) * limit;

    // Supabaseクライアントを作成
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 現在の日付を取得
    const now = new Date();
    
    // 月の開始日を計算
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    // 月の終了日を計算
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // ランキングタイプに応じたクエリを構築
    let query: any;
    const { type } = validatedQuery;

    // Supabaseの集計機能が有効になっているため、以下のクエリは正式にサポートされています。
    // 集計関数（sum, count, avg, max, min）を使用したクエリが可能です。
    switch (type) {
      case RankingType.POINTS:
        // ポイントランキング
        query = supabase
          .from('user_points_history')
          .select(`
            userId,
            points:sum,
            users!inner (
              id,
              username,
              displayName,
              avatarUrl,
              level
            )
          `, { count: 'exact' })
          .gte('createdAt', startOfMonth.toISOString())
          .lte('createdAt', endOfMonth.toISOString())
          .order('points', { ascending: false })
          .range(offset, offset + limit - 1);
        break;

      case RankingType.QUESTS:
        // クエスト完了数ランキング
        query = supabase
          .from('user_quest_completions')
          .select(`
            userId,
            count,
            users!inner (
              id,
              username,
              displayName,
              avatarUrl,
              level
            )
          `, { count: 'exact' })
          .gte('completedAt', startOfMonth.toISOString())
          .lte('completedAt', endOfMonth.toISOString())
          .order('count', { ascending: false })
          .range(offset, offset + limit - 1);
        break;

      case RankingType.SONGS:
        // 楽曲スコアランキング
        query = supabase
          .from('song_play_history')
          .select(`
            userId,
            score:sum,
            users!inner (
              id,
              username,
              displayName,
              avatarUrl,
              level
            )
          `, { count: 'exact' })
          .gte('playedAt', startOfMonth.toISOString())
          .lte('playedAt', endOfMonth.toISOString())
          .order('score', { ascending: false })
          .range(offset, offset + limit - 1);
        break;
    }

    // ランキングデータを取得
    const { data: rankings, error: rankingsError, count } = await query;

    if (rankingsError) {
      throw new ApiError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'ランキングデータの取得に失敗しました',
        rankingsError.message
      );
    }

    // 現在のセッションを取得
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    // 現在のユーザーのランキング情報を取得
    let currentUserRanking: UserRankingInfo | null = null;
    if (session) {
      const userId = session.user.id;

      // ランキングに含まれていない場合は、現在のユーザーのランキング情報を取得
      const isUserInRankings = rankings?.some((ranking: RankingQueryResult) => ranking.userId === userId);

      if (!isUserInRankings) {
        let userRankingQuery: any;

        switch (type) {
          case RankingType.POINTS:
            // ポイントランキング
            userRankingQuery = supabase
              .from('user_points_history')
              .select(`
                userId,
                points:sum,
                users!inner (
                  id,
                  username,
                  displayName,
                  avatarUrl,
                  level
                )
              `)
              .eq('userId', userId)
              .gte('createdAt', startOfMonth.toISOString())
              .lte('createdAt', endOfMonth.toISOString());
            break;

          case RankingType.QUESTS:
            // クエスト完了数ランキング
            userRankingQuery = supabase
              .from('user_quest_completions')
              .select(`
                userId,
                count,
                users!inner (
                  id,
                  username,
                  displayName,
                  avatarUrl,
                  level
                )
              `)
              .eq('userId', userId)
              .gte('completedAt', startOfMonth.toISOString())
              .lte('completedAt', endOfMonth.toISOString());
            break;

          case RankingType.SONGS:
            // 楽曲スコアランキング
            userRankingQuery = supabase
              .from('song_play_history')
              .select(`
                userId,
                score:sum,
                users!inner (
                  id,
                  username,
                  displayName,
                  avatarUrl,
                  level
                )
              `)
              .eq('userId', userId)
              .gte('playedAt', startOfMonth.toISOString())
              .lte('playedAt', endOfMonth.toISOString());
            break;
        }

        const { data: userRanking, error: userRankingError } = await userRankingQuery;

        if (!userRankingError && userRanking && userRanking.length > 0) {
          // ユーザーのランキング順位を取得
          let rankQuery: any;

          switch (type) {
            case RankingType.POINTS:
              rankQuery = supabase
                .from('user_points_history')
                .select('userId, points:sum')
                .gte('createdAt', startOfMonth.toISOString())
                .lte('createdAt', endOfMonth.toISOString())
                .order('points', { ascending: false });
              break;

            case RankingType.QUESTS:
              rankQuery = supabase
                .from('user_quest_completions')
                .select('userId, count')
                .gte('completedAt', startOfMonth.toISOString())
                .lte('completedAt', endOfMonth.toISOString())
                .order('count', { ascending: false });
              break;

            case RankingType.SONGS:
              rankQuery = supabase
                .from('song_play_history')
                .select('userId, score:sum')
                .gte('playedAt', startOfMonth.toISOString())
                .lte('playedAt', endOfMonth.toISOString())
                .order('score', { ascending: false });
              break;
          }

          const { data: allRankings, error: allRankingsError } = await rankQuery;

          if (!allRankingsError && allRankings) {
            // ユーザーの順位を計算
            const userRank = allRankings.findIndex((ranking: any) => ranking.userId === userId) + 1;

            currentUserRanking = {
              ...userRanking[0],
              rank: userRank,
            };
          }
        }
      }
    }

    // ランキングデータにランク情報を追加
    const rankingsWithRank: RankingEntry[] = rankings?.map((ranking: RankingQueryResult, index: number) => {
      const rank = offset + index + 1;
      const isCurrentUser = session && ranking.userId === session.user.id;

      return {
        ...ranking,
        rank,
        isCurrentUser,
      };
    });

    // レスポンスを返す
    return NextResponse.json({
      data: {
        rankings: rankingsWithRank || [],
        currentUserRanking,
        period: {
          start: startOfMonth.toISOString(),
          end: endOfMonth.toISOString(),
        },
      },
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: count ? Math.ceil(count / limit) : 0,
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/rankings/monthly:', error);

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
