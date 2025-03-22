# アクティブコンテキスト

このドキュメントは、Shout2プロジェクトの現在のアクティブなコンテキスト情報を提供します。

## 現在の開発フェーズ

- 環境構築フェーズ
- 基本的なプロジェクト構造の設定
- UIコンポーネントの移行と適用
- 認証機能の実装
- ページの実装
- アニメーション機能の実装
- APIエンドポイントとZodスキーマの実装（進行中）
- **リファクタリング計画の実装（進行中）**

## 最近の変更

- モノレポ構造の設定
- 各アプリケーション（ton-client、line-client、admin）の基本構造の作成
- 共有パッケージ（ui、api）の設定
- 環境変数の設定
- Next.jsの設定
- Gitリポジトリの設定
- ton-clientアプリケーションの依存関係をインストール
- Telegram Mini App SDK（@telegram-apps/sdk）をインストール
- 'next: command not found'エラーを解決
- ton-clientのNext.js設定にbasePath: '/ton-client'を追加
- Telegram認証プロセスのデバッグ情報を強化
- Supabaseに`users`テーブルを作成
- UIコンポーネントをTONとLINEクライアントに適用
- react-router-domの依存関係を削除し、Next.jsと互換性のあるコンポーネントに修正
- HeaderコンポーネントとNavigationコンポーネントをNext.js対応に修正
- TONクライアントとLINEクライアントのホーム画面を実装
- TONクライアントとLINEクライアントのランキング画面を実装
- TONクライアントとLINEクライアントのストア画面を実装
- TONクライアントとLINEクライアントの設定画面を実装
- TONクライアントとLINEクライアントのプロフィール画面を実装
- アニメーション機能の実装（画面遷移アニメーション、エントリー/エグジットアニメーション）
- コンテキストプロバイダー（NextNavigationContext、AnimationSettingsContext、NotificationContext）に'use client'ディレクティブを追加してNext.jsのServer/Clientコンポーネントエラーを修正
- 楽曲詳細・コメント機能付きの中間ページ（`/pregame`）を実装
- `PreGame`コンポーネントを共通化して`/packages/ui/src/components/PreGame`に移動
- APIスキーマの設計と実装（完了）
- ユーザー認証とプロフィール関連のAPIエンドポイントの実装（完了）
  - `GET /api/auth/me` - 現在のユーザー情報取得
  - `POST /api/auth/logout` - ログアウト
  - `GET /api/users/{id}` - ユーザープロフィール取得
  - `PATCH /api/users/{id}` - ユーザープロフィール更新
- URL遷移クエスト関連のAPIエンドポイントの実装（完了）
  - `GET /api/quests` - クエスト一覧取得
  - `GET /api/quests/{id}` - クエスト詳細取得
  - `POST /api/quests/{id}/visit` - URL訪問報告
  - `GET /api/quests/{id}/visit` - トラッキングID生成
  - `GET /api/quests/url/{trackingId}` - トラッキングID検証
- 楽曲関連のAPIエンドポイントの実装（完了）
  - `GET /api/songs` - 楽曲一覧取得
  - `GET /api/songs/{id}` - 楽曲詳細取得
  - `GET /api/songs/{id}/comments` - コメント一覧取得
  - `POST /api/songs/{id}/comments` - コメント投稿
- ランキング関連のAPIエンドポイントの実装（完了）
  - `GET /api/rankings/weekly` - 週間ランキング取得
  - `GET /api/rankings/monthly` - 月間ランキング取得
  - `GET /api/rankings/all-time` - 総合ランキング取得
- Supabaseの集計機能を有効化
  - `ALTER ROLE authenticator SET pgrst.db_aggregates_enabled = 'true';`コマンドを実行
  - `NOTIFY pgrst, 'reload config';`コマンドで設定を反映
- ランキングAPIの型安全性向上
  - `any`型を使用していた箇所を適切な型定義に置き換え
  - 集計機能が正式にサポートされたことを反映するコメントを追加
  - ユーザー情報、ランキングクエリ結果、ランキングエントリー、ユーザーランキング情報の型定義を追加
- **リファクタリング計画の策定と実装（進行中）**
  - コードの重複を削減し、保守性を向上させるための計画を策定
  - 既存APIも含めた完全共通化アプローチを採用
  - 段階的な実装計画を作成
  - **ランキングAPIのリファクタリング完了（新規）**
    - ランキング関連のコードを共通化し、`packages/api/src/handlers/rankings/` ディレクトリに移動
    - 型定義、ユーティリティ関数、各ランキングタイプのハンドラーを分離
    - ton-clientとline-clientの週間ランキングと月間ランキングのAPIルートを共通ハンドラーを使用するように更新
    - 総合ランキングのAPIルートは元のコードを維持

## 現在の課題

- **リファクタリングの実施（進行中）**
  - ランキングAPI共通化（完了）
  - ユーザー認証API共通化（次のタスク）
  - クエストAPI共通化
  - 楽曲API共通化
  - フロントエンドの共通化
  - コンテキストとフックの整理
- APIエンドポイントの実装（進行中）
  - ストア関連のAPIエンドポイントの実装
  - ソーシャル連携APIの実装
  - ロック機構の実装
- Supabaseとの連携
- UIコンポーネントのテスト
- ソーシャル連携機能の実装

## 次のステップ

1. **リファクタリングの続行**
   - ユーザー認証API共通化
   - クエストAPI共通化
   - 楽曲API共通化
   - 詳細は `memory-bank/context/refactoring_plan.md` を参照
2. APIエンドポイントの実装（続き）
   - ストア関連のAPIエンドポイント
   - ソーシャル連携API
3. Supabaseとの連携
4. テストの実施
5. デプロイ

## リファクタリング計画の概要

リファクタリング計画の詳細は `memory-bank/context/refactoring_plan.md` に記録されています。主な目標は以下の通りです：

1. **コードの重複削減**
   - 両クライアント間で重複しているコードを共通化
   - APIロジックを共通ハンドラーに移動
   - ページコンポーネントを共通化

2. **ディレクトリ構造の整理**
   - 不要なファイルの削除
   - 共通コードの適切な配置

3. **テーマの統一**
   - 両クライアントのテーマを青系に統一
   - プラットフォーム別の色分けを廃止

4. **実装フェーズ**
   - フェーズ1: 既存APIの共通化（4日間）
     - ランキングAPI共通化（完了）
     - ユーザー認証API共通化（次のタスク）
     - クエストAPI共通化
     - 楽曲API共通化
   - フェーズ2: フロントエンドの共通化（4日間）
   - フェーズ3: コンテキストとフックの整理（2日間）
   - フェーズ4: 新規API実装（3日間）
   - フェーズ5: 最終調整とテスト（2日間）

## API実装状況

### フェーズ1：基本データモデルとスキーマ設計（完了）

1. **共通スキーマの設計**（完了）
   - `packages/api/src/schemas/common.ts` - 共通型定義
   - 共通のID型、ページネーション、ソート、タイムスタンプなどの基本的なスキーマ
   - レスポンスメタデータ、言語コード、通貨コードなどの共通型

2. **エラースキーマの設計**（完了）
   - `packages/api/src/schemas/error.ts` - エラー型定義
   - エラーコード列挙型
   - エラーレスポンススキーマ
   - APIエラークラス
   - バリデーションエラーフォーマット関数

3. **ユーザースキーマの設計**（完了）
   - `packages/api/src/schemas/user.ts`
   - ユーザーロール、ステータス、認証プロバイダーなどの列挙型
   - 基本ユーザースキーマ
   - ユーザー作成・更新入力スキーマ
   - ユーザー統計情報、実績スキーマ

4. **クエストスキーマの設計**（完了）
   - `packages/api/src/schemas/quest.ts`
   - クエストタイプ、難易度、ステータスなどの列挙型
   - 基本クエストスキーマ
   - クエスト要件、報酬スキーマ
   - クエスト完了、検証スキーマ
   - URL遷移クエスト、Twitter連携クエスト検証スキーマ

5. **楽曲スキーマの設計**（完了）
   - `packages/api/src/schemas/song.ts`
   - 楽曲難易度、カテゴリー、ステータスなどの列挙型
   - 基本楽曲スキーマ
   - 楽曲コメント、評価スキーマ
   - 楽曲プレイ記録スキーマ

6. **ランキングスキーマの設計**（完了）
   - `packages/api/src/schemas/ranking.ts`
   - ランキングタイプ列挙型
   - 基本ランキングスキーマ
   - ランキングエントリースキーマ
   - ユーザーランキング情報スキーマ

7. **ストアスキーマの設計**（完了）
   - `packages/api/src/schemas/store.ts`
   - アイテムタイプ、レアリティ、購入タイプなどの列挙型
   - 基本ストアアイテムスキーマ
   - ユーザーアイテム、購入履歴スキーマ
   - 購入リクエスト、レスポンススキーマ

8. **ソーシャル連携スキーマの設計**（完了）
   - `packages/api/src/schemas/social.ts`
   - ソーシャル連携ステータス、スコープなどの列挙型
   - 基本ソーシャル連携スキーマ
   - ウォレット連携スキーマ
   - Twitter連携、ウォレット連携リクエストスキーマ
   - ソーシャルアクション検証スキーマ

9. **インデックスファイルの作成**（完了）
   - `packages/api/src/schemas/index.ts`
   - 名前空間付きエクスポート（`CommonSchemas`, `ErrorSchemas`など）
   - よく使われる型や列挙型の直接エクスポート

### フェーズ2：基本APIエンドポイント実装

#### 優先度1：ユーザー認証とプロフィール（完了）
- `GET /api/auth/me` - 現在のユーザー情報取得（完了）
- `POST /api/auth/logout` - ログアウト（完了）
- `GET /api/users/{id}` - ユーザープロフィール取得（完了）
- `PATCH /api/users/{id}` - ユーザープロフィール更新（完了）

#### 優先度2：URL遷移クエスト（完了）
- `GET /api/quests` - クエスト一覧取得（完了）
- `GET /api/quests/{id}` - クエスト詳細取得（完了）
- `POST /api/quests/{id}/visit` - URL訪問報告（完了）
- `GET /api/quests/{id}/visit` - トラッキングID生成（完了）
- `GET /api/quests/url/{trackingId}` - トラッキングID検証（完了）

#### 優先度3：楽曲関連API（完了）
- `GET /api/songs` - 楽曲一覧取得（完了）
- `GET /api/songs/{id}` - 楽曲詳細取得（完了）
- `GET /api/songs/{id}/comments` - コメント一覧取得（完了）
- `POST /api/songs/{id}/comments` - コメント投稿（完了）

#### 優先度4：ランキングAPI（完了）
- `GET /api/rankings/weekly` - 週間ランキング（完了）
- `GET /api/rankings/monthly` - 月間ランキング（完了）
- `GET /api/rankings/all-time` - 総合ランキング（完了）

#### 優先度5：ストアAPI（次のタスク）
- `GET /api/store/items` - 商品一覧取得
- `GET /api/store/items/{id}` - 商品詳細取得

### フェーズ3：ソーシャル連携とSNSクエスト

#### 優先度1：Twitter連携
- `GET /api/auth/connect/twitter` - Twitter連携開始
- `GET /api/auth/connect/twitter/callback` - コールバック処理
- `GET /api/user/connections` - 連携済みアカウント一覧
- `DELETE /api/auth/connect/twitter` - 連携解除
- `POST /api/quests/{id}/complete` - クエスト完了報告
- `POST /api/quests/verify/twitter` - Twitter連携後の自動検証

#### 優先度2：ウォレット連携
- `POST /api/auth/connect/wallet` - ウォレット連携
- `DELETE /api/auth/connect/wallet` - 連携解除

#### 優先度3：その他SNS連携
- 各SNSプラットフォーム用の連携APIを実装

## UIコンポーネント管理

- UIコンポーネントは`packages/ui`ディレクトリで一元管理
- 変更は`packages/ui`のコンポーネントに対して行う
- 各アプリケーションでは、共通のUIコンポーネントを使用しながら、プロパティを通じてプラットフォーム固有のカスタマイズを行う
- TONクライアントは青系のカラーテーマ、LINEクライアントは緑系のカラーテーマを使用
- **リファクタリング後は両クライアントとも青系のカラーテーマに統一予定**

## 実装済みページ

1. **ホーム画面（home）**
   - メインレイアウト
   - ヘッダー
   - キャラクターパネル
   - イベントカルーセル
   - クエストリスト
   - ナビゲーション
   - プラットフォーム別テーマカラー

2. **ランキング画面（rankings）**
   - メインレイアウト
   - ヘッダー
   - ランキングタイプ切り替え（週間、月間、総合）
   - ランキングリスト表示
   - 上位ランカーの特別表示
   - 現在のユーザーのハイライト
   - ユーザープロフィールへのリンク
   - ナビゲーション
   - プラットフォーム別テーマカラー

3. **ストア画面（store）**
   - メインレイアウト
   - ヘッダー
   - カテゴリー切り替え
   - 商品リスト表示
   - 購入確認モーダル
   - ポイント表示
   - 限定商品の特別表示
   - ナビゲーション
   - プラットフォーム別テーマカラー

4. **設定画面（settings）**
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

5. **プロフィール画面（profile）**
   - メインレイアウト
   - ヘッダー
   - ユーザー情報の表示（ユーザー名、レベル、経験値、参加日）
   - 自己紹介の表示と編集機能
   - 実績タブと統計タブの切り替え機能
   - 実績リストの表示（獲得済み/未獲得の区別）
   - 統計情報の表示（完了クエスト、参加イベント、獲得ポイント、ランク）
   - ナビゲーション
   - プラットフォーム別テーマカラー

## 実装済みAPI

1. **ユーザー認証とプロフィール関連**
   - `GET /api/auth/me` - 現在のユーザー情報取得
   - `POST /api/auth/logout` - ログアウト
   - `GET /api/users/{id}` - ユーザープロフィール取得
   - `PATCH /api/users/{id}` - ユーザープロフィール更新

2. **URL遷移クエスト関連**
   - `GET /api/quests` - クエスト一覧取得
   - `GET /api/quests/{id}` - クエスト詳細取得
   - `POST /api/quests/{id}/visit` - URL訪問報告
   - `GET /api/quests/{id}/visit` - トラッキングID生成
   - `GET /api/quests/url/{trackingId}` - トラッキングID検証

3. **楽曲関連**
   - `GET /api/songs` - 楽曲一覧取得
   - `GET /api/songs/{id}` - 楽曲詳細取得
   - `GET /api/songs/{id}/comments` - コメント一覧取得
   - `POST /api/songs/{id}/comments` - コメント投稿

4. **ランキング関連**
   - `GET /api/rankings/weekly` - 週間ランキング取得
   - `GET /api/rankings/monthly` - 月間ランキング取得
   - `GET /api/rankings/all-time` - 総合ランキング取得

## 開発環境

- Node.js: v18以上
- パッケージマネージャー: npm
- バージョン管理: Git
- エディタ: Visual Studio Code
- ブラウザ: Google Chrome

## チーム

- フロントエンド開発者
- バックエンド開発者
- デザイナー
- プロジェクトマネージャー

## スケジュール

- 環境構築: 2025年3月
- 基本機能の実装: 2025年4月
- テスト: 2025年5月
- デプロイ: 2025年6月

## リソース

- GitHub: https://github.com/rakansens/shout2.git
- Figmaデザイン: [リンク]
- プロジェクト管理: GitHub Issues
- コミュニケーション: Slack
