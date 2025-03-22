/**
 * @file packages/api/src/handlers/quests/list.ts
 * @description クエスト一覧を取得するハンドラー
 */

import { NextRequest } from 'next/server';
import { questSearchQuerySchema, ApiError, ErrorCode } from './types';
import {
  createSupabaseClient,
  parseQueryParams,
  calculatePagination,
  createQuestCompletionMap,
  addCompletionStatusToQuests,
  createSuccessResponse,
  handleError,
  createErrorResponse,
} from './utils';

/**
 * クエスト一覧を取得する
 * @route GET /api/quests
 */
export async function getQuestList(request: NextRequest) {
  try {
    // クエリパラメータを取得
    const url = new URL(request.url);
    const queryParams = parseQueryParams(url);

    // クエリパラメータをバリデーション
    const validatedQuery = questSearchQuerySchema.parse({
      query: queryParams.query,
      type: queryParams.type,
      difficulty: queryParams.difficulty,
      isDaily: queryParams.isDaily === 'true',
      isWeekly: queryParams.isWeekly === 'true',
      isActive: queryParams.isActive === 'true',
      isHidden: queryParams.isHidden === 'true',
      isPromoted: queryParams.isPromoted === 'true',
      requiredLevel: queryParams.requiredLevel ? parseInt(queryParams.requiredLevel) : undefined,
      tags: queryParams.tags ? queryParams.tags.split(',') : undefined,
      category: queryParams.category,
      page: queryParams.page ? parseInt(queryParams.page) : 1,
      limit: queryParams.limit ? parseInt(queryParams.limit) : 10,
    });

    // ページネーションの計算
    const { page, limit } = validatedQuery;
    const { offset } = calculatePagination(page, limit);

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

    // クエスト一覧を取得するクエリを構築
    let query = supabase
      .from('quests')
      .select('*', { count: 'exact' });

    // フィルタリング条件を適用
    if (validatedQuery.type) {
      query = query.eq('type', validatedQuery.type);
    }

    if (validatedQuery.difficulty) {
      query = query.eq('difficulty', validatedQuery.difficulty);
    }

    if (validatedQuery.isDaily !== undefined) {
      query = query.eq('isDaily', validatedQuery.isDaily);
    }

    if (validatedQuery.isWeekly !== undefined) {
      query = query.eq('isWeekly', validatedQuery.isWeekly);
    }

    if (validatedQuery.isActive !== undefined) {
      query = query.eq('isActive', validatedQuery.isActive);
    } else {
      // デフォルトではアクティブなクエストのみを表示
      query = query.eq('isActive', true);
    }

    if (validatedQuery.isHidden !== undefined) {
      query = query.eq('isHidden', validatedQuery.isHidden);
    } else {
      // デフォルトでは非表示のクエストは表示しない
      query = query.eq('isHidden', false);
    }

    if (validatedQuery.isPromoted !== undefined) {
      query = query.eq('isPromoted', validatedQuery.isPromoted);
    }

    if (validatedQuery.requiredLevel !== undefined) {
      query = query.lte('requiredLevel', validatedQuery.requiredLevel);
    }

    if (validatedQuery.category) {
      query = query.eq('category', validatedQuery.category);
    }

    if (validatedQuery.query) {
      query = query.or(`title.ilike.%${validatedQuery.query}%,description.ilike.%${validatedQuery.query}%`);
    }

    // 有効期限内のクエストのみを表示
    const now = new Date().toISOString();
    query = query.or(`validPeriod.is.null,and(validPeriod->startDate.lte.${now},validPeriod->endDate.gte.${now})`);

    // ページネーションを適用
    query = query.range(offset, offset + limit - 1);

    // クエストを取得
    const { data: quests, error: questsError, count } = await query;

    if (questsError) {
      throw new ApiError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'クエスト一覧の取得に失敗しました',
        questsError.message
      );
    }

    // ユーザーがログインしている場合、クエスト完了状況を取得
    let questCompletions: Record<string, any> = {};
    if (session) {
      const { data: completions, error: completionsError } = await supabase
        .from('quest_completions')
        .select('questId, completedAt, verificationStatus')
        .eq('userId', session.user.id);

      if (completionsError) {
        console.error('クエスト完了状況の取得に失敗しました:', completionsError);
      } else if (completions) {
        // クエストIDをキーとした完了状況のマップを作成
        questCompletions = createQuestCompletionMap(completions);
      }
    }

    // クエスト一覧にユーザーの完了状況を追加
    const questsWithCompletionStatus = addCompletionStatusToQuests(quests || [], questCompletions);

    // ページネーション情報を計算
    const totalCount = count || 0;
    const pagination = calculatePagination(page, limit, totalCount);

    // レスポンスを返す
    return createSuccessResponse({
      data: questsWithCompletionStatus || [],
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: pagination.totalPages,
      }
    });
  } catch (error: any) {
    const { error: apiError } = handleError(error, 'GET /api/quests');
    return createErrorResponse(apiError);
  }
}
