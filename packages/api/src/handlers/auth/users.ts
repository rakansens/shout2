/**
 * @file packages/api/src/handlers/auth/users.ts
 * @description ユーザープロフィール情報を取得・更新するハンドラー
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiError, ErrorCode, userSchema, userUpdateSchema } from './types';
import { createSupabaseClient, createSuccessResponse, handleError } from './utils';

/**
 * ユーザープロフィール情報を取得する
 * @route GET /api/users/[id]
 */
export async function getUserProfile(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // Supabaseクライアントを作成
    const supabase = createSupabaseClient();

    // ユーザー情報を取得
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      throw new ApiError(
        ErrorCode.NOT_FOUND,
        'ユーザー情報の取得に失敗しました',
        userError.message
      );
    }

    if (!user) {
      throw new ApiError(
        ErrorCode.NOT_FOUND,
        'ユーザーが見つかりません',
        `ID: ${userId}`
      );
    }

    // ユーザー情報をバリデーション
    const validatedUser = userSchema.parse(user);

    // レスポンスを返す
    return createSuccessResponse({
      data: validatedUser
    });
  } catch (error: any) {
    const { error: apiError, statusCode } = handleError(error, 'GET /api/users/[id]');
    return NextResponse.json(apiError.toResponse(), { status: statusCode });
  }
}

/**
 * ユーザープロフィール情報を更新する
 * @route PATCH /api/users/[id]
 */
export async function updateUserProfile(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // リクエストボディを取得
    const body = await request.json();

    // リクエストボディをバリデーション
    const validatedData = userUpdateSchema.parse(body);

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

    // 自分のプロフィールのみ更新可能
    if (session.user.id !== userId) {
      throw new ApiError(
        ErrorCode.FORBIDDEN,
        '他のユーザーのプロフィールは更新できません',
        `Requested user ID: ${userId}, Session user ID: ${session.user.id}`
      );
    }

    // ユーザー情報を更新
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(validatedData)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      throw new ApiError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'ユーザー情報の更新に失敗しました',
        updateError.message
      );
    }

    // 更新されたユーザー情報をバリデーション
    const validatedUser = userSchema.parse(updatedUser);

    // レスポンスを返す
    return createSuccessResponse({
      data: validatedUser
    });
  } catch (error: any) {
    const { error: apiError, statusCode } = handleError(error, 'PATCH /api/users/[id]');
    return NextResponse.json(apiError.toResponse(), { status: statusCode });
  }
}
