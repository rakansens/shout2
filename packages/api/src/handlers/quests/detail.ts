/**
 * @file packages/api/src/handlers/quests/detail.ts
 * @description 特定のクエストの詳細情報を取得するハンドラー
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
 * 特定のクエストの詳細情報を取得する
 * @route GET /api/quests/{id}
 */
export async function getQuestDetail(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questId = params.id;

    if (!questId) {
      throw new ApiError(
        ErrorCode.VALIDATION_ERROR,
        'クエストIDが指定されていません',
      );
    }

    // Supabaseクライアントを作成
    const supabase = createSupabaseClient();

    // 現在のセッションを取得
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new ApiError(
        ErrorCode.UNAUTHORIZED,
        'セッションの取得に失敗しました',
        sessionError.message
      );
    }

    // クエスト情報を取得
    const { data: quest, error: questError } = await supabase
      .from('quests')
      .select('*')
      .eq('id', questId)
      .single();

    if (questError) {
      if (questError.code === 'PGRST116') {
        throw new ApiError(
          ErrorCode.NOT_FOUND,
          'クエストが見つかりません',
          questError.message
        );
      }
      throw new ApiError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'クエスト情報の取得に失敗しました',
        questError.message
      );
    }

    // クエストが非アクティブまたは非表示の場合、管理者以外は閲覧不可
    if ((quest.isActive === false || quest.isHidden === true) && (!session || session.user.role !== 'admin')) {
      throw new ApiError(
        ErrorCode.NOT_FOUND,
        'クエストが見つかりません',
      );
    }

    // ユーザーがログインしている場合、クエスト完了状況を取得
    let completionStatus: {
      isCompleted: boolean;
      completedAt?: any;
      verificationStatus?: any;
      pointsAwarded?: any;
      experienceAwarded?: any;
      itemsAwarded?: any;
    } | null = null;

    if (session) {
      const { data: completion, error: completionError } = await supabase
        .from('quest_completions')
        .select('*')
        .eq('questId', questId)
        .eq('userId', session.user.id)
        .single();

      if (!completionError && completion) {
        completionStatus = {
          isCompleted: true,
          completedAt: completion.completedAt,
          verificationStatus: completion.verificationStatus,
          pointsAwarded: completion.pointsAwarded,
          experienceAwarded: completion.experienceAwarded,
          itemsAwarded: completion.itemsAwarded,
        };
      }
    }

    // クエスト情報にユーザーの完了状況を追加
    const questWithCompletionStatus = {
      ...quest,
      ...(completionStatus ? { completion: completionStatus } : { completion: { isCompleted: false } }),
    };

    // レスポンスを返す
    return createSuccessResponse({
      data: questWithCompletionStatus,
    });
  } catch (error: any) {
    const { error: apiError } = handleError(error, 'GET /api/quests/[id]');
    return createErrorResponse(apiError);
  }
}
