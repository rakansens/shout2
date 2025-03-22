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

- **react-router-domの依存関係をNext.jsのルーティングに置き換え（新規）**
  - `NavigationAnimationContext`をNext.js用に書き換え
    - `react-router-dom`の`useNavigate`と`useLocation`を`next/navigation`の`useRouter`と`usePathname`に置き換え
    - コンテキストの型定義とプロバイダーコンポーネントを修正
  - `useScreenAnimation`と`useScreenEntryExit`フックをNext.js用に書き換え
    - `react-router-dom`の`useLocation`を`next/navigation`の`usePathname`に置き換え
    - フックの型定義と実装を修正
  - `/play`ページを共通コンポーネントを使用するように修正
    - ton-clientとline-clientの両方で共通の`Play`コンポーネントを使用するように変更
    - 各クライアントのページコンポーネントを簡素化
  - リファクタリングにより以下のメリットを実現
    - Next.jsのルーティングを一貫して使用
    - コードの重複を削減
    - 保守性の向上
    - バグ修正が一箇所で可能

- **楽曲カード選択時の空表示問題の修正（完了）**
  - `Play.tsx`コンポーネントのフックをNext.js互換に変更
    - `useScreenAnimation`を`useUnifiedScreenAnimation`に置き換え
    - `useScreenEntryExit`を`useUnifiedScreenEntryExit`に置き換え
    - `usePathname`を追加して現在のパスを取得
    - 各フックにpathnameパラメータを渡すように修正
  - 楽曲カードをクリックすると空の表示になる問題を解決
  - リファクタリングにより以下のメリットを実現
    - 画面遷移の一貫性を確保
    - ユーザー体験の向上
    - バグの修正

- **重複するフックとコンテキストの削除（新規）**
  - 以下の重複するフックを削除
    - `useScreenAnimation.ts` - `useUnifiedScreenAnimation.ts`に統合済み
    - `useScreenEntryExit.ts` - `useUnifiedScreenEntryExit.ts`に統合済み
    - `useNextScreenAnimation.ts` - `useUnifiedScreenAnimation.ts`に統合済み
    - `useNextScreenEntryExit.ts` - `useUnifiedScreenEntryExit.ts`に統合済み
  - 以下の重複するコンテキストを削除
    - `NavigationContext.tsx` - `UnifiedNavigationContext.tsx`に統合済み
    - `NextNavigationContext.tsx` - `UnifiedNavigationContext.tsx`に統合済み
    - `NavigationAnimationContext.tsx` - `UnifiedNavigationContext.tsx`に統合済み
  - リファクタリングにより以下のメリットを実現
    - コードベースの簡素化
    - 保守性の向上
    - 混乱の軽減
    - 一貫性の確保

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

### 次のタスク

1. **リファクタリングの続行**
   - 残りのreact-router-dom依存コンポーネントの修正
   - 詳細は `memory-bank/context/refactoring_plan.md` を参照

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
   - `
