/**
 * @file packages/api/src/schemas/error.ts
 * @description エラー関連のZodスキーマ定義
 */

import { z } from 'zod';

/**
 * エラーコード列挙型
 */
export enum ErrorCode {
  // 認証関連エラー
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // リソース関連エラー
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',
  
  // バリデーションエラー
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // 外部サービス関連エラー
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  TWITTER_API_ERROR = 'TWITTER_API_ERROR',
  TELEGRAM_API_ERROR = 'TELEGRAM_API_ERROR',
  TIKTOK_API_ERROR = 'TIKTOK_API_ERROR',
  WALLET_CONNECTION_ERROR = 'WALLET_CONNECTION_ERROR',
  
  // データベース関連エラー
  DATABASE_ERROR = 'DATABASE_ERROR',
  TRANSACTION_ERROR = 'TRANSACTION_ERROR',
  
  // レート制限エラー
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // サーバーエラー
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  
  // クエスト関連エラー
  QUEST_ALREADY_COMPLETED = 'QUEST_ALREADY_COMPLETED',
  QUEST_EXPIRED = 'QUEST_EXPIRED',
  QUEST_VERIFICATION_FAILED = 'QUEST_VERIFICATION_FAILED',
  
  // ポイント関連エラー
  INSUFFICIENT_POINTS = 'INSUFFICIENT_POINTS',
  
  // その他
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * エラーレスポンススキーマ
 */
export const errorResponseSchema = z.object({
  error: z.object({
    code: z.nativeEnum(ErrorCode),
    message: z.string(),
    details: z.any().optional(),
  }),
});

/**
 * バリデーションエラー詳細スキーマ
 */
export const validationErrorDetailsSchema = z.array(
  z.object({
    path: z.array(z.string().or(z.number())),
    message: z.string(),
  })
);

/**
 * バリデーションエラーレスポンススキーマ
 */
export const validationErrorResponseSchema = z.object({
  error: z.object({
    code: z.literal(ErrorCode.VALIDATION_ERROR),
    message: z.string(),
    details: validationErrorDetailsSchema,
  }),
});

/**
 * APIエラークラス
 */
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
      case ErrorCode.TOKEN_EXPIRED:
      case ErrorCode.INVALID_CREDENTIALS:
        return 401;
      case ErrorCode.FORBIDDEN:
        return 403;
      case ErrorCode.NOT_FOUND:
        return 404;
      case ErrorCode.ALREADY_EXISTS:
      case ErrorCode.CONFLICT:
      case ErrorCode.QUEST_ALREADY_COMPLETED:
        return 409;
      case ErrorCode.VALIDATION_ERROR:
      case ErrorCode.INVALID_INPUT:
        return 400;
      case ErrorCode.RATE_LIMIT_EXCEEDED:
        return 429;
      case ErrorCode.NOT_IMPLEMENTED:
        return 501;
      case ErrorCode.INTERNAL_SERVER_ERROR:
      case ErrorCode.DATABASE_ERROR:
      case ErrorCode.TRANSACTION_ERROR:
      case ErrorCode.EXTERNAL_SERVICE_ERROR:
      case ErrorCode.TWITTER_API_ERROR:
      case ErrorCode.TELEGRAM_API_ERROR:
      case ErrorCode.TIKTOK_API_ERROR:
      case ErrorCode.WALLET_CONNECTION_ERROR:
      case ErrorCode.UNKNOWN_ERROR:
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

/**
 * Zodバリデーションエラーをフォーマットする関数
 */
export function formatZodError(error: z.ZodError) {
  return new ApiError(
    ErrorCode.VALIDATION_ERROR,
    'バリデーションエラー',
    error.errors.map(err => ({
      path: err.path,
      message: err.message,
    }))
  );
}
