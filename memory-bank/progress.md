# 進捗状況

このドキュメントは、Shout2プロジェクトの進捗状況を記録します。

## 2025年3月21日

### 完了した作業

- プロジェクト構造の設定
  - モノレポ構造の設定
  - 各アプリケーション（ton-client、line-client、admin）の基本構造の作成
  - 共有パッケージ（ui、api）の設定

- 環境設定
  - 環境変数の設定（.env.local）
  - Next.jsの設定（next.config.mjs）
  - Tailwind CSSの設定

- UIコンポーネントの移行
  - shout-ui-devからUIコンポーネントをpackages/ui/srcにコピー
  - コンポーネントのエントリーポイント（index.ts）を設定

- 認証機能の実装
  - Telegram認証の基本実装
  - LINE認証の基本実装
  - 管理者認証の基本実装
  - Supabaseに`users`テーブルを作成
  - 認証プロセスのデバッグ情報を強化

- Gitリポジトリの設定
  - リポジトリの初期化
  - GitHubへのプッシュ（https://github.com/rakansens/shout2.git）

- 動作確認
  - 各アプリケーションの起動テスト
  - 正常に動作することを確認

- 依存関係の修正
  - ton-clientアプリケーションの依存関係をインストール
  - Telegram Mini App SDK（@telegram-apps/sdk）をインストール
  - 'next: command not found'エラーを解決

- Telegram Mini App設定の改善
  - ton-clientのNext.js設定にbasePath: '/ton-client'を追加
  - assetPrefixも'/ton-client'に設定
  - Telegram認証プロセスのデバッグ情報を強化
  - UIにデバッグ情報表示領域を追加

- UIコンポーネントの適用
  - TONクライアントとLINEクライアントのホーム画面にUIコンポーネントを適用
  - react-router-domの依存関係を削除し、Next.jsと互換性のあるコンポーネントに修正
  - HeaderコンポーネントからuseNavigateを削除し、onProfileClickプロパティを追加
  - NavigationコンポーネントをNext.jsと互換性のあるように修正し、currentPathとonNavigateプロパティを追加
  - プラットフォーム別のテーマカラーを適用（TON：青系、LINE：緑系）
  - ダミーデータを追加して画面表示を確認

- ページの実装
  - **ホーム画面（home）**
    - メインレイアウト
    - ヘッダー
    - キャラクターパネル
    - イベントカルーセル
    - クエストリスト
    - ナビゲーション
    - プラットフォーム別テーマカラー

  - **ランキング画面（rankings）**
    - メインレイアウト
    - ヘッダー
    - ランキングタイプ切り替え（週間、月間、総合）
    - ランキングリスト表示
    - 上位ランカーの特別表示
    - 現在のユーザーのハイライト
    - ユーザープロフィールへのリンク
    - ナビゲーション
    - プラットフォーム別テーマカラー

  - **ストア画面（store）**
    - メインレイアウト
    - ヘッダー
    - カテゴリー切り替え
    - 商品リスト表示
    - 購入確認モーダル
    - ポイント表示
    - 限定商品の特別表示
    - ナビゲーション
    - プラットフォーム別テーマカラー

### 進行中の作業

- 各ページの実装
  - settings（設定）ページの実装
  - profile（プロフィール）ページの実装

### 次のタスク

- APIエンドポイントの実装
  - クエストデータのAPI
  - キャラクターデータのAPI
  - イベントデータのAPI
- Supabaseとの連携
- テストの実施
- デプロイ

## 全体の進捗

- 環境構築: 100%
- 基本的なプロジェクト構造: 100%
- UIコンポーネントの移行: 100%
- UIコンポーネントの適用: 75%（ホーム、ランキング、ストア画面完了）
- 認証機能の実装: 80%
- ページの実装: 60%（ホーム、ランキング、ストア画面完了）
- APIエンドポイントの実装: 0%
- Supabaseとの連携: 20%
- テスト: 0%
- デプロイ: 0%

## マイルストーン

- [x] プロジェクト構造の設定
- [x] 環境設定
- [x] UIコンポーネントの移行
- [x] 認証機能の基本実装
- [x] ホーム画面の実装
- [x] ランキング画面の実装
- [x] ストア画面の実装
- [ ] 設定画面の実装
- [ ] プロフィール画面の実装
- [ ] APIエンドポイントの実装
- [ ] Supabaseとの連携
- [ ] テスト
- [ ] デプロイ

## 課題とリスク

- Telegram Mini AppとLINE LIFFの統合における互換性の問題
- Supabaseの認証機能とプラットフォーム固有の認証の連携
- UIコンポーネントの両プラットフォームでの一貫した動作
- Telegram Mini Appの認証プロセスのデバッグが困難（コンソールログが見えない）

## 次のステップ

1. 各ページの実装
   - settings（設定）ページの実装
   - profile（プロフィール）ページの実装
2. APIエンドポイントの実装
3. Supabaseとの連携
4. テストの実施
5. デプロイ

## UIコンポーネント管理

- UIコンポーネントは`packages/ui`ディレクトリで一元管理
- 変更は`packages/ui`のコンポーネントに対して行う
- 各アプリケーションでは、共通のUIコンポーネントを使用しながら、プロパティを通じてプラットフォーム固有のカスタマイズを行う
- TONクライアントは青系のカラーテーマ、LINEクライアントは緑系のカラーテーマを使用

## 実装済みファイル

### UIコンポーネント（共通）
- [x] `/packages/ui/src/components/Header/Header.tsx` - Next.js対応のヘッダーコンポーネント
- [x] `/packages/ui/src/components/Navigation/Navigation.tsx` - Next.js対応のナビゲーションコンポーネント
- [x] `/packages/ui/src/components/MainLayout/MainLayout.tsx` - メインレイアウトコンポーネント
- [x] `/packages/ui/src/components/ui/character-panel.tsx` - キャラクターパネルコンポーネント
- [x] `/packages/ui/src/components/Carousel/EventCarousel.tsx` - イベントカルーセルコンポーネント
- [x] `/packages/ui/src/components/ui/quest-card.tsx` - クエストカードコンポーネント
- [x] `/packages/ui/src/components/Store/PurchaseConfirmationModal.tsx` - 購入確認モーダルコンポーネント

### TONクライアント
- [x] `/apps/ton-client/src/app/home/page.tsx` - ホーム画面（青系テーマ）
- [x] `/apps/ton-client/src/app/rankings/page.tsx` - ランキング画面（青系テーマ）
- [x] `/apps/ton-client/src/app/store/page.tsx` - ストア画面（青系テーマ）

### LINEクライアント
- [x] `/apps/line-client/src/app/home/page.tsx` - ホーム画面（緑系テーマ）
- [x] `/apps/line-client/src/app/rankings/page.tsx` - ランキング画面（緑系テーマ）
- [x] `/apps/line-client/src/app/store/page.tsx` - ストア画面（緑系テーマ）
