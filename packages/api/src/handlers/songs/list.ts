/**
 * @file packages/api/src/handlers/songs/list.ts
 * @description 楽曲一覧を取得するハンドラー
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ApiError, ErrorCode, SongCategory, SongDifficulty, SongSearchParams } from './types';
import {
  createSupabaseClient,
  createSuccessResponse,
  handleError,
  createErrorResponse,
  parseQueryParams,
  calculatePagination,
  getThirtyDaysAgo,
  createPlayHistoryMap,
  addPlayHistoryToSongs,
} from './utils';

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
export async function getSongList(request: NextRequest) {
  try {
    // クエリパラメータを取得
    const url = new URL(request.url);
    const queryParams = parseQueryParams(url);

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
    const supabase = createSupabaseClient();

    // 楽曲一覧を取得するクエリを構築
    let query = supabase
      .from('songs')
      .select('*, artists(*)', { count: 'exact' });

    // フィルタリング条件を適用
    applyFilters(query, validatedQuery);

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
        songPlayHistory = createPlayHistoryMap(playHistory);
      }
    }

    // 楽曲一覧にユーザーの再生履歴を追加
    const songsWithPlayHistory = addPlayHistoryToSongs(songs || [], songPlayHistory);

    // レスポンスを返す
    return createSuccessResponse({
      data: songsWithPlayHistory,
      pagination: calculatePagination(page, limit, count),
    });
  } catch (error: any) {
    const { error: apiError } = handleError(error, 'GET /api/songs');
    return createErrorResponse(apiError);
  }
}

/**
 * クエリにフィルタリング条件を適用する
 */
function applyFilters(query: any, params: SongSearchParams) {
  if (params.query) {
    query = query.or(`title.ilike.%${params.query}%,artists.name.ilike.%${params.query}%`);
  }

  if (params.category) {
    query = query.eq('category', params.category);
  }

  if (params.difficulty) {
    query = query.eq('difficulty', params.difficulty);
  }

  if (params.isNew !== undefined) {
    // 30日以内にリリースされた曲を「新曲」とする
    if (params.isNew) {
      query = query.gte('releaseDate', getThirtyDaysAgo());
    }
  }

  if (params.isFeatured !== undefined) {
    query = query.eq('isFeatured', params.isFeatured);
  }

  if (params.artistId) {
    query = query.eq('artistId', params.artistId);
  }

  return query;
}
