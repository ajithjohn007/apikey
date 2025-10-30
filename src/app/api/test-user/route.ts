import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/database';
import { AuthService } from '@/lib/auth';

export async function POST() {
  try {
    // Create a test user
    const testUser = await AuthService.register('test@example.com', 'testpassword123', 'Test User');
    
    if (testUser.success) {
      return NextResponse.json({
        success: true,
        message: 'Test user created successfully',
        user: testUser.user
      });
    } else {
      return NextResponse.json({
        success: false,
        message: testUser.message
      });
    }
  } catch (error) {
    console.error('Test user creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create test user' },
      { status: 500 }
    );
  }
}
