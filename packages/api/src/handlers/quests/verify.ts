/**
 * @file packages/api/src/handlers/quests/verify.ts
 * @description トラッキングIDを検証するハンドラー
 */

import { NextRequest } from 'next/server';
import { ApiError, ErrorCode } from './types';
import {
  createSupabaseClient,
  createSuccessResponse,
  handleError,
  createErrorResponse,
} from './utils';

/**
 * トラッキングIDを検証する
 * @route GET /api/quests/url/{trackingId}
 */
export async function verifyTrackingId(
  request: NextRequest,
  { params }: { params: { trackingId: string } }
) {
  try {
    const trackingId = params.trackingId;

    if (!trackingId) {
      throw new ApiError(
        ErrorCode.VALIDATION_ERROR,
        'トラッキングIDが指定されていません',
      );
    }

    // Supabaseクライアントを作成
    const supabase = createSupabaseClient();

    // トラッキング情報を取得
    const { data: tracking, error: trackingError } = await supabase
      .from('quest_tracking')
      .select('*, quests(*)')
      .eq('trackingId', trackingId)
      .single();

    if (trackingError) {
      if (trackingError.code === 'PGRST116') {
        throw new ApiError(
          ErrorCode.NOT_FOUND,
          'トラッキングIDが見つかりません',
          trackingError.message
        );
      }
      throw new ApiError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'トラッキング情報の取得に失敗しました',
        trackingError.message
      );
    }

    // 有効期限を確認
    const expiresAt = new Date(tracking.expiresAt);
    if (expiresAt < new Date()) {
      throw new ApiError(
        ErrorCode.EXPIRED,
        'トラッキングIDの有効期限が切れています',
      );
    }

    // クエスト情報を取得
    const quest = tracking.quests;
    if (!quest) {
      throw new ApiError(
        ErrorCode.NOT_FOUND,
        'クエスト情報が見つかりません',
      );
    }

    // クエストが非アクティブの場合はエラー
    if (!quest.isActive) {
      throw new ApiError(
        ErrorCode.NOT_FOUND,
        'クエストが見つかりません',
      );
    }

    // クエストタイプがURL_VISITでない場合はエラー
    if (quest.type !== 'url_visit') {
      throw new ApiError(
        ErrorCode.VALIDATION_ERROR,
        'このクエストはURL訪問タイプではありません',
      );
    }

    // 訪問先URLを取得
    const visitUrl = quest.requirements?.url;
    if (!visitUrl) {
      throw new ApiError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'クエストに訪問先URLが設定されていません',
      );
    }

    // 訪問検証用のJavaScriptコードを生成
    const verificationScript = `
      <script>
        (function() {
          // 訪問時間を記録
          const startTime = Date.now();
          
          // ページ離脱時に訪問時間を送信
          window.addEventListener('beforeunload', function() {
            const visitDuration = Math.floor((Date.now() - startTime) / 1000);
            
            // 非同期送信（ビーコンAPIを使用）
            navigator.sendBeacon(
              '${request.nextUrl.origin}/api/quests/${quest.id}/visit',
              JSON.stringify({
                trackingId: '${trackingId}',
                visitDuration: visitDuration,
                referrer: document.referrer,
                userAgent: navigator.userAgent
              })
            );
          });
          
          // コンソールにデバッグ情報を表示
          console.log('Shout2クエスト訪問トラッキングが有効です');
          console.log('クエストID:', '${quest.id}');
          console.log('トラッキングID:', '${trackingId}');
        })();
      </script>
    `;

    // レスポンスを返す
    return createSuccessResponse({
      data: {
        trackingId,
        questId: quest.id,
        questTitle: quest.title,
        questDescription: quest.description,
        minVisitDuration: quest.requirements?.minVisitDuration || 0,
        verificationScript,
      },
    });
  } catch (error: any) {
    const { error: apiError } = handleError(error, 'GET /api/quests/url/[trackingId]');
    return createErrorResponse(apiError);
  }
}
