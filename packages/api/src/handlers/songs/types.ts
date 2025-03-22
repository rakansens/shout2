/**
 * @file packages/api/src/handlers/songs/types.ts
 * @description 楽曲関連の型定義
 */

/**
 * エラーコード列挙型
 */
export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  ALREADY_COMPLETED = 'ALREADY_COMPLETED',
  INVALID_SONG_TYPE = 'INVALID_SONG_TYPE',
}

/**
 * APIエラークラス
 */
export class ApiError extends Error {
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
      case ErrorCode.NOT_FOUND:
        return 404;
      case ErrorCode.VALIDATION_ERROR:
        return 400;
      case ErrorCode.ALREADY_COMPLETED:
        return 409;
      case ErrorCode.INVALID_SONG_TYPE:
        return 400;
      case ErrorCode.INTERNAL_SERVER_ERROR:
      default:
        return 500;
    }
  }
}

/**
 * 楽曲カテゴリー列挙型
 */
export enum SongCategory {
  POP = 'pop',
  ROCK = 'rock',
  HIPHOP = 'hiphop',
  ELECTRONIC = 'electronic',
  JAZZ = 'jazz',
  CLASSICAL = 'classical',
  ANIME = 'anime',
  GAME = 'game',
  OTHER = 'other',
}

/**
 * 楽曲難易度列挙型
 */
export enum SongDifficulty {
  BEGINNER = 'beginner',
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard',
  EXPERT = 'expert',
}

/**
 * 楽曲ステータス列挙型
 */
export enum SongStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PREMIUM = 'premium',
  COMING_SOON = 'coming_soon',
}

/**
 * 楽曲スコアレベル列挙型
 */
export enum ScoreLevel {
  PERFECT = 'perfect',
  GREAT = 'great',
  GOOD = 'good',
  OK = 'ok',
  MISS = 'miss',
}

/**
 * 楽曲検索パラメータの型
 */
export interface SongSearchParams {
  query?: string;
  category?: SongCategory;
  difficulty?: SongDifficulty;
  isNew?: boolean;
  isFeatured?: boolean;
  artistId?: string;
  page: number;
  limit: number;
  sortBy: 'title' | 'releaseDate' | 'popularity' | 'difficulty';
  sortOrder: 'asc' | 'desc';
}

/**
 * コメント検索パラメータの型
 */
export interface CommentSearchParams {
  sort: 'newest' | 'oldest' | 'likes';
  page: number;
  limit: number;
}

/**
 * コメント投稿データの型
 */
export interface CommentPostData {
  content: string;
  rating?: number;
}

/**
 * ページネーション情報の型
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * 楽曲再生履歴の型
 */
export interface SongPlayHistory {
  lastPlayedAt: string;
  playCount: number;
  highScore: number;
}

/**
 * 楽曲一覧レスポンスの型
 */
export interface SongListResponse {
  data: any[];
  pagination: PaginationInfo;
}

/**
 * 楽曲詳細レスポンスの型
 */
export interface SongDetailResponse {
  data: any;
}

/**
 * コメント一覧レスポンスの型
 */
export interface CommentListResponse {
  data: any[];
  pagination: PaginationInfo;
}

/**
 * コメント投稿レスポンスの型
 */
export interface CommentPostResponse {
  data: any;
}
