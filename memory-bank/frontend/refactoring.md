# フロントエンドリファクタリング

このドキュメントは、Shout2プロジェクトのフロントエンドリファクタリングに関する情報を記録します。

## 概要

フロントエンドリファクタリングの主な目的は、コードの重複を削減し、保守性を向上させることです。具体的には、以下の作業を行いました：

1. 共通ページコンポーネントの作成
2. React Router依存部分のNext.js互換への変換
3. アニメーション関連の修正
4. テーマの統一
5. コンテキストとフックの整理

## 完了したリファクタリング

### 共通ページコンポーネントの作成

- `packages/ui/src/pages/`ディレクトリを作成し、以下のコンポーネントを実装
  - `HomePage.tsx`: ton-clientとline-clientのホームページを共通コンポーネントを使用するように修正
  - `RankingsPage.tsx`: ton-clientとline-clientのランキングページを共通コンポーネントを使用するように修正
  - `SettingsPage.tsx`: ton-clientとline-clientの設定ページを共通コンポーネントを使用するように修正
  - `StorePage.tsx`: ton-clientとline-clientのストアページを共通コンポーネントを使用するように修正
  - `ProfilePage.tsx`: ton-clientとline-clientのプロフィールページを共通コンポーネントを使用するように修正
  - `PreGamePage.tsx`: ton-clientとline-clientのプレゲームページを共通コンポーネントを使用するように修正
  - `GamePage.tsx`: ton-clientとline-clientのゲームページを共通コンポーネントを使用するように修正
  - `PlayPage.tsx`: ton-clientとline-clientのプレイ結果ページを共通コンポーネントを使用するように修正
  - `TitlePage.tsx`: ton-clientとline-clientのタイトル画面を共通コンポーネントを使用するように修正
  - `ResultPage.tsx`: ton-clientとline-clientの結果表示画面を共通コンポーネントを使用するように修正
  - `QuestDetailPage.tsx`: ton-clientとline-clientのクエスト詳細ページを共通コンポーネントを使用するように修正
- リファクタリング計画に従い、両クライアントとも青系テーマに統一

### React Router依存部分のNext.js互換への変換

- `useLocation` → `usePathname`
- `useNavigate` → `useRouter`
- ルーティング関連のコードをNext.js互換に修正
- `NavigationAnimationContext`をNext.js用に書き換え
- `useScreenAnimation`と`useScreenEntryExit`フックをNext.js用に書き換え

### アニメーション関連の修正

- `useScreenAnimation` → `useNextScreenAnimation` → `useUnifiedScreenAnimation`
- `useScreenEntryExit` → `useNextScreenEntryExit` → `useUnifiedScreenEntryExit`
- 各フックにpathnameパラメータを追加し、現在のパスに基づいてアニメーションを制御するように改善

### テーマ対応

- テーマプロパティを追加（デフォルトは青系）
- 色の参照を動的に変更可能に
- 両クライアントとも青系テーマに統一

### コンテキストとフックの整理

- 複数のナビゲーションコンテキストを統合し、`UnifiedNavigationContext`を作成
  - `NavigationContext.tsx`と`NextNavigationContext.tsx`を統合
  - React RouterとNext.jsの両方に対応した統合されたコンテキストを実装
  - `isNextJs`フラグを追加して、使用中のフレームワークに応じて適切な動作を選択
- 画面遷移アニメーション用のフックを統合
  - `useScreenAnimation`と`useNextScreenAnimation`を統合し、`useUnifiedScreenAnimation`を作成
  - `useScreenEntryExit`と`useNextScreenEntryExit`を統合し、`useUnifiedScreenEntryExit`を作成
- 以下のページコンポーネントを更新し、新しいコンテキストとフックを使用するように修正
  - `HomePage.tsx`: `useNextScreenEntryExit`→`useUnifiedScreenEntryExit`、`useNextNavigation`→`useNavigation`
  - `RankingsPage.tsx`: `useNextScreenEntryExit`→`useUnifiedScreenEntryExit`、`useNextNavigation`→`useNavigation`
  - `SettingsPage.tsx`: `useNextScreenEntryExit`→`useUnifiedScreenEntryExit`、`useNextNavigation`→`useNavigation`
  - `StorePage.tsx`: `useNextScreenEntryExit`→`useUnifiedScreenEntryExit`、`useNextNavigation`→`useNavigation`
  - `ProfilePage.tsx`: `useNextScreenEntryExit`→`useUnifiedScreenEntryExit`
  - `PreGamePage.tsx`: `useNextScreenEntryExit`→`useUnifiedScreenEntryExit`
  - `GamePage.tsx`: `useNextScreenEntryExit`→`useUnifiedScreenEntryExit`
  - `PlayPage.tsx`: `useNextScreenEntryExit`→`useUnifiedScreenEntryExit`
- 重複するフックとコンテキストを削除
  - `useScreenAnimation.ts` - `useUnifiedScreenAnimation.ts`に統合済み
  - `useScreenEntryExit.ts` - `useUnifiedScreenEntryExit.ts`に統合済み
  - `useNextScreenAnimation.ts` - `useUnifiedScreenAnimation.ts`に統合済み
  - `useNextScreenEntryExit.ts` - `useUnifiedScreenEntryExit.ts`に統合済み
  - `NavigationContext.tsx` - `UnifiedNavigationContext.tsx`に統合済み
  - `NextNavigationContext.tsx` - `UnifiedNavigationContext.tsx`に統合済み
  - `NavigationAnimationContext.tsx` - `UnifiedNavigationContext.tsx`に統合済み

## 楽曲カード選択時の空表示問題の修正

- `Play.tsx`コンポーネントのフックをNext.js互換に変更
  - `useScreenAnimation`を`useUnifiedScreenAnimation`に置き換え
  - `useScreenEntryExit`を`useUnifiedScreenEntryExit`に置き換え
  - `usePathname`を追加して現在のパスを取得
  - 各フックにpathnameパラメータを渡すように修正
- 楽曲カードをクリックすると空の表示になる問題を解決

## 次のステップ

1. **残りのreact-router-dom依存コンポーネントの修正**
   - 詳細は `memory-bank/refactoring/refactoring_plan.md` を参照

2. **UIコンポーネントのテスト**
   - 各ページコンポーネントの動作確認
   - アニメーションの確認
   - レスポンシブデザインの確認

## リファクタリングのメリット

- コードの重複を削減
- 保守性の向上
- 機能追加や変更が容易に
- バグ修正が一箇所で可能
- 一貫性の確保
- コードベースの簡素化
- 混乱の軽減
