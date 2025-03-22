/**
 * @file packages/api/src/handlers/songs/utils.ts
 * @description 楽曲関連のユーティリティ関数
 */

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ApiError, ErrorCode, PaginationInfo } from './types';

/**
 * Supabaseクライアントを作成する
 */
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * 成功レスポンスを作成する
 */
export function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}

/**
 * エラーレスポンスを作成する
 */
export function createErrorResponse(error: ApiError) {
  return NextResponse.json({
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
    },
  }, { status: error.statusCode });
}

/**
 * エラーをハンドリングする
 */
export function handleError(error: any, endpoint: string) {
  console.error(`Error in ${endpoint}:`, error);

  if (error instanceof ApiError) {
    return { error };
  }

  if (error instanceof z.ZodError) {
    const apiError = new ApiError(
      ErrorCode.VALIDATION_ERROR,
      'バリデーションエラー',
      error.errors
    );
    return { error: apiError };
  }

  const apiError = new ApiError(
    ErrorCode.INTERNAL_SERVER_ERROR,
    '内部サーバーエラー',
    error instanceof Error ? error.message : String(error)
  );
  return { error: apiError };
}

/**
 * ページネーション情報を計算する
 */
export function calculatePagination(page: number, limit: number, count: number | null | undefined): PaginationInfo {
  return {
    page,
    limit,
    total: count || 0,
    totalPages: count ? Math.ceil(count / limit) : 0,
  };
}

/**
 * クエリパラメータをオブジェクトに変換する
 */
export function parseQueryParams(url: URL): Record<string, string> {
  const queryParams: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });
  return queryParams;
}

/**
 * 30日以内の日付を取得する（新曲判定用）
 */
export function getThirtyDaysAgo(): string {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return thirtyDaysAgo.toISOString();
}

/**
 * 楽曲の再生履歴をマップに変換する
 */
export function createPlayHistoryMap(playHistory: any[]): Record<string, any> {
  if (!playHistory) return {};
  
  return playHistory.reduce((acc, history) => {
    acc[history.songId] = {
      lastPlayedAt: history.lastPlayedAt,
      playCount: history.playCount,
      highScore: history.highScore,
    };
    return acc;
  }, {} as Record<string, any>);
}

/**
 * 楽曲一覧にユーザーの再生履歴を追加する
 */
export function addPlayHistoryToSongs(songs: any[], playHistoryMap: Record<string, any>): any[] {
  if (!songs) return [];
  
  return songs.map(song => {
    const history = playHistoryMap[song.id];
    return {
      ...song,
      playHistory: history || null,
    };
  });
}

/**
 * コメントにユーザーのいいね情報を追加する
 */
export function addLikeInfoToComments(comments: any[], userLikedCommentIds: string[]): any[] {
  if (!comments) return [];
  
  return comments.map(comment => {
    const isLiked = userLikedCommentIds.includes(comment.id);
    return {
      ...comment,
      isLikedByUser: isLiked,
    };
  });
}
