/**
 * @file apps/line-client/src/app/api/quests/url/[trackingId]/route.ts
 * @description トラッキングIDを検証するAPIエンドポイント
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 環境変数からSupabaseの接続情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// エラーコード列挙型
enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  EXPIRED = 'EXPIRED',
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
      case ErrorCode.NOT_FOUND:
        return 404;
      case ErrorCode.VALIDATION_ERROR:
        return 400;
      case ErrorCode.EXPIRED:
        return 410;
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

/**
 * トラッキングIDを検証する
 * @route GET /api/quests/url/{trackingId}
 */
export async function GET(
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
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    return NextResponse.json({
      data: {
        trackingId,
        questId: quest.id,
        questTitle: quest.title,
        questDescription: quest.description,
        minVisitDuration: quest.requirements?.minVisitDuration || 0,
        verificationScript,
      },
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/quests/url/[trackingId]:', error);

    if (error instanceof ApiError) {
      return NextResponse.json(error.toResponse(), { status: error.statusCode });
    }

    const apiError = new ApiError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      '内部サーバーエラー',
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(apiError.toResponse(), { status: apiError.statusCode });
  }
}
