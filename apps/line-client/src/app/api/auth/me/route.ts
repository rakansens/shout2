/**
 * @file apps/line-client/src/app/api/auth/me/route.ts
 * @description 現在のユーザー情報を取得するAPIエンドポイント
 */

import { getCurrentUser } from '@shout2/api/src/handlers/auth';

export { getCurrentUser as GET };
