/**
 * @file packages/api/src/schemas/user.ts
 * @description ユーザー関連のZodスキーマ定義
 */

import { z } from 'zod';
import { idSchema, timestampFields, imageSchema, languageCodeSchema } from './common';

/**
 * ユーザーロール列挙型
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

/**
 * ユーザーステータス列挙型
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
}

/**
 * 認証プロバイダー列挙型
 */
export enum AuthProvider {
  EMAIL = 'email',
  TELEGRAM = 'telegram',
  LINE = 'line',
  TWITTER = 'twitter',
  WALLET = 'wallet',
}

/**
 * 基本ユーザースキーマ
 */
export const userSchema = z.object({
  id: idSchema,
  username: z.string().min(3).max(30),
  displayName: z.string().min(1).max(50),
  email: z.string().email().optional(),
  avatar: imageSchema.optional(),
  bio: z.string().max(500).optional(),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
  status: z.nativeEnum(UserStatus).default(UserStatus.ACTIVE),
  level: z.number().int().nonnegative().default(1),
  experience: z.number().int().nonnegative().default(0),
  points: z.number().int().nonnegative().default(0),
  language: languageCodeSchema.default('en'),
  authProvider: z.nativeEnum(AuthProvider),
  authProviderId: z.string(),
  metadata: z.record(z.any()).optional(),
  preferences: z.object({
    notifications: z.boolean().default(true),
    marketing: z.boolean().default(false),
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    animationsEnabled: z.boolean().default(true),
  }).optional(),
  lastLoginAt: z.string().datetime().optional(),
  joinedAt: z.string().datetime(),
}).merge(timestampFields);

/**
 * ユーザー作成入力スキーマ
 */
export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  displayName: true,
  level: true,
  experience: true,
  points: true,
  language: true,
  preferences: true,
  joinedAt: true,
}).required({
  authProvider: true,
  authProviderId: true,
});

/**
 * ユーザー更新入力スキーマ
 */
export const updateUserSchema = userSchema.omit({
  id: true,
  authProvider: true,
  authProviderId: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  joinedAt: true,
}).partial();

/**
 * ユーザープロフィール公開スキーマ
 */
export const publicUserProfileSchema = userSchema.omit({
  email: true,
  role: true,
  status: true,
  authProvider: true,
  authProviderId: true,
  metadata: true,
  preferences: true,
  lastLoginAt: true,
});

/**
 * ユーザー認証情報スキーマ
 */
export const userAuthInfoSchema = z.object({
  id: idSchema,
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus),
  authProvider: z.nativeEnum(AuthProvider),
  authProviderId: z.string(),
});

/**
 * ユーザー統計情報スキーマ
 */
export const userStatsSchema = z.object({
  userId: idSchema,
  questsCompleted: z.number().int().nonnegative().default(0),
  eventsParticipated: z.number().int().nonnegative().default(0),
  totalPointsEarned: z.number().int().nonnegative().default(0),
  totalPointsSpent: z.number().int().nonnegative().default(0),
  highestRank: z.number().int().positive().optional(),
  achievementsUnlocked: z.number().int().nonnegative().default(0),
  songsPlayed: z.number().int().nonnegative().default(0),
  perfectScores: z.number().int().nonnegative().default(0),
  commentsPosted: z.number().int().nonnegative().default(0),
  itemsPurchased: z.number().int().nonnegative().default(0),
  lastUpdatedAt: z.string().datetime(),
});

/**
 * ユーザー実績スキーマ
 */
export const userAchievementSchema = z.object({
  id: idSchema,
  userId: idSchema,
  achievementId: idSchema,
  unlockedAt: z.string().datetime(),
  progress: z.number().int().nonnegative().optional(),
}).merge(timestampFields);

/**
 * ソーシャル連携情報スキーマ
 */
export const socialConnectionSchema = z.object({
  id: idSchema,
  userId: idSchema,
  provider: z.enum(['twitter', 'telegram', 'tiktok', 'instagram', 'facebook', 'discord', 'wallet']),
  providerId: z.string(),
  username: z.string().optional(),
  displayName: z.string().optional(),
  profileUrl: z.string().url().optional(),
  avatar: z.string().url().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  tokenSecret: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  scope: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
  isVerified: z.boolean().default(false),
  connectedAt: z.string().datetime(),
}).merge(timestampFields);

/**
 * ウォレット連携情報スキーマ
 */
export const walletConnectionSchema = z.object({
  id: idSchema,
  userId: idSchema,
  walletType: z.enum(['ethereum', 'ton', 'solana', 'bitcoin', 'other']),
  address: z.string(),
  publicKey: z.string().optional(),
  isVerified: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
  connectedAt: z.string().datetime(),
}).merge(timestampFields);

/**
 * ユーザーセッションスキーマ
 */
export const userSessionSchema = z.object({
  id: idSchema,
  userId: idSchema,
  token: z.string(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  expiresAt: z.string().datetime(),
  lastActiveAt: z.string().datetime(),
}).merge(timestampFields);

/**
 * ユーザーログインレスポンススキーマ
 */
export const loginResponseSchema = z.object({
  user: userSchema.omit({
    authProviderId: true,
    metadata: true,
  }),
  token: z.string(),
  expiresAt: z.string().datetime(),
});

/**
 * ユーザー検索クエリスキーマ
 */
export const userSearchQuerySchema = z.object({
  query: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  minLevel: z.number().int().positive().optional(),
  maxLevel: z.number().int().positive().optional(),
  authProvider: z.nativeEnum(AuthProvider).optional(),
  joinedAfter: z.string().datetime().optional(),
  joinedBefore: z.string().datetime().optional(),
});
