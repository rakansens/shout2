# APIリファクタリング

このドキュメントは、Shout2プロジェクトのAPIリファクタリングに関する情報を記録します。

## 概要

APIリファクタリングの主な目的は、コードの重複を削減し、保守性を向上させることです。具体的には、以下の作業を行いました：

1. 共通ハンドラーの作成
2. 型定義の整理
3. ユーティリティ関数の共通化
4. エラーハンドリングの統一

## 完了したリファクタリング

### ランキングAPI

- ランキング関連のコードを共通化し、`packages/api/src/handlers/rankings/` ディレクトリに移動
- 以下のファイルを作成
  - `types.ts`: ランキング関連の型定義
  - `utils.ts`: 共通ユーティリティ関数（クエリパラメータ解析、ページネーション計算など）
  - `weekly.ts`: 週間ランキングハンドラー
  - `monthly.ts`: 月間ランキングハンドラー
  - `all-time.ts`: 総合ランキングハンドラー
  - `index.ts`: エクスポート用インデックスファイル
- ton-clientとline-clientの全てのランキングAPIルート（週間、月間、総合）を共通ハンドラーを使用するように更新
- 型安全性の向上
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

### ユーザー認証API

- 認証関連のコードを共通化し、`packages/api/src/handlers/auth/` ディレクトリに移動
- 以下のファイルを作成
  - `types.ts`: 認証関連の型定義
  - `utils.ts`: 共通ユーティリティ関数（Supabaseクライアント作成、エラーハンドリングなど）
  - `me.ts`: 現在のユーザー情報を取得するハンドラー
  - `logout.ts`: ログアウト処理を行うハンドラー
  - `users.ts`: ユーザープロフィール情報を取得・更新するハンドラー
  - `index.ts`: エクスポート用インデックスファイル
- ton-clientとline-clientの認証関連のAPIルート（ユーザー情報取得、ログアウト、プロフィール取得・更新）を共通ハンドラーを使用するように更新

### 楽曲API

- 楽曲関連のコードを共通化し、`packages/api/src/handlers/songs/` ディレクトリに移動
- 以下のファイルを作成
  - `types.ts`: 楽曲関連の型定義（エラーコード、楽曲カテゴリー、難易度など）
  - `utils.ts`: 共通ユーティリティ関数（Supabaseクライアント作成、ページネーション計算など）
  - `list.ts`: 楽曲一覧取得ハンドラー
  - `detail.ts`: 楽曲詳細取得ハンドラー
  - `comments.ts`: コメント関連ハンドラー（一覧取得・投稿）
  - `index.ts`: エクスポート用インデックスファイル
- ton-clientとline-clientの楽曲関連のAPIルート（一覧取得、詳細取得、コメント関連）を共通ハンドラーを使用するように更新

### クエストAPI

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

## 次のステップ

1. **ストア関連のAPIエンドポイントの実装**
   - `GET /api/store/items` - 商品一覧取得
   - `GET /api/store/items/{id}` - 商品詳細取得
   - `POST /api/store/items/{id}/purchase` - 商品購入
   - `GET /api/store/purchases` - 購入履歴取得
   - `GET /api/store/inventory` - インベントリ取得

2. **ソーシャル連携APIの実装**
   - Twitter連携
   - ウォレット連携
   - その他SNS連携

## リファクタリングのメリット

- コードの重複を削減
- 保守性の向上
- 機能追加や変更が容易に
- バグ修正が一箇所で可能
- 型安全性の向上
- エラーハンドリングの統一
