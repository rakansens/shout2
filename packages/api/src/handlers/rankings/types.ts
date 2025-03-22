/**
 * @file packages/api/src/handlers/rankings/types.ts
 * @description ランキング関連の共通型定義
 */

import { z } from 'zod';

// ランキングタイプ列挙型
// 注意: これはスキーマの RankingType とは異なります。
// スキーマの RankingType はランキングの期間（週間、月間、全期間）を表しますが、
// ここでのランキングタイプはランキングの種類（ポイント、クエスト、楽曲）を表します。
export enum RankingType {
  POINTS = 'points',
  QUESTS = 'quests',
  SONGS = 'songs',
}

// ランキング検索クエリスキーマ
export const rankingSearchQuerySchema = z.object({
  type: z.nativeEnum(RankingType).default(RankingType.POINTS),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// ユーザー情報の型定義
export interface UserInfo {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  level: number;
}

// ランキングクエリ結果の型定義
export interface RankingQueryResult {
  userId: string;
  points?: number;
  count?: number;
  score?: number;
  users: UserInfo;
}

// ランキングエントリーの型定義
export interface RankingEntry extends RankingQueryResult {
  rank: number;
  isCurrentUser: boolean;
}

// ユーザーランキング情報の型定義
export interface UserRankingInfo extends RankingQueryResult {
  rank: number;
}
