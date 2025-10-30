import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

const dbPath = path.join(process.cwd(), 'dev.db');

// Create database connection
const db = new sqlite3.Database(dbPath);

// Promisify database methods
const dbRun = (sql: string, params?: any[]) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params || [], function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbGet = (sql: string, params?: any[]) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params || [], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql: string, params?: any[]) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params || [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize database tables
export const initDatabase = async () => {
  try {
    // Users table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1
      )
    `);

    // API Keys table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        key_hash TEXT NOT NULL,
        encrypted_key TEXT NOT NULL,
        last_used DATETIME,
        usage_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Key usage analytics table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS key_usage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        api_key_id INTEGER NOT NULL,
        endpoint TEXT,
        method TEXT,
        ip_address TEXT,
        user_agent TEXT,
        response_status INTEGER,
        response_time INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (api_key_id) REFERENCES api_keys (id) ON DELETE CASCADE
      )
    `);

    // Security alerts table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS security_alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        api_key_id INTEGER,
        alert_type TEXT NOT NULL,
        message TEXT NOT NULL,
        severity TEXT DEFAULT 'medium',
        is_resolved BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (api_key_id) REFERENCES api_keys (id) ON DELETE CASCADE
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Database query helpers
export const dbQuery = {
  // User operations
  createUser: async (email: string, passwordHash: string, name?: string) => {
    const result = await dbRun(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
      [email, passwordHash, name || null]
    );
    return result;
  },

  getUserByEmail: async (email: string) => {
    return await dbGet('SELECT * FROM users WHERE email = ?', [email]);
  },

  getUserById: async (id: number) => {
    return await dbGet('SELECT * FROM users WHERE id = ?', [id]);
  },

  // API Key operations
  createApiKey: async (userId: number, name: string, keyHash: string, encryptedKey: string, expiresAt?: string) => {
    const result = await dbRun(
      'INSERT INTO api_keys (user_id, name, key_hash, encrypted_key, expires_at) VALUES (?, ?, ?, ?, ?)',
      [userId, name, keyHash, encryptedKey, expiresAt]
    );
    return result;
  },

  getApiKeysByUserId: async (userId: number) => {
    return await dbAll(
      'SELECT * FROM api_keys WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
  },

  getApiKeyById: async (id: number, userId: number) => {
    return await dbGet(
      'SELECT * FROM api_keys WHERE id = ? AND user_id = ?',
      [id, userId]
    );
  },

  updateApiKey: async (id: number, userId: number, updates: any) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id, userId);
    
    return await dbRun(
      `UPDATE api_keys SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
      values
    );
  },

  deleteApiKey: async (id: number, userId: number) => {
    return await dbRun(
      'DELETE FROM api_keys WHERE id = ? AND user_id = ?',
      [id, userId]
    );
  },

  // Usage analytics
  logKeyUsage: async (apiKeyId: number, endpoint: string, method: string, ipAddress: string, userAgent: string, responseStatus: number, responseTime: number) => {
    await dbRun(
      'INSERT INTO key_usage (api_key_id, endpoint, method, ip_address, user_agent, response_status, response_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [apiKeyId, endpoint, method, ipAddress, userAgent, responseStatus, responseTime]
    );
    
    // Update usage count
    await dbRun(
      'UPDATE api_keys SET usage_count = usage_count + 1, last_used = CURRENT_TIMESTAMP WHERE id = ?',
      [apiKeyId]
    );
  },

  getKeyUsageStats: async (userId: number, days: number = 30) => {
    return await dbAll(`
      SELECT 
        ak.id,
        ak.name,
        ak.usage_count,
        ak.last_used,
        COUNT(ku.id) as recent_usage,
        AVG(ku.response_time) as avg_response_time
      FROM api_keys ak
      LEFT JOIN key_usage ku ON ak.id = ku.api_key_id 
        AND ku.created_at >= datetime('now', '-${days} days')
      WHERE ak.user_id = ?
      GROUP BY ak.id, ak.name, ak.usage_count, ak.last_used
      ORDER BY ak.created_at DESC
    `, [userId]);
  },

  // Security alerts
  createSecurityAlert: async (userId: number, alertType: string, message: string, severity: string = 'medium', apiKeyId?: number) => {
    return await dbRun(
      'INSERT INTO security_alerts (user_id, api_key_id, alert_type, message, severity) VALUES (?, ?, ?, ?, ?)',
      [userId, apiKeyId, alertType, message, severity]
    );
  },

  getSecurityAlerts: async (userId: number, limit: number = 50) => {
    return await dbAll(`
      SELECT sa.*, ak.name as api_key_name
      FROM security_alerts sa
      LEFT JOIN api_keys ak ON sa.api_key_id = ak.id
      WHERE sa.user_id = ?
      ORDER BY sa.created_at DESC
      LIMIT ?
    `, [userId, limit]);
  },

  resolveSecurityAlert: async (alertId: number, userId: number) => {
    return await dbRun(
      'UPDATE security_alerts SET is_resolved = 1 WHERE id = ? AND user_id = ?',
      [alertId, userId]
    );
  }
};

export default db;
