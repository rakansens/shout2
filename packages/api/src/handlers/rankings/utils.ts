/**
 * @file packages/api/src/handlers/rankings/utils.ts
 * @description ランキング関連の共通ユーティリティ関数
 */

import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ErrorCode, ApiError } from '../../schemas/error';
import { RankingType, rankingSearchQuerySchema, RankingQueryResult, UserRankingInfo } from './types';

// 環境変数からSupabaseの接続情報を取得
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * クエリパラメータを解析してバリデーションする
 */
export function parseQueryParams(request: NextRequest) {
  const url = new URL(request.url);
  const queryParams: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  // クエリパラメータをバリデーション
  return rankingSearchQuerySchema.parse({
    type: queryParams.type as RankingType || RankingType.POINTS,
    page: queryParams.page ? parseInt(queryParams.page) : 1,
    limit: queryParams.limit ? parseInt(queryParams.limit) : 20,
  });
}

/**
 * ページネーションの計算
 */
export function calculatePagination(page: number, limit: number) {
  return {
    offset: (page - 1) * limit,
    limit,
  };
}

/**
 * Supabaseクライアントを作成
 */
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * ユーザーのランキング情報を取得
 */
export async function getUserRankingInfo(
  supabase: any,
  userId: string,
  type: RankingType,
  startDate?: Date | null,
  endDate?: Date | null
): Promise<UserRankingInfo | null> {
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
        .eq('userId', userId);
      
      // 日付範囲が指定されている場合は条件を追加
      if (startDate && endDate) {
        userRankingQuery = userRankingQuery
          .gte('createdAt', startDate.toISOString())
          .lte('createdAt', endDate.toISOString());
      }
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
        .eq('userId', userId);
      
      // 日付範囲が指定されている場合は条件を追加
      if (startDate && endDate) {
        userRankingQuery = userRankingQuery
          .gte('completedAt', startDate.toISOString())
          .lte('completedAt', endDate.toISOString());
      }
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
        .eq('userId', userId);
      
      // 日付範囲が指定されている場合は条件を追加
      if (startDate && endDate) {
        userRankingQuery = userRankingQuery
          .gte('playedAt', startDate.toISOString())
          .lte('playedAt', endDate.toISOString());
      }
      break;
  }

  const { data: userRanking, error: userRankingError } = await userRankingQuery;

  if (userRankingError || !userRanking || userRanking.length === 0) {
    return null;
  }

  // ユーザーのランキング順位を取得
  let rankQuery: any;

  switch (type) {
    case RankingType.POINTS:
      rankQuery = supabase
        .from('user_points_history')
        .select('userId, points:sum');
      
      // 日付範囲が指定されている場合は条件を追加
      if (startDate && endDate) {
        rankQuery = rankQuery
          .gte('createdAt', startDate.toISOString())
          .lte('createdAt', endDate.toISOString());
      }
      
      rankQuery = rankQuery.order('points', { ascending: false });
      break;

    case RankingType.QUESTS:
      rankQuery = supabase
        .from('user_quest_completions')
        .select('userId, count');
      
      // 日付範囲が指定されている場合は条件を追加
      if (startDate && endDate) {
        rankQuery = rankQuery
          .gte('completedAt', startDate.toISOString())
          .lte('completedAt', endDate.toISOString());
      }
      
      rankQuery = rankQuery.order('count', { ascending: false });
      break;

    case RankingType.SONGS:
      rankQuery = supabase
        .from('song_play_history')
        .select('userId, score:sum');
      
      // 日付範囲が指定されている場合は条件を追加
      if (startDate && endDate) {
        rankQuery = rankQuery
          .gte('playedAt', startDate.toISOString())
          .lte('playedAt', endDate.toISOString());
      }
      
      rankQuery = rankQuery.order('score', { ascending: false });
      break;
  }

  const { data: allRankings, error: allRankingsError } = await rankQuery;

  if (allRankingsError || !allRankings) {
    return null;
  }

  // ユーザーの順位を計算
  const userRank = allRankings.findIndex((ranking: any) => ranking.userId === userId) + 1;

  return {
    ...userRanking[0],
    rank: userRank,
  };
}

/**
 * エラーハンドリング
 */
export function handleError(error: any, context: string) {
  console.error(`Error in ${context}:`, error);

  if (error instanceof ApiError) {
    return { error, statusCode: error.statusCode };
  }

  if (error instanceof z.ZodError) {
    const apiError = new ApiError(
      ErrorCode.VALIDATION_ERROR,
      'バリデーションエラー',
      error.errors
    );
    return { error: apiError, statusCode: apiError.statusCode };
  }

  const apiError = new ApiError(
    ErrorCode.INTERNAL_SERVER_ERROR,
    '内部サーバーエラー',
    error instanceof Error ? error.message : String(error)
  );
  return { error: apiError, statusCode: apiError.statusCode };
}
