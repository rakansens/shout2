// このファイルは、LINE クライアントのゲーム画面です。
// 共通のGamePageコンポーネントを使用しています。
// リファクタリング計画に従い、青系テーマに統一しています。

'use client';

import { GamePage } from '@shout2/ui/src/pages';

export default function Game() {
  // リファクタリング計画に従い、青系テーマに統一
  return <GamePage theme="blue" />;
}
