/**
 * @file packages/api/src/handlers/auth/types.ts
 * @description 認証関連の型定義
 */

import { z } from 'zod';

// エラーコード列挙型
export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
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

// ユーザースキーマ
export const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string().optional(),
  profile_picture: z.string().optional(),
  platform: z.string(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  telegram_id: z.string().optional(),
  line_id: z.string().optional(),
  bio: z.string().optional(),
  // 他のフィールドも必要に応じて追加
});

// ユーザー更新スキーマ
export const userUpdateSchema = z.object({
  username: z.string().optional(),
  profile_picture: z.string().optional(),
  bio: z.string().optional(),
  // 他の更新可能なフィールドも必要に応じて追加
});

// ユーザー型
export type User = z.infer<typeof userSchema>;

// ユーザー更新型
export type UserUpdate = z.infer<typeof userUpdateSchema>;
