/**
 * @file apps/line-client/src/app/api/auth/logout/route.ts
 * @description ログアウト処理を行うAPIエンドポイント
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 環境変数からSupabaseの接続情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * ログアウト処理
 * @route POST /api/auth/logout
 */
export async function POST(request: NextRequest) {
  try {
    // Supabaseクライアントを作成
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // ログアウト処理
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return NextResponse.json(
        { error: { message: error.message || 'ログアウトに失敗しました' } },
        { status: 500 }
      );
    }

    // ログアウト成功
    return NextResponse.json(
      { success: true, message: 'ログアウトしました' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: { message: error.message || 'ログアウトに失敗しました' } },
      { status: 500 }
    );
  }
}
