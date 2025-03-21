import { NextRequest, NextResponse } from 'next/server';
import { telegramAuth } from '@shout2/api';

export async function POST(request: NextRequest) {
  try {
    const { initData } = await request.json();

    if (!initData) {
      return NextResponse.json(
        { error: { message: 'Telegram initData is required' } },
        { status: 400 }
      );
    }

    const result = await telegramAuth(initData);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error.status || 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Telegram auth error:', error);
    return NextResponse.json(
      { error: { message: error.message || 'Authentication failed' } },
      { status: 500 }
    );
  }
}
