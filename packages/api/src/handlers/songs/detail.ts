/**
 * @file packages/api/src/handlers/songs/detail.ts
 * @description 楽曲詳細を取得するハンドラー
 */

import { NextRequest } from 'next/server';
import { ApiError, ErrorCode } from './types';
import {
  createSupabaseClient,
  createSuccessResponse,
  handleError,
  createErrorResponse,
} from './utils';

/**
 * 楽曲詳細を取得する
 * @route GET /api/songs/{id}
 */
export async function getSongDetail(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const songId = params.id;

    if (!songId) {
      throw new ApiError(
        ErrorCode.VALIDATION_ERROR,
        '楽曲IDが指定されていません',
      );
    }

    // Supabaseクライアントを作成
    const supabase = createSupabaseClient();

    // 楽曲詳細を取得
    const { data: song, error: songError } = await supabase
      .from('songs')
      .select(`
        *,
        artists(*),
        song_notes(*)
      `)
      .eq('id', songId)
      .single();

    if (songError) {
      if (songError.code === 'PGRST116') {
        throw new ApiError(
          ErrorCode.NOT_FOUND,
          '楽曲が見つかりません',
          songError.message
        );
      }
      throw new ApiError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        '楽曲情報の取得に失敗しました',
        songError.message
      );
    }

    // 現在のセッションを取得
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    // ユーザーがログインしている場合、楽曲の再生履歴を取得
    let playHistory = null;
    if (session) {
      const { data: history, error: historyError } = await supabase
        .from('song_play_history')
        .select('*')
        .eq('userId', session.user.id)
        .eq('songId', songId)
        .single();

      if (!historyError && history) {
        playHistory = history;
      }
    }

    // 楽曲の高得点ランキングを取得
    const { data: rankings, error: rankingsError } = await supabase
      .from('song_play_history')
      .select(`
        id,
        score,
        playedAt,
        users (
          id,
          username,
          displayName,
          avatarUrl
        )
      `)
      .eq('songId', songId)
      .order('score', { ascending: false })
      .limit(10);

    // 楽曲のコメント数を取得
    const { count: commentCount, error: commentCountError } = await supabase
      .from('song_comments')
      .select('id', { count: 'exact' })
      .eq('songId', songId);

    // 楽曲の平均評価を取得
    const { data: ratings, error: ratingsError } = await supabase
      .from('song_ratings')
      .select('rating')
      .eq('songId', songId);

    let averageRating = 0;
    if (ratings && ratings.length > 0) {
      const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
      averageRating = sum / ratings.length;
    }

    // 関連楽曲を取得（同じアーティストの曲や同じカテゴリーの曲）
    const { data: relatedSongs, error: relatedSongsError } = await supabase
      .from('songs')
      .select('id, title, coverUrl, artists(name), difficulty')
      .or(`artistId.eq.${song.artistId},category.eq.${song.category}`)
      .neq('id', songId)
      .limit(5);

    // レスポンスを返す
    return createSuccessResponse({
      data: {
        ...song,
        playHistory,
        rankings: rankings || [],
        commentCount: commentCount || 0,
        averageRating,
        relatedSongs: relatedSongs || [],
      },
    });
  } catch (error: any) {
    const { error: apiError } = handleError(error, 'GET /api/songs/[id]');
    return createErrorResponse(apiError);
  }
}
