# 🔐 API Key Manager

> A production-ready, enterprise-grade API key management system with advanced security features and comprehensive analytics.

[![Next.js](https://img.shields.io/badge/Next.js-13-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

## 📖 Overview

API Key Manager is a comprehensive full-stack solution for managing API keys with enterprise-level security. Built with modern web technologies, it provides secure storage, instant rotation, detailed analytics, and robust authentication—all wrapped in an intuitive, responsive interface.

### 🎯 Why API Key Manager?

- **Security First**: AES-256 encryption, secure headers, and comprehensive audit logging
- **Zero Downtime**: Instant key rotation without service interruption
- **Developer Friendly**: Clean APIs, comprehensive documentation, and easy integration
- **Production Ready**: Built with scalability, performance, and security best practices

## ✨ Features

### 🔒 Security & Authentication
- **AES-256 Encryption** - Military-grade encryption for API keys at rest
- **JWT Authentication** - Secure token-based user authentication
- **Rate Limiting** - Configurable rate limiting to prevent abuse
- **Audit Logging** - Complete audit trail for compliance and monitoring
- **Input Validation** - Comprehensive server-side validation and sanitization

### 🚀 Key Management
- **Instant Rotation** - Rotate keys with zero downtime
- **Expiration Control** - Set custom expiration dates for keys
- **Usage Tracking** - Monitor key usage patterns and performance
- **Bulk Operations** - Manage multiple keys efficiently
- **Status Control** - Enable/disable keys without deletion

### 📊 Analytics & Monitoring
- **Real-time Dashboard** - Live usage statistics and key health
- **Interactive Charts** - Visual analytics with Recharts
- **Performance Metrics** - Response times and usage patterns
- **Historical Data** - Track usage trends over time
- **Export Capabilities** - Export data for external analysis

### 🎨 User Experience
- **Modern Interface** - Clean, intuitive design with Tailwind CSS
- **Mobile Responsive** - Seamless experience across all devices
- **Dark/Light Mode** - Customizable theme preferences
- **Real-time Updates** - Live data updates without page refresh

## 🛠️ Technology Stack

### Frontend
- **[Next.js 13](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://reactjs.org/)** - Modern React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful, customizable icons

### Backend
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Serverless API endpoints
- **[SQLite](https://www.sqlite.org/)** - Lightweight, embedded database
- **[JWT](https://jwt.io/)** - JSON Web Tokens for authentication
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Password hashing

### Security & Utilities
- **[CryptoJS](https://cryptojs.gitbook.io/)** - Cryptographic functions
- **[Helmet.js](https://helmetjs.github.io/)** - Security headers
- **[CORS](https://github.com/expressjs/cors)** - Cross-origin resource sharing
- **[Recharts](https://recharts.org/)** - Composable charting library

## � IQuick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/api-key-manager.git
   cd api-key-manager
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env.local
   ```
   
   Configure your environment variables in `.env.local`:
   ```env
   # Database Configuration
   DATABASE_URL="file:./dev.db"
   
   # Authentication Settings
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-nextauth-key-min-32-chars"
   
   # JWT Configuration
   JWT_SECRET="your-jwt-secret-key-should-be-very-long-and-random"
   
   # Encryption Key (32 characters)
   ENCRYPTION_KEY="your-32-character-encryption-key!!"
   ```

4. **Database Initialization**
   ```bash
   # Start the development server
   npm run dev
   
   # In a new terminal, initialize the database
   curl -X POST http://localhost:3000/api/init
   ```

5. **Launch Application**
   ```bash
   npm run dev
   ```
   
   🎉 **Success!** Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📱 Usage

### Getting Started

1. **Register an Account**
   - Navigate to `/register`
   - Create your account with email and password

2. **Create Your First API Key**
   - Go to the Dashboard
   - Click "Create New Key"
   - Set a name and optional expiration date

3. **Use Your API Key**
   ```bash
   curl -X POST http://localhost:3000/api/fetch-key \
     -H "Content-Type: application/json" \
     -d '{"apiKey": "your-generated-key"}'
   ```

### Key Management Workflow

```mermaid
graph LR
    A[Create Key] --> B[Use Key]
    B --> C[Monitor Usage]
    C --> D{Key Compromised?}
    D -->|Yes| E[Rotate Key]
    D -->|No| F[Continue Monitoring]
    E --> B
    F --> C
```

## � APPI Documentation

### 🔐 Authentication Endpoints

<details>
<summary><strong>POST</strong> <code>/api/auth/register</code> - Register New User</summary>

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```
</details>

<details>
<summary><strong>POST</strong> <code>/api/auth/login</code> - User Login</summary>

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```
</details>

<details>
<summary><strong>GET</strong> <code>/api/auth/me</code> - Get Current User</summary>

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```
</details>

### 🔑 API Key Management

<details>
<summary><strong>POST</strong> <code>/api/keys</code> - Create API Key</summary>

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Production API Key",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "apiKey": {
    "id": 1,
    "name": "Production API Key",
    "decrypted_key": "ak_live_1234567890abcdef...",
    "created_at": "2024-01-15T10:30:00Z",
    "expires_at": "2024-12-31T23:59:59Z"
  }
}
```
</details>

<details>
<summary><strong>GET</strong> <code>/api/keys</code> - List All API Keys</summary>

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "keys": [
    {
      "id": 1,
      "name": "Production API Key",
      "usage_count": 1250,
      "is_active": true,
      "last_used": "2024-01-15T14:30:00Z",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```
</details>

<details>
<summary><strong>POST</strong> <code>/api/keys/{id}/rotate</code> - Rotate API Key</summary>

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "apiKey": {
    "id": 1,
    "name": "Production API Key",
    "decrypted_key": "ak_live_new1234567890abcdef...",
    "usage_count": 0,
    "rotated_at": "2024-01-15T15:00:00Z"
  }
}
```
</details>

### 📊 Analytics & Monitoring

<details>
<summary><strong>GET</strong> <code>/api/analytics</code> - Usage Analytics</summary>

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `days` (optional): Number of days to analyze (default: 30)
- `keyId` (optional): Specific key ID to analyze

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalRequests": 15420,
    "uniqueKeys": 5,
    "averageResponseTime": 145,
    "dailyUsage": [
      {"date": "2024-01-15", "requests": 1250, "responseTime": 142},
      {"date": "2024-01-14", "requests": 1180, "responseTime": 138}
    ]
  }
}
```
</details>

### 🌐 External Key Validation

<details>
<summary><strong>POST</strong> <code>/api/fetch-key</code> - Validate & Use API Key</summary>

**Request Body:**
```json
{
  "apiKey": "ak_live_1234567890abcdef...",
  "service": "payment-processor",
  "metadata": {
    "userAgent": "MyApp/1.0",
    "ipAddress": "192.168.1.1"
  }
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "keyInfo": {
    "name": "Production API Key",
    "usage_count": 1251,
    "rate_limit_remaining": 4999
  }
}
```
</details>

## 🏗️ Project Architecture

### Directory Structure

```
api-key-manager/
├── 📁 src/
│   ├── 📁 app/                     # Next.js 13 App Router
│   │   ├── 📁 api/                 # API Routes
│   │   │   ├── 📁 auth/            # Authentication endpoints
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── register/route.ts
│   │   │   │   └── me/route.ts
│   │   │   ├── 📁 keys/            # API key management
│   │   │   │   ├── route.ts        # CRUD operations
│   │   │   │   └── [id]/           # Individual key operations
│   │   │   ├── 📁 analytics/       # Usage analytics
│   │   │   ├── 📁 fetch-key/       # External validation
│   │   │   └── 📁 init/            # Database initialization
│   │   ├── 📁 dashboard/           # Main dashboard
│   │   ├── 📁 analytics/           # Analytics page
│   │   ├── 📁 login/               # Authentication pages
│   │   ├── 📁 register/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home page
│   │   └── globals.css             # Global styles
│   ├── 📁 lib/                     # Core utilities
│   │   ├── auth.ts                 # Authentication service
│   │   ├── database.ts             # Database operations
│   │   ├── encryption.ts           # Cryptographic functions
│   │   ├── api-key-service.ts      # Business logic
│   │   ├── middleware.ts           # Request middleware
│   │   └── rate-limit.ts           # Rate limiting
│   └── 📁 components/              # Reusable UI components
│       ├── ui/                     # Base UI components
│       ├── dashboard/              # Dashboard-specific
│       └── auth/                   # Authentication forms
├── 📁 scripts/                     # Utility scripts
├── 📄 package.json                 # Dependencies & scripts
├── 📄 tsconfig.json               # TypeScript configuration
├── 📄 tailwind.config.js          # Tailwind CSS config
├── 📄 next.config.js              # Next.js configuration
└── 📄 .env.local                  # Environment variables
```

### Core Components

#### 🔐 Authentication Layer
- **JWT-based authentication** with secure token management
- **Password hashing** using bcrypt with salt rounds
- **Session management** with automatic token refresh

#### 🗄️ Database Layer
- **SQLite** for development with easy PostgreSQL migration
- **Parameterized queries** to prevent SQL injection
- **Connection pooling** for optimal performance

#### 🔒 Security Layer
- **AES-256 encryption** for sensitive data
- **Rate limiting** with configurable thresholds
- **Input validation** and sanitization
- **Security headers** via Helmet.js

#### 📊 Analytics Engine
- **Real-time usage tracking** with performance metrics
- **Historical data analysis** with trend identification
- **Interactive visualizations** using Recharts

## 🔒 Security Implementation

### 🛡️ Encryption & Cryptography
| Feature | Implementation | Details |
|---------|---------------|---------|
| **API Key Encryption** | AES-256-CBC | Military-grade encryption for keys at rest |
| **Key Generation** | Crypto.randomBytes() | Cryptographically secure random generation |
| **Password Hashing** | bcrypt (12 rounds) | Industry-standard password protection |
| **Key Validation** | SHA-256 Hashing | Fast, secure key lookup and validation |

### 🔐 Authentication & Authorization
- **JWT Tokens** - Stateless authentication with configurable expiration
- **Secure Headers** - Comprehensive security headers via Helmet.js
- **CORS Protection** - Configurable cross-origin resource sharing
- **Session Management** - Automatic token refresh and secure logout

### 🚦 Rate Limiting & Protection
```typescript
// Configurable rate limits per endpoint
const rateLimits = {
  auth: { windowMs: 15 * 60 * 1000, max: 5 },      // 5 attempts per 15min
  keys: { windowMs: 60 * 1000, max: 100 },         // 100 requests per minute
  analytics: { windowMs: 60 * 1000, max: 50 }      // 50 requests per minute
}
```

### 🔍 Input Validation & Sanitization
- **TypeScript** - Compile-time type safety
- **Runtime Validation** - Server-side input validation
- **SQL Injection Prevention** - Parameterized queries only
- **XSS Protection** - Input sanitization and output encoding

## 📊 Analytics & Monitoring

### 📈 Real-time Metrics
- **Usage Patterns** - Track API key usage across time periods
- **Performance Monitoring** - Response times and error rates
- **Geographic Analysis** - Usage by location and IP ranges
- **Trend Analysis** - Historical data with predictive insights

### 📋 Audit & Compliance
- **Complete Audit Trail** - Every action logged with timestamps
- **User Activity Tracking** - Login attempts, key operations
- **Security Events** - Failed authentications, suspicious activity
- **Export Capabilities** - CSV/JSON export for compliance reporting

### 🎯 Key Performance Indicators
```typescript
interface AnalyticsMetrics {
  totalRequests: number;
  uniqueKeys: number;
  averageResponseTime: number;
  errorRate: number;
  topEndpoints: EndpointUsage[];
  dailyUsage: DailyMetrics[];
}
```

## 🚀 Production Deployment

### 🌐 Deployment Platforms

<details>
<summary><strong>Vercel</strong> (Recommended)</summary>

1. **Connect Repository**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

2. **Environment Variables**
   Set in Vercel dashboard or via CLI:
   ```bash
   vercel env add DATABASE_URL
   vercel env add JWT_SECRET
   vercel env add ENCRYPTION_KEY
   ```

3. **Database Setup**
   - Use Vercel Postgres or external PostgreSQL
   - Update `DATABASE_URL` in environment variables
</details>

<details>
<summary><strong>Docker Deployment</strong></summary>

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t api-key-manager .
docker run -p 3000:3000 --env-file .env.production api-key-manager
```
</details>

### 🔧 Production Configuration

#### Environment Variables
```env
# Production Database (PostgreSQL recommended)
DATABASE_URL="postgresql://user:password@host:5432/database"

# Security Keys (Generate strong, unique values)
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-super-secure-nextauth-secret-min-32-chars"
JWT_SECRET="your-jwt-secret-should-be-very-long-and-random-string"
ENCRYPTION_KEY="your-32-character-encryption-key!!"

# Optional: External Services
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

#### Database Migration
```bash
# For PostgreSQL production setup
npm install pg @types/pg
# Update src/lib/database.ts for PostgreSQL
# Run migration scripts
```

### 🔒 Production Security Checklist

- [ ] **HTTPS Enabled** - SSL/TLS certificates configured
- [ ] **Environment Variables** - All secrets properly configured
- [ ] **Database Security** - Connection encryption enabled
- [ ] **Rate Limiting** - Production-appropriate limits set
- [ ] **CORS Policy** - Restricted to allowed origins
- [ ] **Security Headers** - All security headers enabled
- [ ] **Monitoring** - Error tracking and performance monitoring
- [ ] **Backups** - Automated database backups configured

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Development Setup
1. **Fork & Clone**
   ```bash
   git clone https://github.com/yourusername/api-key-manager.git
   cd api-key-manager
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Follow TypeScript best practices
   - Add tests for new features
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   npm run lint
   npm run build
   npm run dev # Test locally
   ```

5. **Submit Pull Request**
   ```bash
   git commit -m 'feat: add amazing feature'
   git push origin feature/amazing-feature
   ```

### 📋 Development Guidelines
- **Code Style**: Follow existing patterns and ESLint rules
- **Commits**: Use conventional commit messages
- **Testing**: Add tests for new functionality
- **Documentation**: Update README and inline docs

## 🔮 Roadmap

### 🎯 Short Term (Q1 2024)
- [ ] **OAuth Integration** - Google, GitHub, Microsoft authentication
- [ ] **Team Management** - Multi-user organizations and permissions
- [ ] **Advanced Analytics** - Custom dashboards and reports
- [ ] **API Rate Limiting** - Per-key rate limiting configuration

### 🚀 Medium Term (Q2-Q3 2024)
- [ ] **Webhook Support** - Real-time notifications for key events
- [ ] **CLI Tool** - Command-line interface for key management
- [ ] **Mobile App** - React Native mobile application
- [ ] **Advanced Security** - 2FA, IP whitelisting, geo-restrictions

### 🌟 Long Term (Q4 2024+)
- [ ] **Kubernetes Operator** - Native Kubernetes integration
- [ ] **Multi-Cloud Support** - AWS, GCP, Azure integrations
- [ ] **Enterprise Features** - SSO, LDAP, advanced compliance
- [ ] **API Gateway** - Built-in API gateway functionality

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - Feel free to use this project for personal or commercial purposes.
```

## 🆘 Support & Community

### 📞 Get Help
- **📧 Email**: [support@api-key-manager.com](mailto:support@api-key-manager.com)
- **💬 Discord**: [Join our community](https://discord.gg/api-key-manager)
- **🐛 Issues**: [GitHub Issues](https://github.com/yourusername/api-key-manager/issues)
- **📖 Docs**: [Full Documentation](https://docs.api-key-manager.com)

### 🌟 Show Your Support
If this project helped you, please consider:
- ⭐ **Star this repository**
- 🐦 **Share on Twitter**
- 📝 **Write a blog post**
- 💝 **Sponsor the project**

---

<div align="center">

**Built with ❤️ by developers, for developers**

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>
