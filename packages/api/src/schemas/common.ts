/**
 * @file packages/api/src/schemas/common.ts
 * @description 共通のZodスキーマ定義
 */

import { z } from 'zod';

/**
 * 共通のID型定義
 */
export const idSchema = z.string().uuid();

/**
 * ページネーション用のクエリパラメータスキーマ
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

/**
 * ソート用のクエリパラメータスキーマ
 */
export const sortSchema = z.object({
  sortBy: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * タイムスタンプフィールドスキーマ
 */
export const timestampFields = z.object({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * レスポンスメタデータスキーマ
 */
export const responseMetaSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  total: z.number().int().nonnegative().optional(),
  totalPages: z.number().int().nonnegative().optional(),
});

/**
 * ページネーション付きレスポンススキーマを生成する関数
 */
export function createPaginatedResponseSchema<T extends z.ZodTypeAny>(schema: T) {
  return z.object({
    data: z.array(schema),
    meta: responseMetaSchema,
  });
}

/**
 * 単一アイテムレスポンススキーマを生成する関数
 */
export function createSingleResponseSchema<T extends z.ZodTypeAny>(schema: T) {
  return z.object({
    data: schema,
  });
}

/**
 * エラーレスポンススキーマ
 */
export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
});

/**
 * 成功レスポンススキーマ
 */
export const successResponseSchema = z.object({
  success: z.boolean().default(true),
  message: z.string().optional(),
});

/**
 * 言語コードスキーマ
 */
export const languageCodeSchema = z.enum([
  'en', // 英語
  'ja', // 日本語
  'ko', // 韓国語
  'zh', // 中国語
  'es', // スペイン語
  'fr', // フランス語
  'de', // ドイツ語
  'ru', // ロシア語
]);

/**
 * 通貨コードスキーマ
 */
export const currencyCodeSchema = z.enum([
  'USD', // 米ドル
  'JPY', // 日本円
  'EUR', // ユーロ
  'GBP', // 英ポンド
  'KRW', // 韓国ウォン
  'CNY', // 中国元
]);

/**
 * 金額スキーマ
 */
export const moneySchema = z.object({
  amount: z.number().nonnegative(),
  currency: currencyCodeSchema,
});

/**
 * 画像URLスキーマ
 */
export const imageUrlSchema = z.string().url();

/**
 * 画像オブジェクトスキーマ
 */
export const imageSchema = z.object({
  url: imageUrlSchema,
  alt: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

/**
 * 日付範囲スキーマ
 */
export const dateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
});

/**
 * 位置情報スキーマ
 */
export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  name: z.string().optional(),
  address: z.string().optional(),
});

/**
 * SNSプラットフォーム列挙型
 */
export const socialPlatformSchema = z.enum([
  'twitter',
  'telegram',
  'tiktok',
  'instagram',
  'facebook',
  'discord',
  'wallet',
]);

/**
 * ウォレットタイプ列挙型
 */
export const walletTypeSchema = z.enum([
  'ethereum',
  'ton',
  'solana',
  'bitcoin',
  'other',
]);
