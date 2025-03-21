// このファイルは、Supabaseとの接続を管理します。

import { createClient } from '@supabase/supabase-js';

// 環境変数からSupabaseの接続情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// 通常のクライアント（匿名キーを使用）
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 管理者用クライアント（サービスロールキーを使用）
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Supabaseのテーブル名を定義
export const TABLES = {
  USERS: 'users',
  QUESTS: 'quests',
  QUEST_PROGRESS: 'quest_progress',
  STORE_ITEMS: 'store_items',
  USER_ITEMS: 'user_items',
  RANKINGS: 'rankings',
  WALLETS: 'wallets',
};

// Supabaseのエラーハンドリング
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  return {
    error: {
      message: error.message || 'An error occurred with the database',
      status: error.status || 500,
    },
  };
};
