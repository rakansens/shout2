/**
 * @file packages/api/src/schemas/song.ts
 * @description 楽曲関連のZodスキーマ定義
 */

import { z } from 'zod';
import { idSchema, timestampFields, imageSchema } from './common';

/**
 * 楽曲難易度列挙型
 */
export enum SongDifficulty {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard',
  EXPERT = 'expert',
}

/**
 * 楽曲カテゴリー列挙型
 */
export enum SongCategory {
  POP = 'pop',
  ROCK = 'rock',
  HIPHOP = 'hiphop',
  ELECTRONIC = 'electronic',
  JAZZ = 'jazz',
  CLASSICAL = 'classical',
  OTHER = 'other',
}

/**
 * 楽曲ステータス列挙型
 */
export enum SongStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PREMIUM = 'premium',
  COMING_SOON = 'coming_soon',
}

/**
 * 楽曲スコアレベル列挙型
 */
export enum ScoreLevel {
  PERFECT = 'perfect',
  GREAT = 'great',
  GOOD = 'good',
  OK = 'ok',
  MISS = 'miss',
}

/**
 * 基本楽曲スキーマ
 */
export const songSchema = z.object({
  id: idSchema,
  title: z.string().min(1).max(100),
  artist: z.string().min(1).max(100),
  coverImage: imageSchema,
  audioUrl: z.string().url(),
  previewUrl: z.string().url().optional(),
  duration: z.number().positive(), // 秒単位
  bpm: z.number().positive(),
  difficulty: z.nativeEnum(SongDifficulty),
  category: z.nativeEnum(SongCategory),
  status: z.nativeEnum(SongStatus).default(SongStatus.ACTIVE),
  isPopular: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isPremium: z.boolean().default(false),
  requiredLevel: z.number().int().nonnegative().default(0),
  pointsReward: z.number().int().nonnegative().default(100),
  experienceReward: z.number().int().nonnegative().default(50),
  tags: z.array(z.string()).default([]),
  releaseDate: z.string().datetime().optional(),
  description: z.string().max(500).optional(),
  lyrics: z.string().optional(),
  playCount: z.number().int().nonnegative().default(0),
  averageRating: z.number().min(0).max(5).default(0),
  ratingCount: z.number().int().nonnegative().default(0),
  metadata: z.record(z.any()).optional(),
}).merge(timestampFields);

/**
 * 楽曲作成入力スキーマ
 */
export const createSongSchema = songSchema.omit({
  id: true,
  playCount: true,
  averageRating: true,
  ratingCount: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  isPopular: true,
  isNew: true,
  isPremium: true,
  requiredLevel: true,
  pointsReward: true,
  experienceReward: true,
  tags: true,
  status: true,
}).required({
  title: true,
  artist: true,
  coverImage: true,
  audioUrl: true,
  duration: true,
  bpm: true,
  difficulty: true,
  category: true,
});

/**
 * 楽曲更新入力スキーマ
 */
export const updateSongSchema = createSongSchema.partial();

/**
 * 楽曲コメントスキーマ
 */
export const songCommentSchema = z.object({
  id: idSchema,
  songId: idSchema,
  userId: idSchema,
  username: z.string(),
  userAvatar: z.string().url().optional(),
  content: z.string().min(1).max(500),
  rating: z.number().min(0).max(5).optional(),
  likes: z.number().int().nonnegative().default(0),
  isEdited: z.boolean().default(false),
  isHidden: z.boolean().default(false),
  parentId: idSchema.optional(), // リプライの場合
}).merge(timestampFields);

/**
 * 楽曲コメント作成入力スキーマ
 */
export const createSongCommentSchema = z.object({
  songId: idSchema,
  content: z.string().min(1).max(500),
  rating: z.number().min(0).max(5).optional(),
  parentId: idSchema.optional(),
});

/**
 * 楽曲コメント更新入力スキーマ
 */
export const updateSongCommentSchema = z.object({
  content: z.string().min(1).max(500).optional(),
  rating: z.number().min(0).max(5).optional(),
});

/**
 * 楽曲プレイ記録スキーマ
 */
export const songPlayRecordSchema = z.object({
  id: idSchema,
  userId: idSchema,
  songId: idSchema,
  score: z.number().int().nonnegative(),
  accuracy: z.number().min(0).max(100),
  combo: z.number().int().nonnegative(),
  perfectCount: z.number().int().nonnegative(),
  greatCount: z.number().int().nonnegative(),
  goodCount: z.number().int().nonnegative(),
  okCount: z.number().int().nonnegative(),
  missCount: z.number().int().nonnegative(),
  completionRate: z.number().min(0).max(100),
  playedAt: z.string().datetime(),
  pointsEarned: z.number().int().nonnegative(),
  experienceEarned: z.number().int().nonnegative(),
  isHighScore: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
}).merge(timestampFields);

/**
 * 楽曲プレイ記録作成入力スキーマ
 */
export const createSongPlayRecordSchema = songPlayRecordSchema.omit({
  id: true,
  isHighScore: true,
  createdAt: true,
  updatedAt: true,
}).required({
  userId: true,
  songId: true,
  score: true,
  accuracy: true,
  combo: true,
  perfectCount: true,
  greatCount: true,
  goodCount: true,
  okCount: true,
  missCount: true,
  completionRate: true,
  playedAt: true,
});

/**
 * 楽曲評価スキーマ
 */
export const songRatingSchema = z.object({
  id: idSchema,
  userId: idSchema,
  songId: idSchema,
  rating: z.number().min(0).max(5),
  ratedAt: z.string().datetime(),
}).merge(timestampFields);

/**
 * 楽曲評価作成入力スキーマ
 */
export const createSongRatingSchema = z.object({
  songId: idSchema,
  rating: z.number().min(0).max(5),
});

/**
 * 楽曲検索クエリスキーマ
 */
export const songSearchQuerySchema = z.object({
  query: z.string().optional(),
  category: z.nativeEnum(SongCategory).optional(),
  difficulty: z.nativeEnum(SongDifficulty).optional(),
  status: z.nativeEnum(SongStatus).optional(),
  isPopular: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isPremium: z.boolean().optional(),
  minRating: z.number().min(0).max(5).optional(),
  tags: z.array(z.string()).optional(),
  artist: z.string().optional(),
});

/**
 * 楽曲一覧レスポンススキーマ（ユーザー向け）
 */
export const userSongListSchema = z.object({
  id: idSchema,
  title: z.string(),
  artist: z.string(),
  coverImage: imageSchema,
  previewUrl: z.string().url().optional(),
  duration: z.number().positive(),
  difficulty: z.nativeEnum(SongDifficulty),
  category: z.nativeEnum(SongCategory),
  isPopular: z.boolean(),
  isNew: z.boolean(),
  isPremium: z.boolean(),
  requiredLevel: z.number().int().nonnegative(),
  pointsReward: z.number().int().nonnegative(),
  averageRating: z.number().min(0).max(5),
  playCount: z.number().int().nonnegative(),
  userHighScore: z.number().int().nonnegative().optional(),
  userRating: z.number().min(0).max(5).optional(),
  isUnlocked: z.boolean().default(true),
});

/**
 * 楽曲詳細レスポンススキーマ（ユーザー向け）
 */
export const userSongDetailSchema = userSongListSchema.extend({
  description: z.string().optional(),
  tags: z.array(z.string()),
  releaseDate: z.string().datetime().optional(),
  comments: z.array(songCommentSchema).optional(),
  userPlayHistory: z.array(songPlayRecordSchema).optional(),
});
