# 技術コンテキスト

このドキュメントは、Shout2プロジェクトの技術的なコンテキスト情報を提供します。

## アーキテクチャ

Shout2プロジェクトは、モノレポ構造を採用しています。これにより、複数のアプリケーションで共通のコードを共有し、効率的な開発と保守が可能になります。

```
shout2/
├── apps/                  # アプリケーション
│   ├── admin/             # 管理者パネル
│   ├── line-client/       # LINEクライアント
│   └── ton-client/        # Telegramクライアント
├── config/                # 環境設定
└── packages/              # 共有パッケージ
    ├── api/               # APIパッケージ
    └── ui/                # UIコンポーネントパッケージ
```

## フロントエンド技術

### Next.js

Next.jsは、Reactベースのフレームワークで、サーバーサイドレンダリング（SSR）、静的サイト生成（SSG）、APIルートなどの機能を提供します。Shout2プロジェクトでは、Next.jsを使用して各クライアントアプリケーションを構築しています。

### React

Reactは、ユーザーインターフェースを構築するためのJavaScriptライブラリです。Shout2プロジェクトでは、Reactを使用してUIコンポーネントを構築しています。

### TypeScript

TypeScriptは、JavaScriptに静的型付けを追加した言語です。Shout2プロジェクトでは、TypeScriptを使用してコードの品質と保守性を向上させています。

### Tailwind CSS

Tailwind CSSは、ユーティリティファーストのCSSフレームワークです。Shout2プロジェクトでは、Tailwind CSSを使用してUIコンポーネントのスタイリングを行っています。

## バックエンド技術

### Supabase

Supabaseは、オープンソースのFirebase代替品で、PostgreSQLデータベース、認証、ストレージ、リアルタイム機能などを提供します。Shout2プロジェクトでは、Supabaseをバックエンドサービスとして使用しています。

## 認証技術

### JWT

JWT（JSON Web Token）は、クレームをJSON形式で表現するためのオープンスタンダードです。Shout2プロジェクトでは、JWTを使用してユーザー認証を行っています。

### Telegram Mini App

Telegram Mini Appは、Telegramアプリ内で動作するWebアプリケーションです。Shout2プロジェクトでは、Telegram Mini Appを使用してTelegramユーザー向けのクライアントアプリケーションを提供しています。

### LINE LIFF

LINE LIFF（LINE Front-end Framework）は、LINEアプリ内で動作するWebアプリケーションを開発するためのプラットフォームです。Shout2プロジェクトでは、LINE LIFFを使用してLINEユーザー向けのクライアントアプリケーションを提供しています。

## 開発ツール

### npm

npmは、Node.jsのパッケージマネージャーです。Shout2プロジェクトでは、npmを使用して依存関係を管理しています。

### Git

Gitは、分散型バージョン管理システムです。Shout2プロジェクトでは、Gitを使用してソースコードのバージョン管理を行っています。

### GitHub

GitHubは、Gitリポジトリのホスティングサービスです。Shout2プロジェクトでは、GitHubを使用してソースコードの共有と協力開発を行っています。

## デプロイ

### Vercel

Vercelは、フロントエンドアプリケーションのホスティングプラットフォームです。Shout2プロジェクトでは、Vercelを使用してフロントエンドアプリケーションをデプロイしています。
