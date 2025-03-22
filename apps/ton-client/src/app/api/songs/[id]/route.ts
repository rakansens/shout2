/**
 * @file apps/ton-client/src/app/api/songs/[id]/route.ts
 * @description 楽曲詳細を取得するAPIエンドポイント
 */

import { getSongDetail } from '@shout2/api/src/handlers/songs';

/**
 * 楽曲詳細を取得する
 * @route GET /api/songs/{id}
 */
export { getSongDetail as GET };
