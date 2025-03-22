// このファイルは、LINE クライアントのプレイ結果画面です。
// 共通のPlayPageコンポーネントを使用しています。
// リファクタリング計画に従い、青系テーマに統一しています。

'use client';

import { PlayPage } from '@shout2/ui/src/pages';

export default function Play() {
  // リファクタリング計画に従い、青系テーマに統一
  return <PlayPage theme="blue" />;
}
