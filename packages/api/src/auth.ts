// このファイルは、認証関連の機能を提供します。

import { supabase } from './supabase';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// JWTシークレットキー
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key';

// Telegramの認証
export const telegramAuth = async (initData: string) => {
  try {
    console.log('Received initData:', initData);
    
    // Telegramから受け取ったデータをパース
    const data = new URLSearchParams(initData);
    
    // デバッグ用にすべてのパラメータを出力
    console.log('Parsed data parameters:');
    const entries = Array.from(data.entries());
    for (const [key, value] of entries) {
      console.log(`${key}: ${value}`);
    }
    
    // ハッシュを取得
    const hash = data.get('hash');
    if (!hash) {
      console.error('Hash not found in initData');
      return { error: { message: 'Hash not found in initData', status: 400 } };
    }
    
    // ユーザーデータを取得
    const userDataStr = data.get('user');
    if (!userDataStr) {
      console.error('User data not found in initData');
      return { error: { message: 'User data not found', status: 400 } };
    }
    
    // ユーザーデータをJSONとしてパース
    let userData;
    try {
      userData = JSON.parse(decodeURIComponent(userDataStr));
      console.log('Parsed user data:', userData);
    } catch (e) {
      console.error('Failed to parse user data:', e);
      return { error: { message: 'Invalid user data format', status: 400 } };
    }
    
    // データ検証文字列を作成
    const dataCheckString = Array.from(data.entries())
      .filter(([key]) => key !== 'hash')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    console.log('Data check string:', dataCheckString);
    
    // ハッシュを検証
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN is not set');
      return { error: { message: 'Bot token not configured', status: 500 } };
    }
    
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    
    console.log('Calculated hash:', calculatedHash);
    console.log('Received hash:', hash);
    
    if (hash !== calculatedHash) {
      console.error('Hash verification failed');
      return { error: { message: 'Invalid hash', status: 401 } };
    }
    
    // ユーザー情報を取得
    const userId = userData.id;
    const username = userData.username || '';
    const photoUrl = userData.photo_url || '';
    
    if (!userId) {
      console.error('User ID not found in parsed data');
      return { error: { message: 'User ID not found', status: 400 } };
    }
    
    console.log('User info:', { userId, username });

    try {
      // Supabaseでユーザーを検索または作成
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase error when selecting user:', error);
        return { error: { message: error.message, status: 500 } };
      }

      if (!user) {
        console.log('Creating new user');
        // 新規ユーザーを作成
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            telegram_id: userId,
            username: username || '',
            profile_picture: photoUrl || '',
            platform: 'telegram',
          })
          .select()
          .single();

        if (createError) {
          console.error('Supabase error when creating user:', createError);
          return { error: { message: createError.message, status: 500 } };
        }

        console.log('New user created:', newUser);

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

      console.log('Existing user found:', user);

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
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      
      // テーブルが存在しない場合は、テーブルを作成する必要があることを通知
      if (dbError.message && dbError.message.includes('relation "public.users" does not exist')) {
        return { 
          error: { 
            message: 'Users table does not exist. Please create the users table in Supabase with the following columns: id (uuid, primary key), telegram_id (text), username (text), profile_picture (text), platform (text), created_at (timestamp with timezone)', 
            status: 500 
          } 
        };
      }
      
      return { error: { message: dbError.message || 'Database error', status: 500 } };
    }
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
          username: profileData.displayName || '',
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
