// このファイルは、LINE クライアントのストア画面です。
// 共通のStorePageコンポーネントを使用しています。
// リファクタリング計画に従い、青系テーマに統一しています。

'use client';

import { StorePage } from '@shout2/ui/src/pages';

export default function Store() {
  // リファクタリング計画に従い、青系テーマに統一
  return <StorePage theme="blue" />;
}
