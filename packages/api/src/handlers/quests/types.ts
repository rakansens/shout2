/**
 * @file packages/api/src/handlers/quests/types.ts
 * @description クエスト関連の型定義
 */

import { z } from 'zod';

// エラーコード列挙型
export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  ALREADY_COMPLETED = 'ALREADY_COMPLETED',
  INVALID_QUEST_TYPE = 'INVALID_QUEST_TYPE',
  EXPIRED = 'EXPIRED',
  FORBIDDEN = 'FORBIDDEN',
}

// APIエラークラス
export class ApiError extends Error {
  code: ErrorCode;
  details?: any;
  statusCode: number;

  constructor(code: ErrorCode, message: string, details?: any, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    
    // ステータスコードのマッピング
    this.statusCode = statusCode || this.getStatusCodeFromErrorCode(code);
  }

  /**
   * エラーコードからHTTPステータスコードを取得
   */
  private getStatusCodeFromErrorCode(code: ErrorCode): number {
    switch (code) {
      case ErrorCode.UNAUTHORIZED:
        return 401;
      case ErrorCode.FORBIDDEN:
        return 403;
      case ErrorCode.NOT_FOUND:
        return 404;
      case ErrorCode.VALIDATION_ERROR:
        return 400;
      case ErrorCode.ALREADY_COMPLETED:
        return 409;
      case ErrorCode.INVALID_QUEST_TYPE:
        return 400;
      case ErrorCode.EXPIRED:
        return 410;
      case ErrorCode.INTERNAL_SERVER_ERROR:
      default:
        return 500;
    }
  }

  /**
   * エラーレスポンスオブジェクトを生成
   */
  toResponse() {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
    };
  }
}

// クエストタイプ列挙型
export enum QuestType {
  TWITTER_FOLLOW = 'twitter_follow',
  TWITTER_REPOST = 'twitter_repost',
  TWITTER_COMMENT = 'twitter_comment',
  TELEGRAM_JOIN = 'telegram_join',
  TIKTOK_LIKE = 'tiktok_like',
  URL_VISIT = 'url_visit',
  PLAY_SONG = 'play_song',
  ACHIEVE_SCORE = 'achieve_score',
  COMPLETE_DAILY = 'complete_daily',
  CUSTOM = 'custom',
}

// クエスト難易度列挙型
export enum QuestDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

// クエスト検索クエリスキーマ
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
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

// URL訪問報告スキーマ
export const urlVisitReportSchema = z.object({
  trackingId: z.string(),
  visitDuration: z.number().int().nonnegative().optional(),
  referrer: z.string().optional(),
  userAgent: z.string().optional(),
});

// クエスト型
export type Quest = {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  difficulty: QuestDifficulty;
  isActive: boolean;
  isHidden: boolean;
  isDaily: boolean;
  isWeekly: boolean;
  isPromoted: boolean;
  completionCount: number;
  requirements: {
    url?: string;
    minVisitDuration?: number;
    [key: string]: any;
  };
  rewards: {
    points: number;
    experience: number;
    itemIds: string[];
    [key: string]: any;
  };
  [key: string]: any;
};

// クエスト検索クエリ型
export type QuestSearchQuery = z.infer<typeof questSearchQuerySchema>;

// URL訪問報告型
export type UrlVisitReport = z.infer<typeof urlVisitReportSchema>;
