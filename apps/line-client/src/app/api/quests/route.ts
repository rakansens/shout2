/**
 * @file apps/line-client/src/app/api/quests/route.ts
 * @description クエスト一覧を取得するAPIエンドポイント
 */

import { getQuestList } from '@shout2/api/src/handlers/quests';

/**
 * クエスト一覧を取得する
 * @route GET /api/quests
 */
export { getQuestList as GET };
