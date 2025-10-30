#!/bin/bash

# API Key Manager Setup Script
echo "🚀 Setting up API Key Manager..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "⚠️  Warning: Node.js version is $NODE_VERSION. Some features may require Node.js 18+."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating environment file..."
    cp env.example .env.local
    echo "✅ Environment file created. Please update .env.local with your configuration."
fi

# Create database directory
mkdir -p data

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your configuration"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000/api/init to initialize the database"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "Happy coding! 🎉"
