// このファイルは、APIで使用するユーティリティ関数を提供します。

// レスポンスを整形する関数
export const formatResponse = (data: any, status = 200) => {
  return {
    status,
    data,
  };
};

// エラーレスポンスを整形する関数
export const formatError = (message: string, status = 500) => {
  return {
    status,
    error: {
      message,
    },
  };
};

// プラットフォームを検出する関数
export const detectPlatform = (userAgent?: string) => {
  if (!userAgent) return 'unknown';

  // Telegramの検出
  if (userAgent.includes('TelegramWebApp')) {
    return 'telegram';
  }

  // LINEの検出
  if (userAgent.includes('Line')) {
    return 'line';
  }

  return 'unknown';
};

// ページネーションパラメータを解析する関数
export const parsePaginationParams = (page?: string, limit?: string) => {
  const parsedPage = parseInt(page || '1', 10);
  const parsedLimit = parseInt(limit || '10', 10);

  return {
    page: isNaN(parsedPage) ? 1 : Math.max(1, parsedPage),
    limit: isNaN(parsedLimit) ? 10 : Math.min(100, Math.max(1, parsedLimit)),
    offset: isNaN(parsedPage) ? 0 : Math.max(0, (parsedPage - 1) * (isNaN(parsedLimit) ? 10 : Math.min(100, Math.max(1, parsedLimit)))),
  };
};

// 日付関連のユーティリティ
export const dateUtils = {
  // 現在の日付を取得
  getCurrentDate: () => {
    return new Date().toISOString().split('T')[0];
  },

  // 日付が今日かどうかを確認
  isToday: (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    return date === today;
  },

  // 日付が昨日かどうかを確認
  isYesterday: (date: string) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    return date === yesterdayStr;
  },

  // 2つの日付の差分（日数）を計算
  daysBetween: (date1: string, date2: string) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },
};

// 文字列をスラッグ化する関数
export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// ランダムなIDを生成する関数
export const generateRandomId = (length = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
