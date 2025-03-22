/**
 * @file packages/api/src/handlers/rankings/monthly.ts
 * @description 月間ランキングを取得するハンドラー
 */

import { NextRequest, NextResponse } from 'next/server';
import { RankingType, RankingEntry, RankingQueryResult, UserRankingInfo } from './types';
import { 
  parseQueryParams, 
  calculatePagination, 
  createSupabaseClient, 
  getUserRankingInfo, 
  handleError 
} from './utils';

/**
 * 月間ランキングを取得する
 * @route GET /api/rankings/monthly
 */
export async function getMonthlyRankings(request: NextRequest) {
  try {
    // クエリパラメータを解析
    const validatedQuery = parseQueryParams(request);
    const { page, limit, type } = validatedQuery;
    
    // ページネーションの計算
    const { offset } = calculatePagination(page, limit);

    // Supabaseクライアントを作成
    const supabase = createSupabaseClient();

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
      throw rankingsError;
    }

    // 現在のセッションを取得
    const { data: { session } } = await supabase.auth.getSession();

    // 現在のユーザーのランキング情報を取得
    let currentUserRanking: UserRankingInfo | null = null;
    if (session) {
      const userId = session.user.id;

      // ランキングに含まれていない場合は、現在のユーザーのランキング情報を取得
      const isUserInRankings = rankings?.some((ranking: RankingQueryResult) => ranking.userId === userId);

      if (!isUserInRankings) {
        currentUserRanking = await getUserRankingInfo(
          supabase,
          userId,
          type,
          startOfMonth,
          endOfMonth
        );
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
    const { error: apiError, statusCode } = handleError(error, 'GET /api/rankings/monthly');
    return NextResponse.json(apiError.toResponse(), { status: statusCode });
  }
}
