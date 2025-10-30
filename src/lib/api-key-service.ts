import { dbQuery } from './database';
import { EncryptionService } from './encryption';

export interface ApiKey {
  id: number;
  user_id: number;
  name: string;
  key_hash: string;
  encrypted_key: string;
  last_used?: string;
  usage_count: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateApiKeyRequest {
  name: string;
  expiresAt?: string;
}

export interface ApiKeyWithDecryptedKey extends Omit<ApiKey, 'encrypted_key'> {
  decrypted_key: string;
}

export class ApiKeyService {
  static async createApiKey(userId: number, request: CreateApiKeyRequest): Promise<ApiKeyWithDecryptedKey> {
    try {
      // Generate new API key
      const apiKey = EncryptionService.generateApiKey();
      const keyHash = EncryptionService.hashApiKey(apiKey);
      const encryptedKey = EncryptionService.encrypt(apiKey);

      // Save to database
      const result = await dbQuery.createApiKey(
        userId,
        request.name,
        keyHash,
        encryptedKey,
        request.expiresAt
      );

      const keyId = (result as any).lastID;

      return {
        id: keyId,
        user_id: userId,
        name: request.name,
        key_hash: keyHash,
        decrypted_key: apiKey,
        usage_count: 0,
        is_active: true,
        expires_at: request.expiresAt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Create API key error:', error);
      throw new Error('Failed to create API key');
    }
  }

  static async getApiKeys(userId: number): Promise<ApiKey[]> {
    try {
      const keys = await dbQuery.getApiKeysByUserId(userId) as any[];
      return keys.map(key => ({
        ...key,
        // Don't return the encrypted key for security
        encrypted_key: '[ENCRYPTED]'
      }));
    } catch (error) {
      console.error('Get API keys error:', error);
      throw new Error('Failed to get API keys');
    }
  }

  static async getApiKeyById(userId: number, keyId: number): Promise<ApiKey | null> {
    try {
      const key = await dbQuery.getApiKeyById(keyId, userId) as any;
      if (!key) return null;

      return {
        ...key,
        encrypted_key: '[ENCRYPTED]'
      };
    } catch (error) {
      console.error('Get API key error:', error);
      throw new Error('Failed to get API key');
    }
  }

  static async rotateApiKey(userId: number, keyId: number): Promise<ApiKeyWithDecryptedKey> {
    try {
      // Get existing key
      const existingKey = await dbQuery.getApiKeyById(keyId, userId) as any;
      if (!existingKey) {
        throw new Error('API key not found');
      }

      // Generate new API key
      const newApiKey = EncryptionService.generateApiKey();
      const newKeyHash = EncryptionService.hashApiKey(newApiKey);
      const newEncryptedKey = EncryptionService.encrypt(newApiKey);

      // Update in database
      await dbQuery.updateApiKey(keyId, userId, {
        key_hash: newKeyHash,
        encrypted_key: newEncryptedKey,
        usage_count: 0,
        last_used: null
      });

      return {
        id: keyId,
        user_id: userId,
        name: existingKey.name,
        key_hash: newKeyHash,
        decrypted_key: newApiKey,
        usage_count: 0,
        is_active: existingKey.is_active,
        expires_at: existingKey.expires_at,
        created_at: existingKey.created_at,
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Rotate API key error:', error);
      throw new Error('Failed to rotate API key');
    }
  }

  static async deleteApiKey(userId: number, keyId: number): Promise<boolean> {
    try {
      const result = await dbQuery.deleteApiKey(keyId, userId);
      return (result as any).changes > 0;
    } catch (error) {
      console.error('Delete API key error:', error);
      throw new Error('Failed to delete API key');
    }
  }

  static async toggleApiKeyStatus(userId: number, keyId: number, isActive: boolean): Promise<boolean> {
    try {
      await dbQuery.updateApiKey(keyId, userId, { is_active: isActive });
      return true;
    } catch (error) {
      console.error('Toggle API key status error:', error);
      throw new Error('Failed to update API key status');
    }
  }

  static async validateApiKey(apiKey: string): Promise<{ userId: number; keyId: number } | null> {
    try {
      const keyHash = EncryptionService.hashApiKey(apiKey);
      
      // Find key by hash
      const keys = await dbQuery.getApiKeysByUserId(0) as any[]; // Get all keys (this is a simplified approach)
      // In a real implementation, you'd want a more efficient lookup
      
      for (const key of keys) {
        if (key.key_hash === keyHash && key.is_active) {
          // Check expiration
          if (key.expires_at && new Date(key.expires_at) < new Date()) {
            return null;
          }
          return { userId: key.user_id, keyId: key.id };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Validate API key error:', error);
      return null;
    }
  }

  static async logKeyUsage(keyId: number, endpoint: string, method: string, ipAddress: string, userAgent: string, responseStatus: number, responseTime: number): Promise<void> {
    try {
      await dbQuery.logKeyUsage(keyId, endpoint, method, ipAddress, userAgent, responseStatus, responseTime);
    } catch (error) {
      console.error('Log key usage error:', error);
    }
  }

  static async getKeyUsageStats(userId: number, days: number = 30): Promise<any[]> {
    try {
      return await dbQuery.getKeyUsageStats(userId, days) as any[];
    } catch (error) {
      console.error('Get key usage stats error:', error);
      throw new Error('Failed to get usage statistics');
    }
  }
}
