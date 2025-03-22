/**
 * @file packages/api/src/handlers/auth/me.ts
 * @description 現在のユーザー情報を取得するハンドラー
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiError, ErrorCode, userSchema } from './types';
import { createSupabaseClient, createSuccessResponse, handleError } from './utils';

/**
 * 現在のユーザー情報を取得する
 * @route GET /api/auth/me
 */
export async function getCurrentUser(request: NextRequest) {
  try {
    // Supabaseクライアントを作成
    const supabase = createSupabaseClient();

    // 現在のセッションを取得
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new ApiError(
        ErrorCode.UNAUTHORIZED,
        'セッションの取得に失敗しました',
        sessionError.message
      );
    }

    // セッションが存在しない場合は未認証エラー
    if (!session) {
      throw new ApiError(
        ErrorCode.UNAUTHORIZED,
        '認証されていません',
        'ログインが必要です'
      );
    }

    // ユーザー情報を取得
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError) {
      throw new ApiError(
        ErrorCode.NOT_FOUND,
        'ユーザー情報の取得に失敗しました',
        userError.message
      );
    }

    // ユーザー情報をバリデーション
    const validatedUser = userSchema.parse(user);

    // レスポンスを返す
    return createSuccessResponse({
      data: validatedUser
    });
  } catch (error: any) {
    const { error: apiError, statusCode } = handleError(error, 'GET /api/auth/me');
    return NextResponse.json(apiError.toResponse(), { status: statusCode });
  }
}
