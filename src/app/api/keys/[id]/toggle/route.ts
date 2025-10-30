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

    const { isActive } = await request.json();
    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'isActive must be a boolean' },
        { status: 400 }
      );
    }

    const success = await ApiKeyService.toggleApiKeyStatus(auth.user.id, keyId, isActive);
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Failed to update API key status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: `API key ${isActive ? 'activated' : 'deactivated'}` 
    });

  } catch (error) {
    console.error('Toggle API key status error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update API key status' },
      { status: 500 }
    );
  }
}
