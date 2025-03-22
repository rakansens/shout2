/**
 * @file packages/api/src/handlers/songs/index.ts
 * @description 楽曲関連のハンドラーをエクスポートするインデックスファイル
 */

// 型定義をエクスポート
export * from './types';

// ユーティリティ関数をエクスポート
export * from './utils';

// 楽曲一覧ハンドラーをエクスポート
export { getSongList } from './list';

// 楽曲詳細ハンドラーをエクスポート
export { getSongDetail } from './detail';

// 楽曲コメント関連ハンドラーをエクスポート
export { getSongComments, postSongComment } from './comments';
