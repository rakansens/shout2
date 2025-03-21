/**
 * @file apps/line-client/src/app/api/users/[id]/route.ts
 * @description ユーザープロフィール情報を取得・更新するAPIエンドポイント
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// 環境変数からSupabaseの接続情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// エラーコード列挙型
enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  FORBIDDEN = 'FORBIDDEN',
}

// APIエラークラス
class ApiError extends Error {
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
const userSchema = z.object({
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
const userUpdateSchema = z.object({
  username: z.string().optional(),
  profile_picture: z.string().optional(),
  bio: z.string().optional(),
  // 他の更新可能なフィールドも必要に応じて追加
});

/**
 * ユーザープロフィール情報を取得する
 * @route GET /api/users/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // Supabaseクライアントを作成
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    return NextResponse.json({
      data: validatedUser
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/users/[id]:', error);

    if (error instanceof ApiError) {
      return NextResponse.json(error.toResponse(), { status: error.statusCode });
    }

    if (error instanceof z.ZodError) {
      const apiError = new ApiError(
        ErrorCode.VALIDATION_ERROR,
        'バリデーションエラー',
        error.errors
      );
      return NextResponse.json(apiError.toResponse(), { status: apiError.statusCode });
    }

    const apiError = new ApiError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      '内部サーバーエラー',
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(apiError.toResponse(), { status: apiError.statusCode });
  }
}

/**
 * ユーザープロフィール情報を更新する
 * @route PATCH /api/users/[id]
 */
export async function PATCH(
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
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    return NextResponse.json({
      data: validatedUser
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error in PATCH /api/users/[id]:', error);

    if (error instanceof ApiError) {
      return NextResponse.json(error.toResponse(), { status: error.statusCode });
    }

    if (error instanceof z.ZodError) {
      const apiError = new ApiError(
        ErrorCode.VALIDATION_ERROR,
        'バリデーションエラー',
        error.errors
      );
      return NextResponse.json(apiError.toResponse(), { status: apiError.statusCode });
    }

    const apiError = new ApiError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      '内部サーバーエラー',
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(apiError.toResponse(), { status: apiError.statusCode });
  }
}
