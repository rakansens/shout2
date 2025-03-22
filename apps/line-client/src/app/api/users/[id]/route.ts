/**
 * @file apps/line-client/src/app/api/users/[id]/route.ts
 * @description ユーザープロフィール情報を取得・更新するAPIエンドポイント
 */

import { getUserProfile, updateUserProfile } from '@shout2/api/src/handlers/auth';

export { getUserProfile as GET, updateUserProfile as PATCH };
