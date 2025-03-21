/**
 * @file packages/api/src/schemas/ranking.ts
 * @description ランキング関連のZodスキーマ定義
 */

import { z } from 'zod';
import { idSchema, timestampFields, imageSchema } from './common';

/**
 * ランキングタイプ列挙型
 */
export enum RankingType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  ALL_TIME = 'all_time',
  EVENT = 'event',
  SONG = 'song',
  QUEST = 'quest',
}

/**
 * ランキング期間スキーマ
 */
export const rankingPeriodSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  year: z.number().int().positive().optional(),
  month: z.number().int().min(1).max(12).optional(),
  week: z.number().int().positive().optional(),
});

/**
 * 基本ランキングスキーマ
 */
export const rankingSchema = z.object({
  id: idSchema,
  type: z.nativeEnum(RankingType),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  period: rankingPeriodSchema,
  targetId: z.string().optional(), // イベントID、楽曲ID、クエストIDなど
  isActive: z.boolean().default(true),
  totalParticipants: z.number().int().nonnegative().default(0),
  lastUpdatedAt: z.string().datetime(),
}).merge(timestampFields);

/**
 * ランキングエントリースキーマ
 */
export const rankingEntrySchema = z.object({
  id: idSchema,
  rankingId: idSchema,
  userId: idSchema,
  username: z.string(),
  displayName: z.string().optional(),
  avatar: imageSchema.optional(),
  rank: z.number().int().positive(),
  score: z.number().int().nonnegative(),
  previousRank: z.number().int().positive().optional(),
  rankChange: z.number().int().optional(), // 正の値は上昇、負の値は下降
  metadata: z.record(z.any()).optional(),
}).merge(timestampFields);

/**
 * ランキング作成入力スキーマ
 */
export const createRankingSchema = rankingSchema.omit({
  id: true,
  totalParticipants: true,
  lastUpdatedAt: true,
  createdAt: true,
  updatedAt: true,
}).required({
  type: true,
  title: true,
  period: true,
});

/**
 * ランキング更新入力スキーマ
 */
export const updateRankingSchema = createRankingSchema.partial();

/**
 * ランキングエントリー作成入力スキーマ
 */
export const createRankingEntrySchema = z.object({
  rankingId: idSchema,
  userId: idSchema,
  username: z.string(),
  displayName: z.string().optional(),
  avatar: imageSchema.optional(),
  score: z.number().int().nonnegative(),
});

/**
 * ランキングエントリー更新入力スキーマ
 */
export const updateRankingEntrySchema = z.object({
  score: z.number().int().nonnegative(),
});

/**
 * ランキング検索クエリスキーマ
 */
export const rankingSearchQuerySchema = z.object({
  type: z.nativeEnum(RankingType).optional(),
  isActive: z.boolean().optional(),
  targetId: z.string().optional(),
  year: z.number().int().positive().optional(),
  month: z.number().int().min(1).max(12).optional(),
  week: z.number().int().positive().optional(),
});

/**
 * ユーザーランキング情報スキーマ
 */
export const userRankingInfoSchema = z.object({
  rankingId: idSchema,
  type: z.nativeEnum(RankingType),
  title: z.string(),
  period: rankingPeriodSchema,
  userRank: z.number().int().positive().optional(),
  userScore: z.number().int().nonnegative().optional(),
  previousRank: z.number().int().positive().optional(),
  rankChange: z.number().int().optional(),
  totalParticipants: z.number().int().nonnegative(),
});

/**
 * ランキングリストレスポンススキーマ
 */
export const rankingListResponseSchema = z.object({
  id: idSchema,
  type: z.nativeEnum(RankingType),
  title: z.string(),
  description: z.string().optional(),
  period: rankingPeriodSchema,
  isActive: z.boolean(),
  totalParticipants: z.number().int().nonnegative(),
  userRank: z.number().int().positive().optional(),
  userScore: z.number().int().nonnegative().optional(),
});

/**
 * ランキング詳細レスポンススキーマ
 */
export const rankingDetailResponseSchema = rankingListResponseSchema.extend({
  entries: z.array(rankingEntrySchema),
  userEntry: rankingEntrySchema.optional(),
});

/**
 * ランキングサマリースキーマ
 */
export const rankingSummarySchema = z.object({
  weekly: userRankingInfoSchema.optional(),
  monthly: userRankingInfoSchema.optional(),
  allTime: userRankingInfoSchema.optional(),
  events: z.array(userRankingInfoSchema).optional(),
});

/**
 * ランキング更新通知スキーマ
 */
export const rankingUpdateNotificationSchema = z.object({
  rankingId: idSchema,
  type: z.nativeEnum(RankingType),
  title: z.string(),
  userId: idSchema,
  newRank: z.number().int().positive(),
  previousRank: z.number().int().positive().optional(),
  rankChange: z.number().int().optional(),
  score: z.number().int().nonnegative(),
  timestamp: z.string().datetime(),
});
