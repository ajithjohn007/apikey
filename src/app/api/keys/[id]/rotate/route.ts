import { NextRequest, NextResponse } from 'next/server';
import { ApiKeyService } from '@/lib/api-key-service';
import { authenticateRequest } from '@/lib/middleware';

export async function POST(
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

    const apiKey = await ApiKeyService.rotateApiKey(auth.user.id, keyId);
    return NextResponse.json({ success: true, apiKey });

  } catch (error) {
    console.error('Rotate API key error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to rotate API key' },
      { status: 500 }
    );
  }
}
