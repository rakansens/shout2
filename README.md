# Shout2

Shout2は、LINEとTelegramのユーザー向けのUIを提供するプロジェクトです。

## プロジェクト構造

```
shout2/
├── apps/                  # アプリケーション
│   ├── admin/             # 管理者パネル
│   ├── line-client/       # LINEクライアント
│   └── ton-client/        # Telegramクライアント
├── config/                # 環境設定
│   ├── .env.example       # 環境変数の例
│   └── .env.local         # ローカル環境変数（gitignore）
└── packages/              # 共有パッケージ
    ├── api/               # APIパッケージ
    └── ui/                # UIコンポーネントパッケージ
```

## 開発環境のセットアップ

1. 依存関係のインストール

```bash
npm install
```

2. 環境変数の設定

`config/.env.example`を`config/.env.local`にコピーして、必要な環境変数を設定します。

3. 開発サーバーの起動

```bash
# Telegramクライアント
npm run dev:ton

# LINEクライアント
npm run dev:line

# 管理者パネル
npm run dev:admin
```

## 技術スタック

- **フロントエンド**: Next.js, React, TypeScript, Tailwind CSS
- **バックエンド**: Supabase
- **認証**: JWT, Telegram Mini App, LINE LIFF

## ドキュメント

詳細なドキュメントは、`memory-bank`ディレクトリにあります。
