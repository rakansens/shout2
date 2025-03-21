/**
 * @file packages/api/src/schemas/index.ts
 * @description Zodスキーマのエクスポート
 */

// 共通スキーマ
export * as CommonSchemas from './common';

// エラースキーマ
export * as ErrorSchemas from './error';

// ユーザースキーマ
export * as UserSchemas from './user';

// クエストスキーマ
export * as QuestSchemas from './quest';

// 楽曲スキーマ
export * as SongSchemas from './song';

// ランキングスキーマ
export * as RankingSchemas from './ranking';

// ストアスキーマ
export * as StoreSchemas from './store';

// ソーシャル連携スキーマ
export * as SocialSchemas from './social';

// 便宜上、よく使われる型や列挙型を直接エクスポート
export { ErrorCode } from './error';
export { UserRole, UserStatus, AuthProvider } from './user';
export { QuestType, QuestDifficulty, QuestStatus, VerificationStatus } from './quest';
export { SongDifficulty, SongCategory, SongStatus, ScoreLevel } from './song';
export { RankingType } from './ranking';
export { ItemType, ItemRarity, PurchaseType, PurchaseStatus } from './store';
export { ConnectionStatus, SocialScope, WalletConnectionType, SocialAction } from './social';
