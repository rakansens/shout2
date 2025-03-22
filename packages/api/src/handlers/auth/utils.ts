/**
 * @file packages/api/src/handlers/auth/utils.ts
 * @description 認証関連のユーティリティ関数
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { ApiError, ErrorCode } from './types';

// 環境変数からSupabaseの接続情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Supabaseクライアントを作成する
 */
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * エラーハンドリング
 */
export function handleError(error: any, context: string) {
  console.error(`Error in ${context}:`, error);

  if (error instanceof ApiError) {
    return { error, statusCode: error.statusCode };
  }

  if (error instanceof z.ZodError) {
    const apiError = new ApiError(
      ErrorCode.VALIDATION_ERROR,
      'バリデーションエラー',
      error.errors
    );
    return { error: apiError, statusCode: apiError.statusCode };
  }

  const apiError = new ApiError(
    ErrorCode.INTERNAL_SERVER_ERROR,
    '内部サーバーエラー',
    error instanceof Error ? error.message : String(error)
  );
  return { error: apiError, statusCode: apiError.statusCode };
}

/**
 * エラーレスポンスを生成する
 */
export function createErrorResponse(error: ApiError) {
  return NextResponse.json(error.toResponse(), { status: error.statusCode });
}

/**
 * 成功レスポンスを生成する
 */
export function createSuccessResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}
