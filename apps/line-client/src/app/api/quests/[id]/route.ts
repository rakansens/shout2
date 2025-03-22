/**
 * @file apps/line-client/src/app/api/quests/[id]/route.ts
 * @description 特定のクエストの詳細情報を取得するAPIエンドポイント
 */

import { getQuestDetail } from '@shout2/api/src/handlers/quests';

/**
 * 特定のクエストの詳細情報を取得する
 * @route GET /api/quests/{id}
 */
export { getQuestDetail as GET };
