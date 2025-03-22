/**
 * @file apps/line-client/src/app/api/songs/[id]/comments/route.ts
 * @description 楽曲コメント一覧を取得・投稿するAPIエンドポイント
 */

import { getSongComments, postSongComment } from '@shout2/api/src/handlers/songs';

/**
 * 楽曲コメント一覧を取得する
 * @route GET /api/songs/{id}/comments
 */
export { getSongComments as GET };

/**
 * 楽曲にコメントを投稿する
 * @route POST /api/songs/{id}/comments
 */
export { postSongComment as POST };
