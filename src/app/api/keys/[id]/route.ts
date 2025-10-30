import { NextRequest, NextResponse } from 'next/server';
import { ApiKeyService } from '@/lib/api-key-service';
import { authenticateRequest } from '@/lib/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const keyId = parseInt(params.id);
    if (isNaN(keyId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid API key ID' },
        { status: 400 }
      );
    }

    const apiKey = await ApiKeyService.getApiKeyById(auth.user.id, keyId);
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, apiKey });

  } catch (error) {
    console.error('Get API key error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get API key' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const keyId = parseInt(params.id);
    if (isNaN(keyId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid API key ID' },
        { status: 400 }
      );
    }

    const deleted = await ApiKeyService.deleteApiKey(auth.user.id, keyId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'API key deleted' });

  } catch (error) {
    console.error('Delete API key error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}
