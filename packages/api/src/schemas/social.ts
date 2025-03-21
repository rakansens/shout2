/**
 * @file packages/api/src/schemas/social.ts
 * @description ソーシャル連携関連のZodスキーマ定義
 */

import { z } from 'zod';
import { idSchema, timestampFields, socialPlatformSchema, walletTypeSchema } from './common';

/**
 * ソーシャル連携ステータス列挙型
 */
export enum ConnectionStatus {
  PENDING = 'pending',
  CONNECTED = 'connected',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  FAILED = 'failed',
}

/**
 * ソーシャル連携スコープ列挙型
 */
export enum SocialScope {
  // Twitter
  TWITTER_READ = 'twitter.read',
  TWITTER_WRITE = 'twitter.write',
  TWITTER_FOLLOW = 'twitter.follow',
  
  // Telegram
  TELEGRAM_BASIC = 'telegram.basic',
  TELEGRAM_GROUPS = 'telegram.groups',
  
  // TikTok
  TIKTOK_BASIC = 'tiktok.basic',
  TIKTOK_VIDEO = 'tiktok.video',
  
  // 共通
  USER_PROFILE = 'user.profile',
  USER_EMAIL = 'user.email',
}

/**
 * ウォレット連携タイプ列挙型
 */
export enum WalletConnectionType {
  READ_ONLY = 'read_only',
  SIGN_MESSAGES = 'sign_messages',
  TRANSACTIONS = 'transactions',
}

/**
 * 基本ソーシャル連携スキーマ
 */
export const socialConnectionSchema = z.object({
  id: idSchema,
  userId: idSchema,
  platform: socialPlatformSchema,
  platformUserId: z.string(),
  username: z.string().optional(),
  displayName: z.string().optional(),
  profileUrl: z.string().url().optional(),
  avatarUrl: z.string().url().optional(),
  status: z.nativeEnum(ConnectionStatus).default(ConnectionStatus.CONNECTED),
  scopes: z.array(z.nativeEnum(SocialScope)).optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  tokenSecret: z.string().optional(), // Twitter OAuth 1.0a用
  expiresAt: z.string().datetime().optional(),
  lastUsedAt: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
  isVerified: z.boolean().default(false),
  verifiedAt: z.string().datetime().optional(),
}).merge(timestampFields);

/**
 * ウォレット連携スキーマ
 */
export const walletConnectionSchema = z.object({
  id: idSchema,
  userId: idSchema,
  walletType: walletTypeSchema,
  address: z.string(),
  publicKey: z.string().optional(),
  connectionType: z.nativeEnum(WalletConnectionType).default(WalletConnectionType.READ_ONLY),
  status: z.nativeEnum(ConnectionStatus).default(ConnectionStatus.CONNECTED),
  lastUsedAt: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
  isVerified: z.boolean().default(false),
  verifiedAt: z.string().datetime().optional(),
}).merge(timestampFields);

/**
 * ソーシャル連携作成入力スキーマ
 */
export const createSocialConnectionSchema = socialConnectionSchema.omit({
  id: true,
  status: true,
  lastUsedAt: true,
  isVerified: true,
  verifiedAt: true,
  createdAt: true,
  updatedAt: true,
}).required({
  userId: true,
  platform: true,
  platformUserId: true,
});

/**
 * ウォレット連携作成入力スキーマ
 */
export const createWalletConnectionSchema = walletConnectionSchema.omit({
  id: true,
  status: true,
  lastUsedAt: true,
  isVerified: true,
  verifiedAt: true,
  createdAt: true,
  updatedAt: true,
}).required({
  userId: true,
  walletType: true,
  address: true,
});

/**
 * ソーシャル連携更新入力スキーマ
 */
export const updateSocialConnectionSchema = createSocialConnectionSchema.partial();

/**
 * ウォレット連携更新入力スキーマ
 */
export const updateWalletConnectionSchema = createWalletConnectionSchema.partial();

/**
 * Twitter連携リクエストスキーマ
 */
export const twitterConnectRequestSchema = z.object({
  callbackUrl: z.string().url().optional(),
  scopes: z.array(z.nativeEnum(SocialScope)).optional(),
});

/**
 * Twitter連携コールバックスキーマ
 */
export const twitterConnectCallbackSchema = z.object({
  oauth_token: z.string(),
  oauth_verifier: z.string(),
});

/**
 * ウォレット連携リクエストスキーマ
 */
export const walletConnectRequestSchema = z.object({
  walletType: walletTypeSchema,
  address: z.string(),
  signature: z.string(),
  message: z.string(),
  connectionType: z.nativeEnum(WalletConnectionType).optional(),
});

/**
 * ソーシャル連携レスポンススキーマ
 */
export const socialConnectionResponseSchema = z.object({
  success: z.boolean(),
  connection: socialConnectionSchema.omit({
    accessToken: true,
    refreshToken: true,
    tokenSecret: true,
  }).optional(),
  redirectUrl: z.string().url().optional(),
  message: z.string().optional(),
});

/**
 * ウォレット連携レスポンススキーマ
 */
export const walletConnectionResponseSchema = z.object({
  success: z.boolean(),
  connection: walletConnectionSchema.omit({
    publicKey: true,
  }).optional(),
  message: z.string().optional(),
});

/**
 * ソーシャルアクション列挙型
 */
export enum SocialAction {
  FOLLOW = 'follow',
  REPOST = 'repost',
  LIKE = 'like',
  COMMENT = 'comment',
  JOIN_GROUP = 'join_group',
}

/**
 * ソーシャルアクション検証スキーマ
 */
export const socialActionVerificationSchema = z.object({
  userId: idSchema,
  platform: socialPlatformSchema,
  action: z.nativeEnum(SocialAction),
  targetId: z.string(), // ユーザーID、投稿ID、グループIDなど
  targetUsername: z.string().optional(),
  questId: idSchema.optional(),
  verificationStatus: z.enum(['pending', 'verified', 'failed']).default('pending'),
  verifiedAt: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
}).merge(timestampFields);

/**
 * ソーシャルアクション検証リクエストスキーマ
 */
export const socialActionVerificationRequestSchema = z.object({
  platform: socialPlatformSchema,
  action: z.nativeEnum(SocialAction),
  targetId: z.string(),
  targetUsername: z.string().optional(),
  questId: idSchema.optional(),
  proof: z.string().optional(), // 検証に必要な追加情報
});

/**
 * ソーシャルアクション検証レスポンススキーマ
 */
export const socialActionVerificationResponseSchema = z.object({
  success: z.boolean(),
  verification: socialActionVerificationSchema.optional(),
  message: z.string().optional(),
});

/**
 * ユーザーソーシャル連携一覧レスポンススキーマ
 */
export const userSocialConnectionsResponseSchema = z.object({
  socialConnections: z.array(socialConnectionSchema.omit({
    accessToken: true,
    refreshToken: true,
    tokenSecret: true,
  })),
  walletConnections: z.array(walletConnectionSchema.omit({
    publicKey: true,
  })),
});
