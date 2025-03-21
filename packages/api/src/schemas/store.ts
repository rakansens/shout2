/**
 * @file packages/api/src/schemas/store.ts
 * @description ストア関連のZodスキーマ定義
 */

import { z } from 'zod';
import { idSchema, timestampFields, imageSchema, moneySchema, dateRangeSchema } from './common';

/**
 * アイテムタイプ列挙型
 */
export enum ItemType {
  AVATAR = 'avatar',
  BACKGROUND = 'background',
  EFFECT = 'effect',
  SONG = 'song',
  THEME = 'theme',
  EMOTE = 'emote',
  BADGE = 'badge',
  BUNDLE = 'bundle',
  OTHER = 'other',
}

/**
 * アイテムレアリティ列挙型
 */
export enum ItemRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  LIMITED = 'limited',
}

/**
 * 購入タイプ列挙型
 */
export enum PurchaseType {
  POINTS = 'points',
  REAL_MONEY = 'real_money',
  FREE = 'free',
}

/**
 * 購入ステータス列挙型
 */
export enum PurchaseStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELED = 'canceled',
}

/**
 * 基本ストアアイテムスキーマ
 */
export const storeItemSchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  type: z.nativeEnum(ItemType),
  rarity: z.nativeEnum(ItemRarity).default(ItemRarity.COMMON),
  images: z.array(imageSchema),
  thumbnailImage: imageSchema,
  previewImages: z.array(imageSchema).optional(),
  previewVideo: z.string().url().optional(),
  purchaseType: z.nativeEnum(PurchaseType),
  pointsPrice: z.number().int().nonnegative().optional(),
  realMoneyPrice: moneySchema.optional(),
  isDiscounted: z.boolean().default(false),
  originalPointsPrice: z.number().int().nonnegative().optional(),
  originalRealMoneyPrice: moneySchema.optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  isLimited: z.boolean().default(false),
  limitedQuantity: z.number().int().positive().optional(),
  remainingQuantity: z.number().int().nonnegative().optional(),
  isNew: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  requiredLevel: z.number().int().nonnegative().default(0),
  availabilityPeriod: dateRangeSchema.optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  bundleItems: z.array(idSchema).optional(), // バンドルの場合に含まれるアイテムID
  relatedItems: z.array(idSchema).optional(), // 関連アイテムID
  metadata: z.record(z.any()).optional(),
  isActive: z.boolean().default(true),
  purchaseCount: z.number().int().nonnegative().default(0),
}).merge(timestampFields);

/**
 * ストアアイテム作成入力スキーマ
 */
export const createStoreItemSchema = storeItemSchema.omit({
  id: true,
  purchaseCount: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  rarity: true,
  isDiscounted: true,
  isLimited: true,
  isNew: true,
  isFeatured: true,
  isPopular: true,
  requiredLevel: true,
  tags: true,
  isActive: true,
}).required({
  name: true,
  type: true,
  images: true,
  thumbnailImage: true,
  purchaseType: true,
});

/**
 * ストアアイテム更新入力スキーマ
 */
export const updateStoreItemSchema = createStoreItemSchema.partial();

/**
 * ユーザーアイテムスキーマ
 */
export const userItemSchema = z.object({
  id: idSchema,
  userId: idSchema,
  itemId: idSchema,
  acquiredAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  isEquipped: z.boolean().default(false),
  usageCount: z.number().int().nonnegative().default(0),
  lastUsedAt: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
}).merge(timestampFields);

/**
 * 購入履歴スキーマ
 */
export const purchaseHistorySchema = z.object({
  id: idSchema,
  userId: idSchema,
  itemId: idSchema,
  itemName: z.string(),
  purchaseType: z.nativeEnum(PurchaseType),
  pointsAmount: z.number().int().nonnegative().optional(),
  realMoneyAmount: moneySchema.optional(),
  status: z.nativeEnum(PurchaseStatus),
  transactionId: z.string().optional(),
  purchasedAt: z.string().datetime(),
  metadata: z.record(z.any()).optional(),
}).merge(timestampFields);

/**
 * 購入リクエストスキーマ
 */
export const purchaseRequestSchema = z.object({
  itemId: idSchema,
  quantity: z.number().int().positive().default(1),
  paymentMethod: z.string().optional(), // 実際の決済方法（クレジットカード、PayPal、Appleなど）
  metadata: z.record(z.any()).optional(),
});

/**
 * 購入レスポンススキーマ
 */
export const purchaseResponseSchema = z.object({
  success: z.boolean(),
  purchaseId: idSchema.optional(),
  status: z.nativeEnum(PurchaseStatus),
  message: z.string().optional(),
  item: storeItemSchema.optional(),
  userItem: userItemSchema.optional(),
  pointsBalance: z.number().int().nonnegative().optional(),
  paymentUrl: z.string().url().optional(), // 実際の決済ページURL（外部決済の場合）
});

/**
 * ストアアイテム検索クエリスキーマ
 */
export const storeItemSearchQuerySchema = z.object({
  query: z.string().optional(),
  type: z.nativeEnum(ItemType).optional(),
  rarity: z.nativeEnum(ItemRarity).optional(),
  purchaseType: z.nativeEnum(PurchaseType).optional(),
  isDiscounted: z.boolean().optional(),
  isLimited: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  maxPointsPrice: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
});

/**
 * ユーザーアイテム検索クエリスキーマ
 */
export const userItemSearchQuerySchema = z.object({
  userId: idSchema,
  type: z.nativeEnum(ItemType).optional(),
  isEquipped: z.boolean().optional(),
  acquiredAfter: z.string().datetime().optional(),
  acquiredBefore: z.string().datetime().optional(),
});

/**
 * 購入確認モーダルデータスキーマ
 */
export const purchaseConfirmationSchema = z.object({
  item: storeItemSchema,
  userPointsBalance: z.number().int().nonnegative(),
  canAfford: z.boolean(),
  willUnlock: z.array(z.object({
    id: idSchema,
    name: z.string(),
    type: z.nativeEnum(ItemType),
    thumbnailImage: imageSchema,
  })).optional(),
});

/**
 * ストアカテゴリースキーマ
 */
export const storeCategorySchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
  icon: z.string().optional(),
  displayOrder: z.number().int().nonnegative().default(0),
  itemTypes: z.array(z.nativeEnum(ItemType)).optional(),
  isActive: z.boolean().default(true),
}).merge(timestampFields);
