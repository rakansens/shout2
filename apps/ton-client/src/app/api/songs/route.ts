/**
 * @file apps/ton-client/src/app/api/songs/route.ts
 * @description 楽曲一覧を取得するAPIエンドポイント
 */

import { getSongList } from '@shout2/api/src/handlers/songs';

/**
 * 楽曲一覧を取得する
 * @route GET /api/songs
 */
export { getSongList as GET };
