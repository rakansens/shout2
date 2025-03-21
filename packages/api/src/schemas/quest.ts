/**
 * @file packages/api/src/schemas/quest.ts
 * @description クエスト関連のZodスキーマ定義
 */

import { z } from 'zod';
import { idSchema, timestampFields, imageSchema, dateRangeSchema } from './common';

/**
 * クエストタイプ列挙型
 */
export enum QuestType {
  // SNSクエスト
  TWITTER_FOLLOW = 'twitter_follow',
  TWITTER_REPOST = 'twitter_repost',
  TWITTER_COMMENT = 'twitter_comment',
  TELEGRAM_JOIN = 'telegram_join',
  TIKTOK_LIKE = 'tiktok_like',
  
  // URL遷移クエスト
  URL_VISIT = 'url_visit',
  
  // ゲーム内クエスト
  PLAY_SONG = 'play_song',
  ACHIEVE_SCORE = 'achieve_score',
  COMPLETE_DAILY = 'complete_daily',
  
  // その他
  CUSTOM = 'custom',
}

/**
 * クエスト難易度列挙型
 */
export enum QuestDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

/**
 * クエストステータス列挙型
 */
export enum QuestStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  COMPLETED = 'completed',
}

/**
 * クエスト検証ステータス列挙型
 */
export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  MANUAL_REVIEW = 'manual_review',
}

/**
 * クエスト要件スキーマ
 */
export const questRequirementsSchema = z.object({
  // Twitter関連
  twitterUserId: z.string().optional(),
  twitterUsername: z.string().optional(),
  tweetId: z.string().optional(),
  
  // Telegram関連
  telegramGroupId: z.string().optional(),
  telegramGroupUsername: z.string().optional(),
  
  // TikTok関連
  tiktokUserId: z.string().optional(),
  tiktokUsername: z.string().optional(),
  tiktokVideoId: z.string().optional(),
  
  // URL遷移関連
  url: z.string().url().optional(),
  minVisitDuration: z.number().int().positive().optional(), // 秒単位
  
  // ゲーム関連
  songId: z.string().optional(),
  minScore: z.number().int().positive().optional(),
  
  // 共通
  actionCount: z.number().int().positive().default(1), // 必要なアクション回数
  customRequirements: z.record(z.any()).optional(),
});

/**
 * クエスト報酬スキーマ
 */
export const questRewardSchema = z.object({
  points: z.number().int().nonnegative().default(0),
  experience: z.number().int().nonnegative().default(0),
  itemIds: z.array(idSchema).optional(),
  customRewards: z.record(z.any()).optional(),
});

/**
 * 基本クエストスキーマ
 */
export const questSchema = z.object({
  id: idSchema,
  title: z.string().min(1).max(100),
  description: z.string().max(500),
  type: z.nativeEnum(QuestType),
  difficulty: z.nativeEnum(QuestDifficulty).default(QuestDifficulty.EASY),
  requirements: questRequirementsSchema,
  rewards: questRewardSchema,
  image: imageSchema.optional(),
  isDaily: z.boolean().default(false),
  isWeekly: z.boolean().default(false),
  isRepeatable: z.boolean().default(false),
  repeatCooldown: z.number().int().nonnegative().optional(), // 秒単位
  isActive: z.boolean().default(true),
  isHidden: z.boolean().default(false),
  isPromoted: z.boolean().default(false),
  requiredLevel: z.number().int().nonnegative().default(0),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  validPeriod: dateRangeSchema.optional(),
  completionCount: z.number().int().nonnegative().default(0),
  metadata: z.record(z.any()).optional(),
}).merge(timestampFields);

/**
 * クエスト作成入力スキーマ
 */
export const createQuestSchema = questSchema.omit({
  id: true,
  completionCount: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  isDaily: true,
  isWeekly: true,
  isRepeatable: true,
  isActive: true,
  isHidden: true,
  isPromoted: true,
  requiredLevel: true,
  tags: true,
  difficulty: true,
}).required({
  title: true,
  description: true,
  type: true,
  requirements: true,
  rewards: true,
});

/**
 * クエスト更新入力スキーマ
 */
export const updateQuestSchema = createQuestSchema.partial();

/**
 * クエスト完了スキーマ
 */
export const questCompletionSchema = z.object({
  id: idSchema,
  userId: idSchema,
  questId: idSchema,
  completedAt: z.string().datetime(),
  verificationStatus: z.nativeEnum(VerificationStatus).default(VerificationStatus.PENDING),
  verificationData: z.record(z.any()).optional(),
  rewardsIssued: z.boolean().default(false),
  pointsAwarded: z.number().int().nonnegative().optional(),
  experienceAwarded: z.number().int().nonnegative().optional(),
  itemsAwarded: z.array(idSchema).optional(),
}).merge(timestampFields);

/**
 * クエスト完了報告入力スキーマ
 */
export const questCompletionReportSchema = z.object({
  questId: idSchema,
  proof: z.string().optional(), // クエスト完了の証明（URLクエストの場合はセッションID、SNSクエストの場合は投稿IDなど）
  additionalData: z.record(z.any()).optional(), // クエストタイプに応じた追加データ
});

/**
 * URL遷移クエスト報告スキーマ
 */
export const urlVisitReportSchema = z.object({
  questId: idSchema,
  trackingId: z.string(),
  visitDuration: z.number().int().nonnegative().optional(),
  referrer: z.string().optional(),
  userAgent: z.string().optional(),
});

/**
 * Twitter連携クエスト検証スキーマ
 */
export const twitterVerificationSchema = z.object({
  questId: idSchema,
  twitterUserId: z.string(),
  twitterUsername: z.string(),
  actionType: z.enum(['follow', 'repost', 'comment']),
  targetId: z.string(), // ユーザーIDまたはツイートID
  timestamp: z.string().datetime(),
});

/**
 * クエスト検索クエリスキーマ
 */
export const questSearchQuerySchema = z.object({
  query: z.string().optional(),
  type: z.nativeEnum(QuestType).optional(),
  difficulty: z.nativeEnum(QuestDifficulty).optional(),
  isDaily: z.boolean().optional(),
  isWeekly: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isHidden: z.boolean().optional(),
  isPromoted: z.boolean().optional(),
  requiredLevel: z.number().int().nonnegative().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
});

/**
 * クエスト一覧レスポンススキーマ（ユーザー向け）
 */
export const userQuestListSchema = z.object({
  id: idSchema,
  title: z.string(),
  description: z.string(),
  type: z.nativeEnum(QuestType),
  difficulty: z.nativeEnum(QuestDifficulty),
  image: imageSchema.optional(),
  rewards: questRewardSchema,
  isDaily: z.boolean(),
  isWeekly: z.boolean(),
  isRepeatable: z.boolean(),
  isPromoted: z.boolean(),
  requiredLevel: z.number().int().nonnegative(),
  tags: z.array(z.string()),
  category: z.string().optional(),
  validPeriod: dateRangeSchema.optional(),
  isCompleted: z.boolean().default(false),
  completedAt: z.string().datetime().optional(),
  progress: z.number().int().nonnegative().optional(),
});
