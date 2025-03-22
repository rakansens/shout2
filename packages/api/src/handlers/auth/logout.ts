/**
 * @file packages/api/src/handlers/auth/logout.ts
 * @description ログアウト処理を行うハンドラー
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient, createSuccessResponse, handleError } from './utils';

/**
 * ログアウト処理
 * @route POST /api/auth/logout
 */
export async function logout(request: NextRequest) {
  try {
    // Supabaseクライアントを作成
    const supabase = createSupabaseClient();

    // ログアウト処理
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    // ログアウト成功
    return createSuccessResponse(
      { success: true, message: 'ログアウトしました' }
    );
  } catch (error: any) {
    const { error: apiError, statusCode } = handleError(error, 'POST /api/auth/logout');
    return NextResponse.json(apiError.toResponse(), { status: statusCode });
  }
}
