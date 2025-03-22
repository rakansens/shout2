// このファイルは、LINE クライアントの設定画面です。
// 共通のSettingsPageコンポーネントを使用しています。
// リファクタリング計画に従い、青系テーマに統一しています。

'use client';

import { SettingsPage } from '@shout2/ui/src/pages';

export default function Settings() {
  // リファクタリング計画に従い、青系テーマに統一
  return <SettingsPage theme="blue" />;
}
