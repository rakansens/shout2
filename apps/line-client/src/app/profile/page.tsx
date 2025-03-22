// このファイルは、LINE クライアントのプロフィール画面です。
// 共通のProfilePageコンポーネントを使用しています。
// リファクタリング計画に従い、青系テーマに統一しています。

'use client';

import { ProfilePage } from '@shout2/ui/src/pages';

export default function Profile() {
  // リファクタリング計画に従い、青系テーマに統一
  return <ProfilePage theme="blue" />;
}
