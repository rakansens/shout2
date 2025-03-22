// このファイルは、LINE クライアントの結果表示画面です。
// 共通のResultPageコンポーネントを使用しています。
// リファクタリング計画に従い、青系テーマに統一しています。

'use client';

import { ResultPage } from '@shout2/ui/src/pages';

export default function Result() {
  // リファクタリング計画に従い、青系テーマに統一
  return <ResultPage theme="blue" />;
}
