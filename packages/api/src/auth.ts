// このファイルは、認証関連の機能を提供します。

import { supabase } from './supabase';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// JWTシークレットキー
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key';

// Telegramの認証
export const telegramAuth = async (initData: string) => {
  try {
    // Telegramから受け取ったデータをパース
    const data = new URLSearchParams(initData);
    const dataCheckString = Array.from(data.entries())
      .filter(([key]) => key !== 'hash')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // ハッシュを検証
    const hash = data.get('hash');
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(process.env.TELEGRAM_BOT_TOKEN || '').digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (hash !== calculatedHash) {
      return { error: { message: 'Invalid hash', status: 401 } };
    }

    // ユーザー情報を取得
    const userId = data.get('id');
    const firstName = data.get('first_name');
    const lastName = data.get('last_name');
    const username = data.get('username');

    if (!userId) {
      return { error: { message: 'User ID not found', status: 400 } };
    }

    // Supabaseでユーザーを検索または作成
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return { error: { message: error.message, status: 500 } };
    }

    if (!user) {
      // 新規ユーザーを作成
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          telegram_id: userId,
          first_name: firstName || '',
          last_name: lastName || '',
          username: username || '',
          platform: 'telegram',
        })
        .select()
        .single();

      if (createError) {
        return { error: { message: createError.message, status: 500 } };
      }

      // JWTトークンを生成
      const token = jwt.sign(
        {
          sub: newUser.id,
          telegram_id: userId,
          platform: 'telegram',
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return { user: newUser, token };
    }

    // 既存ユーザーのJWTトークンを生成
    const token = jwt.sign(
      {
        sub: user.id,
        telegram_id: userId,
        platform: 'telegram',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { user, token };
  } catch (error: any) {
    console.error('Telegram auth error:', error);
    return { error: { message: error.message || 'Authentication failed', status: 500 } };
  }
};

// LINE認証
export const lineAuth = async (code: string, redirectUri: string) => {
  try {
    // LINEのアクセストークンを取得
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: process.env.LINE_CHANNEL_ID || '',
        client_secret: process.env.LINE_CHANNEL_SECRET || '',
      }).toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return { error: { message: tokenData.error_description || 'Failed to get access token', status: 401 } };
    }

    // LINEのユーザープロフィールを取得
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const profileData = await profileResponse.json();

    if (!profileResponse.ok) {
      return { error: { message: 'Failed to get user profile', status: 401 } };
    }

    // Supabaseでユーザーを検索または作成
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('line_id', profileData.userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return { error: { message: error.message, status: 500 } };
    }

    if (!user) {
      // 新規ユーザーを作成
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          line_id: profileData.userId,
          first_name: profileData.displayName || '',
          profile_picture: profileData.pictureUrl || '',
          platform: 'line',
        })
        .select()
        .single();

      if (createError) {
        return { error: { message: createError.message, status: 500 } };
      }

      // JWTトークンを生成
      const token = jwt.sign(
        {
          sub: newUser.id,
          line_id: profileData.userId,
          platform: 'line',
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return { user: newUser, token };
    }

    // 既存ユーザーのJWTトークンを生成
    const token = jwt.sign(
      {
        sub: user.id,
        line_id: profileData.userId,
        platform: 'line',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { user, token };
  } catch (error: any) {
    console.error('LINE auth error:', error);
    return { error: { message: error.message || 'Authentication failed', status: 500 } };
  }
};

// JWTトークンの検証
export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { decoded };
  } catch (error: any) {
    return { error: { message: error.message || 'Invalid token', status: 401 } };
  }
};
