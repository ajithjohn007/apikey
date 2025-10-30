import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbQuery } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-here';

export interface User {
  id: number;
  email: string;
  name?: string;
  created_at: string;
  is_active: boolean;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  static generateToken(userId: number): string {
    return jwt.sign(
      { userId, iat: Math.floor(Date.now() / 1000) },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  static verifyToken(token: string): { userId: number } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return { userId: decoded.userId };
    } catch (error) {
      return null;
    }
  }

  static async register(email: string, password: string, name?: string): Promise<AuthResult> {
    try {
      // Check if user already exists
      const existingUser = await dbQuery.getUserByEmail(email);
      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      }

      // Hash password
      const passwordHash = await this.hashPassword(password);

      // Create user
      const result = await dbQuery.createUser(email, passwordHash, name);
      const userId = (result as any).lastID;

      // Generate token
      const token = this.generateToken(userId);

      return {
        success: true,
        user: {
          id: userId,
          email,
          name,
          created_at: new Date().toISOString(),
          is_active: true
        },
        token
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed'
      };
    }
  }

  static async login(email: string, password: string): Promise<AuthResult> {
    try {
      // Get user by email
      const user = await dbQuery.getUserByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Check if user is active
      if (!(user as any).is_active) {
        return {
          success: false,
          message: 'Account is deactivated'
        };
      }

      // Verify password
      const isValidPassword = await this.comparePassword(password, (user as any).password_hash);
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Generate token
      const token = this.generateToken((user as any).id);

      return {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          name: (user as any).name,
          created_at: (user as any).created_at,
          is_active: (user as any).is_active
        },
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed'
      };
    }
  }

  static async getUserById(userId: number): Promise<User | null> {
    try {
      const user = await dbQuery.getUserById(userId);
      if (!user) return null;

      return {
        id: (user as any).id,
        email: (user as any).email,
        name: (user as any).name,
        created_at: (user as any).created_at,
        is_active: (user as any).is_active
      };
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }
}
