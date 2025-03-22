/**
 * @file apps/ton-client/src/app/api/quests/[id]/visit/route.ts
 * @description URL訪問を報告するAPIエンドポイント
 */

import { generateTrackingId, reportUrlVisit } from '@shout2/api/src/handlers/quests';

/**
 * トラッキングIDを生成する
 * @route GET /api/quests/{id}/visit
 */
export { generateTrackingId as GET };

/**
 * URL訪問を報告する
 * @route POST /api/quests/{id}/visit
 */
export { reportUrlVisit as POST };
