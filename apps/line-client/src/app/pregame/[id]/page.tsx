// このファイルは、LINE クライアントのプレゲーム画面です。
// 共通のPreGamePageコンポーネントを使用しています。
// リファクタリング計画に従い、青系テーマに統一しています。

'use client';

import { PreGamePage } from '@shout2/ui/src/pages';

export default function PreGame() {
  // リファクタリング計画に従い、青系テーマに統一
  return <PreGamePage theme="blue" />;
}
