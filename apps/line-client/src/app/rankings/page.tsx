// このファイルは、LINE クライアントのランキング画面です。
// 共通のRankingsPageコンポーネントを使用しています。

'use client';

import { RankingsPage } from '@shout2/ui/src/pages';

export default function Rankings() {
  // リファクタリング計画に従い、青系テーマに統一
  return <RankingsPage theme="blue" />;
}
