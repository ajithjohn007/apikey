import { NextRequest, NextResponse } from 'next/server';
import { ApiKeyService } from '@/lib/api-key-service';
import { authenticateRequest } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const keys = await ApiKeyService.getApiKeys(auth.user.id);
    return NextResponse.json({ success: true, keys });

  } catch (error) {
    console.error('Get API keys error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get API keys' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { name, expiresAt } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'API key name is required' },
        { status: 400 }
      );
    }

    const apiKey = await ApiKeyService.createApiKey(auth.user.id, {
      name,
      expiresAt
    });

    return NextResponse.json({ success: true, apiKey });

  } catch (error) {
    console.error('Create API key error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create API key' },
      { status: 500 }
    );
  }
}
