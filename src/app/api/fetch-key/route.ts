import { NextRequest, NextResponse } from 'next/server';
import { ApiKeyService } from '@/lib/api-key-service';

export async function POST(request: NextRequest) {
  try {
    const { apiKey, service } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'API key is required' },
        { status: 400 }
      );
    }

    // Validate API key
    const validation = await ApiKeyService.validateApiKey(apiKey);
    if (!validation) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired API key' },
        { status: 401 }
      );
    }

    // Log usage
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await ApiKeyService.logKeyUsage(
      validation.keyId,
      '/api/fetch-key',
      'POST',
      ipAddress,
      userAgent,
      200,
      Date.now()
    );

    // In a real implementation, you would fetch the actual key from the database
    // and return it. For security, we'll return a placeholder
    return NextResponse.json({
      success: true,
      message: 'API key validated successfully',
      service: service || 'default'
    });

  } catch (error) {
    console.error('Fetch key error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch key' },
      { status: 500 }
    );
  }
}
