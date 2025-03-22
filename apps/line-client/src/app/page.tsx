// このファイルは、LINE クライアントのルートページです。
// 共通のTitlePageコンポーネントを使用しています。
// リファクタリング計画に従い、青系テーマに統一しています。

'use client';

import { TitlePage } from '@shout2/ui/src/pages';

export default function Title() {
  // リファクタリング計画に従い、青系テーマに統一
  return <TitlePage theme="blue" />;
}
