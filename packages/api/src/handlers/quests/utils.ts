/**
 * @file packages/api/src/handlers/quests/utils.ts
 * @description クエスト関連のユーティリティ関数
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { ApiError, ErrorCode, QuestSearchQuery } from './types';

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

/**
 * クエリパラメータをパースする
 */
export function parseQueryParams(url: URL): Record<string, string> {
  const queryParams: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });
  return queryParams;
}

/**
 * クエリパラメータをバリデーションする
 */
export function validateQueryParams(queryParams: Record<string, string>): QuestSearchQuery {
  return {
    query: queryParams.query,
    type: queryParams.type as any,
    difficulty: queryParams.difficulty as any,
    isDaily: queryParams.isDaily === 'true',
    isWeekly: queryParams.isWeekly === 'true',
    isActive: queryParams.isActive === 'true',
    isHidden: queryParams.isHidden === 'true',
    isPromoted: queryParams.isPromoted === 'true',
    requiredLevel: queryParams.requiredLevel ? parseInt(queryParams.requiredLevel) : undefined,
    tags: queryParams.tags ? queryParams.tags.split(',') : undefined,
    category: queryParams.category,
    page: queryParams.page ? parseInt(queryParams.page) : 1,
    limit: queryParams.limit ? parseInt(queryParams.limit) : 10,
  };
}

/**
 * ページネーションの計算
 */
export function calculatePagination(page: number, limit: number, total?: number) {
  const offset = (page - 1) * limit;
  return {
    page,
    limit,
    offset,
    total: total || 0,
    totalPages: total ? Math.ceil(total / limit) : 0,
  };
}

/**
 * クエスト完了状況をマップに変換
 */
export function createQuestCompletionMap(completions: any[]) {
  return completions.reduce((acc, completion) => {
    acc[completion.questId] = {
      completedAt: completion.completedAt,
      verificationStatus: completion.verificationStatus,
    };
    return acc;
  }, {} as Record<string, any>);
}

/**
 * クエスト一覧にユーザーの完了状況を追加
 */
export function addCompletionStatusToQuests(quests: any[], questCompletions: Record<string, any>) {
  return quests?.map(quest => {
    const completion = questCompletions[quest.id];
    return {
      ...quest,
      isCompleted: !!completion,
      completedAt: completion?.completedAt,
      verificationStatus: completion?.verificationStatus,
    };
  });
}
