import { NextRequest } from 'next/server';
import { AuthService } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: number;
    email: string;
    name?: string;
  };
}

export function authenticateRequest(request: NextRequest): { user: any } | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = AuthService.verifyToken(token);

    if (!decoded) {
      return null;
    }

    return { user: { id: decoded.userId } };
  } catch (error) {
    return null;
  }
}

export function createAuthenticatedResponse(data: any, status: number = 200) {
  return Response.json(data, { status });
}

export function createErrorResponse(message: string, status: number = 400) {
  return Response.json({ success: false, message }, { status });
}
