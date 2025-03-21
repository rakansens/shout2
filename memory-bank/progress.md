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

  - **設定画面（settings）**
    - メインレイアウト
    - ヘッダー
    - アカウント設定
    - 通知設定
    - 表示設定
    - プライバシー設定
    - アプリ情報
    - 言語選択モーダル
    - ログアウト機能
    - ナビゲーション
    - プラットフォーム別テーマカラー

  - **プロフィール画面（profile）**
    - メインレイアウト
    - ヘッダー
    - ユーザー情報の表示（ユーザー名、レベル、経験値、参加日）
    - 自己紹介の表示と編集機能
    - 実績タブと統計タブの切り替え機能
    - 実績リストの表示（獲得済み/未獲得の区別）
    - 統計情報の表示（完了クエスト、参加イベント、獲得ポイント、ランク）
    - ナビゲーション
    - プラットフォーム別テーマカラー

  - **楽曲詳細・コメント画面（pregame）**
    - メインレイアウト
    - ヘッダー
    - 楽曲カード
    - 楽曲情報表示
    - コメント一覧表示
    - コメント投稿機能
    - プレイボタン
    - 戻るボタン
    - プラットフォーム別テーマカラー

- アニメーション機能の実装
  - 画面遷移アニメーションの実装
  - エントリー/エグジットアニメーションの実装
  - アニメーション設定の管理機能
  - コンテキストプロバイダーの実装
    - NextNavigationContext
    - AnimationSettingsContext
    - NotificationContext
  - Next.jsのServer/Clientコンポーネントエラーの修正
    - コンテキストプロバイダーに'use client'ディレクティブを追加

- UIコンポーネントの共通化
  - `PreGame`コンポーネントを共通化して`/packages/ui/src/components/PreGame`に移動
  - プラットフォーム固有のカスタマイズをプロパティで制御
  - TONクライアントとLINEクライアントで共通コンポーネントを使用

### 進行中の作業

- APIエンドポイントの実装
  - クエストデータのAPI
  - キャラクターデータのAPI
  - イベントデータのAPI

### 次のタスク

- Supabaseとの連携
- テストの実施
- デプロイ

## 全体の進捗

- 環境構築: 100%
- 基本的なプロジェクト構造: 100%
- UIコンポーネントの移行: 100%
- UIコンポーネントの適用: 100%（ホーム、ランキング、ストア、設定、プロフィール画面完了）
- 認証機能の実装: 80%
- ページの実装: 100%（ホーム、ランキング、ストア、設定、プロフィール画面完了）
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
- [x] 設定画面の実装
- [x] プロフィール画面の実装
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

1. APIエンドポイントの実装
   - クエストデータのAPI
   - キャラクターデータのAPI
   - イベントデータのAPI
2. Supabaseとの連携
3. テストの実施
4. デプロイ

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
- [x] `/packages/ui/src/components/Settings/LanguageSelectionModal.tsx` - 言語選択モーダルコンポーネント
- [x] `/packages/ui/src/components/PreGame/PreGame.tsx` - 楽曲詳細・コメント画面コンポーネント
- [x] `/packages/ui/src/components/PreGame/index.ts` - PreGameコンポーネントのエクスポート

### TONクライアント
- [x] `/apps/ton-client/src/app/home/page.tsx` - ホーム画面（青系テーマ）
- [x] `/apps/ton-client/src/app/rankings/page.tsx` - ランキング画面（青系テーマ）
- [x] `/apps/ton-client/src/app/store/page.tsx` - ストア画面（青系テーマ）
- [x] `/apps/ton-client/src/app/settings/page.tsx` - 設定画面（青系テーマ）
- [x] `/apps/ton-client/src/app/profile/page.tsx` - プロフィール画面（青系テーマ）
- [x] `/apps/ton-client/src/app/pregame/page.tsx` - 楽曲詳細・コメント画面（青系テーマ）

### LINEクライアント
- [x] `/apps/line-client/src/app/home/page.tsx` - ホーム画面（緑系テーマ）
- [x] `/apps/line-client/src/app/rankings/page.tsx` - ランキング画面（緑系テーマ）
- [x] `/apps/line-client/src/app/store/page.tsx` - ストア画面（緑系テーマ）
- [x] `/apps/line-client/src/app/settings/page.tsx` - 設定画面（緑系テーマ）
- [x] `/apps/line-client/src/app/profile/page.tsx` - プロフィール画面（緑系テーマ）
- [x] `/apps/line-client/src/app/pregame/page.tsx` - 楽曲詳細・コメント画面（緑系テーマ）
