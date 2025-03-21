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
  - URL遷移クエスト関連のAPIエンドポイントの実装
  - 楽曲関連のAPIエンドポイントの実装
  - ランキング関連のAPIエンドポイントの実装
  - ストア関連のAPIエンドポイントの実装
  - ソーシャル連携APIの実装
  - ロック機構の実装

### 完了した作業（2025年3月21日追加）

- APIスキーマの実装
  - 共通スキーマの設計
  - エラースキーマの設計
  - ユーザースキーマの設計
  - クエストスキーマの設計
  - 楽曲スキーマの設計
  - ランキングスキーマの設計
  - ストアスキーマの設計
  - ソーシャル連携スキーマの設計
  - インデックスファイルの作成

- ユーザー認証とプロフィール関連のAPIエンドポイントの実装
  - `GET /api/auth/me` - 現在のユーザー情報取得
  - `POST /api/auth/logout` - ログアウト
  - `GET /api/users/{id}` - ユーザープロフィール取得
  - `PATCH /api/users/{id}` - ユーザープロフィール更新

### 次のタスク

- Supabaseとの連携
- テストの実施
- デプロイ

### API実装計画

#### フェーズ1：基本データモデルとスキーマ設計（1週目）

1. **共通スキーマの設計**
   - `packages/api/src/schemas/common.ts` - 共通型定義
   - `packages/api/src/schemas/error.ts` - エラー型定義

2. **ユーザースキーマの設計**
   - `packages/api/src/schemas/user.ts`
   - 基本プロフィール情報
   - 認証情報

3. **クエストスキーマの設計**
   - `packages/api/src/schemas/quest.ts`
   - クエストタイプの定義（URL遷移、Twitter連携など）
   - クエスト要件の定義

4. **楽曲スキーマの設計**
   - `packages/api/src/schemas/song.ts`
   - 楽曲情報
   - コメント情報

5. **ランキングスキーマの設計**
   - `packages/api/src/schemas/ranking.ts`

6. **ストアスキーマの設計**
   - `packages/api/src/schemas/store.ts`

7. **ソーシャル連携スキーマの設計**
   - `packages/api/src/schemas/social.ts`
   - Twitter連携情報
   - ウォレット連携情報

#### フェーズ2：基本APIエンドポイント実装（2-3週目）

##### 優先度1：ユーザー認証とプロフィール
- `GET /api/auth/me` - 現在のユーザー情報取得
- `POST /api/auth/logout` - ログアウト
- `GET /api/users/{id}` - ユーザープロフィール取得
- `PATCH /api/users/{id}` - ユーザープロフィール更新

##### 優先度2：URL遷移クエスト
- `GET /api/quests` - クエスト一覧取得
- `GET /api/quests/{id}` - クエスト詳細取得
- `POST /api/quests/{id}/visit` - URL訪問報告
- `GET /api/quests/url/{trackingId}` - トラッキングID検証

##### 優先度3：楽曲関連API
- `GET /api/songs` - 楽曲一覧取得
- `GET /api/songs/{id}` - 楽曲詳細取得
- `GET /api/songs/{id}/comments` - コメント一覧取得
- `POST /api/songs/{id}/comments` - コメント投稿

##### 優先度4：ランキングAPI
- `GET /api/rankings/weekly` - 週間ランキング
- `GET /api/rankings/monthly` - 月間ランキング
- `GET /api/rankings/all-time` - 総合ランキング

##### 優先度5：ストアAPI
- `GET /api/store/items` - 商品一覧取得
- `GET /api/store/items/{id}` - 商品詳細取得

#### フェーズ3：ソーシャル連携とSNSクエスト（4-5週目）

##### 優先度1：Twitter連携
- `GET /api/auth/connect/twitter` - Twitter連携開始
- `GET /api/auth/connect/twitter/callback` - コールバック処理
- `GET /api/user/connections` - 連携済みアカウント一覧
- `DELETE /api/auth/connect/twitter` - 連携解除
- `POST /api/quests/{id}/complete` - クエスト完了報告
- `POST /api/quests/verify/twitter` - Twitter連携後の自動検証

##### 優先度2：ウォレット連携
- `POST /api/auth/connect/wallet` - ウォレット連携
- `DELETE /api/auth/connect/wallet` - 連携解除

##### 優先度3：その他SNS連携
- 各SNSプラットフォーム用の連携APIを実装

#### フェーズ4：高度な機能実装（6週目以降）

1. **クエスト自動検証システム**
   - Webhookの設定
   - バックグラウンド検証ジョブ

2. **ポイント管理システム**
   - ポイント付与・消費ロジック
   - ポイント履歴管理

3. **通知システム**
   - クエスト完了通知
   - 新規クエスト通知

4. **分析・レポート機能**
   - クエスト完了率分析
   - ユーザーエンゲージメント分析

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
