# 進捗状況

このドキュメントは、Shout2プロジェクトの進捗状況を記録します。

## 2025年3月22日

### 完了した作業

- **フロントエンドの共通化（進行中）**
  - `packages/ui/src/pages/HomePage.tsx`を作成し、ton-clientとline-clientのホームページを共通コンポーネントを使用するように修正
  - `packages/ui/src/pages/RankingsPage.tsx`を作成し、ton-clientとline-clientのランキングページを共通コンポーネントを使用するように修正
  - `packages/ui/src/pages/SettingsPage.tsx`を作成し、ton-clientとline-clientの設定ページを共通コンポーネントを使用するように修正
  - `packages/ui/src/pages/StorePage.tsx`を作成し、ton-clientとline-clientのストアページを共通コンポーネントを使用するように修正
  - `packages/ui/src/pages/ProfilePage.tsx`を作成し、ton-clientとline-clientのプロフィールページを共通コンポーネントを使用するように修正
  - `packages/ui/src/pages/PreGamePage.tsx`を作成し、ton-clientとline-clientのプレゲームページを共通コンポーネントを使用するように修正
  - `packages/ui/src/pages/GamePage.tsx`を作成し、ton-clientとline-clientのゲームページを共通コンポーネントを使用するように修正
  - `packages/ui/src/pages/PlayPage.tsx`を作成し、ton-clientとline-clientのプレイ結果ページを共通コンポーネントを使用するように修正
  - `packages/ui/src/pages/TitlePage.tsx`を作成し、ton-clientとline-clientのタイトル画面を共通コンポーネントを使用するように修正
  - `packages/ui/src/pages/ResultPage.tsx`を作成し、ton-clientとline-clientの結果表示画面を共通コンポーネントを使用するように修正
  - リファクタリング計画に従い、両クライアントとも青系テーマに統一

- **コンテキストとフックの整理（完了）**
  - 複数のナビゲーションコンテキストを統合し、`UnifiedNavigationContext`を作成
    - `NavigationContext.tsx`と`NextNavigationContext.tsx`を統合
    - React RouterとNext.jsの両方に対応した統合されたコンテキストを実装
    - `isNextJs`フラグを追加して、使用中のフレームワークに応じて適切な動作を選択
  - 画面遷移アニメーション用のフックを統合
    - `useScreenAnimation`と`useNextScreenAnimation`を統合し、`useUnifiedScreenAnimation`を作成
    - `useScreenEntryExit`と`useNextScreenEntryExit`を統合し、`useUnifiedScreenEntryExit`を作成
    - 各フックにpathnameパラメータを追加し、現在のパスに基づいてアニメーションを制御するように改善
  - 以下のページコンポーネントを更新し、新しいコンテキストとフックを使用するように修正
    - `HomePage.tsx`: `useNextScreenEntryExit`→`useUnifiedScreenEntryExit`、`useNextNavigation`→`useNavigation`
    - `RankingsPage.tsx`: `useNextScreenEntryExit`→`useUnifiedScreenEntryExit`、`useNextNavigation`→`useNavigation`
    - `SettingsPage.tsx`: `useNextScreenEntryExit`→`useUnifiedScreenEntryExit`、`useNextNavigation`→`useNavigation`
    - `StorePage.tsx`: `useNextScreenEntryExit`→`useUnifiedScreenEntryExit`、`useNextNavigation`→`useNavigation`
    - `ProfilePage.tsx`: `useNextScreenEntryExit`→`useUnifiedScreenEntryExit`
    - `PreGamePage.tsx`: `useNextScreenEntryExit`→`useUnifiedScreenEntryExit`
    - `GamePage.tsx`: `useNextScreenEntryExit`→`useUnifiedScreenEntryExit`
    - `PlayPage.tsx`: `useNextScreenEntryExit`→`useUnifiedScreenEntryExit`
  - リファクタリングにより以下のメリットを実現
    - コードの重複を削減
    - 保守性の向上
    - 機能追加や変更が容易に
    - バグ修正が一箇所で可能

- **クエストAPIのリファクタリング**
  - クエスト関連のコードを共通化し、`packages/api/src/handlers/quests/` ディレクトリに移動
  - 以下のファイルを作成
    - `types.ts`: クエスト関連の型定義（エラーコード、クエストタイプ、難易度など）
    - `utils.ts`: 共通ユーティリティ関数（Supabaseクライアント作成、ページネーション計算など）
    - `list.ts`: クエスト一覧取得ハンドラー
    - `detail.ts`: クエスト詳細取得ハンドラー
    - `visit.ts`: URL訪問関連ハンドラー（トラッキングID生成と訪問報告）
    - `verify.ts`: トラッキングID検証ハンドラー
    - `index.ts`: エクスポート用インデックスファイル
  - ton-clientとline-clientのクエスト関連のAPIルート（一覧取得、詳細取得、URL訪問関連、トラッキングID検証）を共通ハンドラーを使用するように更新
  - リファクタリングにより以下のメリットを実現
    - コードの重複を削減
    - 保守性の向上
    - 機能追加や変更が容易に
    - バグ修正が一箇所で可能

### 進行中の作業

- **フロントエンドの共通化計画**
  - `packages/ui/src/screens`ディレクトリの発見
  - 既存の画面コンポーネントをNext.js互換に変換する計画の策定
  - 共通ページコンポーネントの作成計画
  - 実装アプローチ：
    1. `packages/ui/src/pages`ディレクトリの新設
    2. React Router依存部分のNext.js互換への変換
    3. アニメーションコンテキストの修正
    4. 各クライアントのページコンポーネントの簡素化
  - 予想工数：3-5日

- **楽曲APIのリファクタリング**
  - 楽曲関連のコードを共通化し、`packages/api/src/handlers/songs/` ディレクトリに移動
  - 以下のファイルを作成
    - `types.ts`: 楽曲関連の型定義（エラーコード、楽曲カテゴリー、難易度など）
    - `utils.ts`: 共通ユーティリティ関数（Supabaseクライアント作成、ページネーション計算など）
    - `list.ts`: 楽曲一覧取得ハンドラー
    - `detail.ts`: 楽曲詳細取得ハンドラー
    - `comments.ts`: コメント関連ハンドラー（一覧取得・投稿）
    - `index.ts`: エクスポート用インデックスファイル
  - ton-clientとline-clientの楽曲関連のAPIルート（一覧取得、詳細取得、コメント関連）を共通ハンドラーを使用するように更新
  - リファクタリングにより以下のメリットを実現
    - コードの重複を削減
    - 保守性の向上
    - 機能追加や変更が容易に
    - バグ修正が一箇所で可能

- **ユーザー認証APIのリファクタリング**
  - 認証関連のコードを共通化し、`packages/api/src/handlers/auth/` ディレクトリに移動
  - 以下のファイルを作成
    - `types.ts`: 認証関連の型定義
    - `utils.ts`: 共通ユーティリティ関数（Supabaseクライアント作成、エラーハンドリングなど）
    - `me.ts`: 現在のユーザー情報を取得するハンドラー
    - `logout.ts`: ログアウト処理を行うハンドラー
    - `users.ts`: ユーザープロフィール情報を取得・更新するハンドラー
    - `index.ts`: エクスポート用インデックスファイル
  - ton-clientとline-clientの認証関連のAPIルートを共通ハンドラーを使用するように更新
  - リファクタリングにより以下のメリットを実現
    - コードの重複を削減
    - 保守性の向上
    - 機能追加や変更が容易に
    - バグ修正が一箇所で可能

- **ランキングAPIのリファクタリング**
  - ランキング関連のコードを共通化し、`packages/api/src/handlers/rankings/` ディレクトリに移動
  - 以下のファイルを作成
    - `types.ts`: ランキング関連の型定義
    - `utils.ts`: 共通ユーティリティ関数（クエリパラメータ解析、ページネーション計算など）
    - `weekly.ts`: 週間ランキングハンドラー
    - `monthly.ts`: 月間ランキングハンドラー
    - `all-time.ts`: 総合ランキングハンドラー
    - `index.ts`: エクスポート用インデックスファイル
  - ton-clientとline-clientの全てのランキングAPIルート（週間、月間、総合）を共通ハンドラーを使用するように更新
  - リファクタリングにより以下のメリットを実現
    - コードの重複を削減
    - 保守性の向上
    - 機能追加や変更が容易に
    - バグ修正が一箇所で可能

- Supabaseの集計機能を有効化
  - `ALTER ROLE authenticator SET pgrst.db_aggregates_enabled = 'true';`コマンドを実行
  - `NOTIFY pgrst, 'reload config';`コマンドで設定を反映
  - これにより、Supabaseのクエリビルダーで集計関数（sum, count, avg, max, min）が正式にサポートされるようになった

- ランキングAPIの型安全性向上
  - 両クライアント（Telegram、LINE）の全てのランキングAPI（週間、月間、全期間）を更新
  - `any`型を使用していた箇所を適切な型定義に置き換え
  - 集計機能が正式にサポートされたことを反映するコメントを追加
  - 以下の型定義を追加
    ```typescript
    // ユーザー情報の型定義
    interface UserInfo {
      id: string;
      username: string;
      displayName?: string;
      avatarUrl?: string;
      level: number;
    }

    // ランキングクエリ結果の型定義
    interface RankingQueryResult {
      userId: string;
      points?: number;
      count?: number;
      score?: number;
      users: UserInfo;
    }

    // ランキングエントリーの型定義
    interface RankingEntry extends RankingQueryResult {
      rank: number;
      isCurrentUser: boolean;
    }

    // ユーザーランキング情報の型定義
    interface UserRankingInfo extends RankingQueryResult {
      rank: number;
    }
    ```

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

- URL遷移クエスト関連のAPIエンドポイントの実装
  - `GET /api/quests` - クエスト一覧取得
  - `GET /api/quests/{id}` - クエスト詳細取得
  - `POST /api/quests/{id}/visit` - URL訪問報告
  - `GET /api/quests/{id}/visit` - トラッキングID生成
  - `GET /api/quests/url/{trackingId}` - トラッキングID検証

- 楽曲関連のAPIエンドポイントの実装
  - `GET /api/songs` - 楽曲一覧取得
  - `GET /api/songs/{id}` - 楽曲詳細取得
  - `GET /api/songs/{id}/comments` - コメント一覧取得
  - `POST /api/songs/{id}/comments` - コメント投稿

- ランキング関連のAPIエンドポイントの実装
  - `GET /api/rankings/weekly` - 週間ランキング取得
  - `GET /api/rankings/monthly` - 月間ランキング取得
  - `GET /api/rankings/all-time` - 総合ランキング取得

### 進行中の作業

- APIエンドポイントの実装
  - ストア関連のAPIエンドポイントの実装
  - ソーシャル連携APIの実装
  - ロック機構の実装

### 次のタスク

1. **リファクタリングの続行**
   - クエストAPI共通化
   - 楽曲API共通化

2. **ストア関連のAPIエンドポイントの実装**
   - `GET /api/store/items` - 商品一覧取得
     - 商品カテゴリーによるフィルタリング
     - ページネーション
     - ソート（新着順、人気順、価格順）
   - `GET /api/store/items/{id}` - 商品詳細取得
     - 商品の詳細情報（名前、説明、価格、画像URL、カテゴリー、レアリティなど）
     - 購入可能状態の確認
   - `POST /api/store/items/{id}/purchase` - 商品購入
     - 購入前の残高確認
     - 購入処理（ポイント消費、アイテム付与）
     - 購入履歴の記録
   - `GET /api/store/purchases` - 購入履歴取得
     - ユーザーの購入履歴一覧
     - ページネーション
     - ソート（購入日時順）
   - `GET /api/store/inventory` - インベントリ取得
     - ユーザーが所持しているアイテム一覧
     - アイテムタイプによるフィルタリング
     - ページネーション

3. Supabaseとの連携
   - ストア関連のテーブル設計と作成
   - 商品データの登録
   - テスト用のダミーデータ作成

4. テストの実施
5. デプロイ

### API実装計画

#### フェーズ1：基本データモデルとスキーマ設計（完了）

1. **共通スキーマの設計**（完了）
   - `packages/api/src/schemas/common.ts` - 共通型定義
   - `packages/api/src/schemas/error.ts` - エラー型定義

2. **ユーザースキーマの設計**（完了）
   - `packages/api/src/schemas/user.ts`
   - 基本プロフィール情報
   - 認証情報

3. **クエストスキーマの設計**（完了）
   - `packages/api/src/schemas/quest.ts`
   - クエストタイプの定義（URL遷移、Twitter連携など）
   - クエスト要件の定義

4. **楽曲スキーマの設計**（完了）
   - `packages/api/src/schemas/song.ts`
   - 楽曲情報
   - コメント情報

5. **ランキングスキーマの設計**（完了）
   - `packages/api/src/schemas/ranking.ts`

6. **ストアスキーマの設計**（完了）
   - `packages/api/src/schemas/store.ts`

7. **ソーシャル連携スキーマの設計**（完了）
   - `packages/api/src/schemas/social.ts`
   - Twitter連携情報
   - ウォレット連携情報

#### フェーズ2：基本APIエンドポイント実装

##### 優先度1：ユーザー認証とプロフィール（完了）
- `GET /api/auth/me` - 現在のユーザー情報取得
- `POST /api/auth/logout` - ログアウト
- `GET /api/users/{id}` - ユーザープロフィール取得
- `PATCH /api/users/{id}` - ユーザープロフィール更新

##### 優先度2：URL遷移クエスト（完了）
- `GET /api/quests` - クエスト一覧取得
- `GET /api/quests/{id}` - クエスト詳細取得
- `POST /api/quests/{id}/visit` - URL訪問報告
- `GET /api/quests/{id}/visit` - トラッキングID生成
- `GET /api/quests/url/{trackingId}` - トラッキングID検証

##### 優先度3：楽曲関連API（完了）
- `GET /api/songs` - 楽曲一覧取得
- `GET /api/songs/{id}` - 楽曲詳細取得
- `GET /api/songs/{id}/comments` - コメント一覧取得
- `POST /api/songs/{id}/comments` - コメント投稿

##### 優先度4：ランキングAPI（完了）
- `GET /api/rankings/weekly` - 週間ランキング
- `GET /api/rankings/monthly` - 月間ランキング
- `GET /api/rankings/all-time` - 総合ランキング

##### 優先度5：ストアAPI（次のタスク）
- `GET /api/store/items` - 商品一覧取得
- `GET /api/store/items/{id}` - 商品詳細取得
- `POST /api/store/items/{id}/purchase` - 商品購入
- `GET /api/store/purchases` - 購入履歴取得
- `GET /api/store/inventory` - インベントリ取得

#### フェーズ3：ソーシャル連携とSNSクエスト

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

#### フェーズ4：高度な機能実装

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
- APIエンドポイントの実装: 75%（ユーザー認証・プロフィール、URL遷移クエスト関連、楽曲関連、ランキング関連完了）
- リファクタリング: 50%（ランキングAPI共通化、ユーザー認証API共通化完了）
- Supabaseとの連携: 40%（基本テーブル作成、集計機能有効化完了）
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
  - [x] ユーザー認証とプロフィール関連
  - [x] URL遷移クエスト関連
  - [x] 楽曲関連
  - [x] ランキング関連
  - [ ] ストア関連
  - [ ] ソーシャル連携関連
- [ ] リファクタリング
  - [x] ランキングAPI共通化
  - [x] ユーザー認証API共通化
  - [ ] クエストAPI共通化
  - [ ] 楽曲API共通化
  - [ ] フロントエンドの共通化
  - [ ] コンテキストとフックの整理
- [ ] Supabaseとの連携
  - [x] 基本テーブル作成
  - [x] 集計機能有効化
  - [ ] ストア関連テーブル作成
  - [ ] ソーシャル連携テーブル作成
- [ ] テスト
- [ ] デプロイ

## 課題とリスク

- Telegram Mini AppとLINE LIFFの統合における互換性の問題
- Supabaseの認証機能とプラットフォーム固有の認証の連携
- UIコンポーネントの両プラットフォームでの一貫した動作
- Telegram Mini Appの認証プロセスのデバッグが困難（コンソールログが見えない）

## 次のステップ

1. **リファクタリングの続行**
   - クエストAPI共通化
   - 楽曲API共通化
2. ストア関連のAPIエンドポイントの実装
   - `GET /api/store/items` - 商品一覧取得
   - `GET /api/store/items/{id}` - 商品詳細取得
   - `POST /api/store/items/{id}/purchase` - 商品購入
   - `GET /api/store/purchases` - 購入履歴取得
   - `GET /api/store/inventory` - インベントリ取得
3. Supabaseとの連携
   - ストア関連のテーブル設計と作成
   - 商品データの登録
4. ソーシャル連携APIの実装
5. テストの実施
6. デプロイ

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

### API実装（TONクライアントとLINEクライアント共通）
- [x] `/apps/ton-client/src/app/api/auth/me/route.ts` - 現在のユーザー情報取得API
- [x] `/apps/ton-client/src/app/api/auth/logout/route.ts` - ログアウトAPI
- [x] `/apps/ton-client/src/app/api/users/[id]/route.ts` - ユーザープロフィール取得・更新API
- [x] `/apps/ton-client/src/app/api/quests/route.ts` - クエスト一覧取得API
- [x] `/apps/ton-client/src/app/api/quests/[id]/route.ts` - クエスト詳細取得API
- [x] `/apps/ton-client/src/app/api/quests/[id]/visit/route.ts` - URL訪問報告・トラッキングID生成API
- [x] `/apps/ton-client/src/app/api/quests/url/[trackingId]/route.ts` - トラッキングID検証API
- [x] `/apps/ton-client/src/app/api/songs/route.ts` - 楽曲一覧取得API
- [x] `/apps/ton-client/src/app/api/songs/[id]/route.ts` - 楽曲詳細取得API
- [x] `/apps/ton-client/src/app/api/songs/[id]/comments/route.ts` -
