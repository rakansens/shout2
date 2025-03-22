/**
 * @file packages/api/src/handlers/songs/comments.ts
 * @description 楽曲コメント関連のハンドラー
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ApiError, ErrorCode, CommentSearchParams, CommentPostData } from './types';
import {
  createSupabaseClient,
  createSuccessResponse,
  handleError,
  createErrorResponse,
  parseQueryParams,
  calculatePagination,
  addLikeInfoToComments,
} from './utils';

// コメント検索クエリスキーマ
const commentSearchQuerySchema = z.object({
  sort: z.enum(['newest', 'oldest', 'likes']).default('newest'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// コメント投稿スキーマ
const commentPostSchema = z.object({
  content: z.string().min(1).max(500),
  rating: z.number().int().min(1).max(5).optional(),
});

/**
 * 楽曲コメント一覧を取得する
 * @route GET /api/songs/{id}/comments
 */
export async function getSongComments(
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

    // クエリパラメータを取得
    const url = new URL(request.url);
    const queryParams = parseQueryParams(url);

    // クエリパラメータをバリデーション
    const validatedQuery = commentSearchQuerySchema.parse({
      sort: queryParams.sort || 'newest',
      page: queryParams.page ? parseInt(queryParams.page) : 1,
      limit: queryParams.limit ? parseInt(queryParams.limit) : 20,
    });

    // ページネーションの計算
    const { page, limit } = validatedQuery;
    const offset = (page - 1) * limit;

    // Supabaseクライアントを作成
    const supabase = createSupabaseClient();

    // 楽曲が存在するか確認
    const { data: song, error: songError } = await supabase
      .from('songs')
      .select('id')
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

    // コメント一覧を取得するクエリを構築
    let query = supabase
      .from('song_comments')
      .select(`
        *,
        users (
          id,
          username,
          displayName,
          avatarUrl
        ),
        comment_likes (
          id,
          userId
        )
      `, { count: 'exact' })
      .eq('songId', songId);

    // ソート条件を適用
    const { sort } = validatedQuery;
    switch (sort) {
      case 'newest':
        query = query.order('createdAt', { ascending: false });
        break;
      case 'oldest':
        query = query.order('createdAt', { ascending: true });
        break;
      case 'likes':
        query = query.order('likeCount', { ascending: false });
        break;
    }

    // ページネーションを適用
    query = query.range(offset, offset + limit - 1);

    // コメントを取得
    const { data: comments, error: commentsError, count } = await query;

    if (commentsError) {
      throw new ApiError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'コメント一覧の取得に失敗しました',
        commentsError.message
      );
    }

    // 現在のセッションを取得
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    // ユーザーがログインしている場合、いいね済みのコメントを取得
    let userLikedCommentIds: string[] = [];
    if (session) {
      const { data: likedComments, error: likedCommentsError } = await supabase
        .from('comment_likes')
        .select('commentId')
        .eq('userId', session.user.id);

      if (!likedCommentsError && likedComments) {
        userLikedCommentIds = likedComments.map(like => like.commentId);
      }
    }

    // コメント一覧にユーザーのいいね情報を追加
    const commentsWithLikeInfo = addLikeInfoToComments(comments || [], userLikedCommentIds);

    // レスポンスを返す
    return createSuccessResponse({
      data: commentsWithLikeInfo,
      pagination: calculatePagination(page, limit, count),
    });
  } catch (error: any) {
    const { error: apiError } = handleError(error, 'GET /api/songs/[id]/comments');
    return createErrorResponse(apiError);
  }
}

/**
 * 楽曲にコメントを投稿する
 * @route POST /api/songs/{id}/comments
 */
export async function postSongComment(
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

    // 現在のセッションを取得
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (!session) {
      throw new ApiError(
        ErrorCode.UNAUTHORIZED,
        'コメントを投稿するにはログインが必要です',
      );
    }

    // リクエストボディを取得
    const body = await request.json();

    // リクエストボディをバリデーション
    const validatedBody = commentPostSchema.parse(body);

    // 楽曲が存在するか確認
    const { data: song, error: songError } = await supabase
      .from('songs')
      .select('id')
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

    // コメントを投稿
    const { data: comment, error: commentError } = await supabase
      .from('song_comments')
      .insert({
        songId,
        userId: session.user.id,
        content: validatedBody.content,
        likeCount: 0,
      })
      .select()
      .single();

    if (commentError) {
      throw new ApiError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'コメントの投稿に失敗しました',
        commentError.message
      );
    }

    // 評価が指定されている場合は評価も投稿
    if (validatedBody.rating) {
      const { data: rating, error: ratingError } = await supabase
        .from('song_ratings')
        .upsert({
          songId,
          userId: session.user.id,
          rating: validatedBody.rating,
        })
        .select()
        .single();

      if (ratingError) {
        console.error('Error in rating song:', ratingError);
      }
    }

    // レスポンスを返す
    return createSuccessResponse({
      data: comment,
    }, 201);
  } catch (error: any) {
    const { error: apiError } = handleError(error, 'POST /api/songs/[id]/comments');
    return createErrorResponse(apiError);
  }
}
