/**
 * @file apps/line-client/src/app/api/quests/url/[trackingId]/route.ts
 * @description トラッキングIDを検証するAPIエンドポイント
 */

import { verifyTrackingId } from '@shout2/api/src/handlers/quests';

/**
 * トラッキングIDを検証する
 * @route GET /api/quests/url/{trackingId}
 */
export { verifyTrackingId as GET };
