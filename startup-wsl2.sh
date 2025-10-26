#!/bin/bash

# Cactoide WSL2 Startup Script
# This script starts the development environment for Cactoide on WSL2

set -e  # Exit on error

echo "========================================="
echo "Cactoide WSL2 Startup Script"
echo "========================================="
echo ""

# Step 1: Check if .env exists
echo "[1/5] Checking environment configuration..."
if [ ! -f .env ]; then
    echo "❌ .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✓ Created .env file. Please verify DATABASE_URL uses localhost:5432"
else
    echo "✓ .env file exists"
fi
echo ""

# Step 2: Check if native PostgreSQL is running on port 5432
echo "[2/5] Checking for port conflicts..."
if sudo lsof -i :5432 > /dev/null 2>&1; then
    echo "⚠️  Port 5432 is in use. Checking if it's native PostgreSQL..."
    if sudo lsof -i :5432 | grep -q postgres; then
        echo "   Stopping native PostgreSQL service..."
        sudo service postgresql stop
        echo "✓ Native PostgreSQL stopped"
    else
        echo "❌ Port 5432 is used by another process:"
        sudo lsof -i :5432
        echo ""
        echo "Please stop the process or change POSTGRES_PORT in .env"
        exit 1
    fi
else
    echo "✓ Port 5432 is available"
fi
echo ""

# Step 3: Start PostgreSQL container
echo "[3/5] Starting PostgreSQL container..."
if docker ps | grep -q cactoide-db; then
    echo "✓ cactoide-db is already running"
else
    make db-only
    echo "✓ PostgreSQL container started"
fi
echo ""

# Step 4: Check if schema needs to be applied
echo "[4/5] Checking database schema..."
if docker exec cactoide-db psql -U cactoide -d cactoide_database -c '\dt' 2>/dev/null | grep -q events; then
    echo "✓ Database schema already applied"
else
    echo "   Applying database schema..."
    npx drizzle-kit push
    echo "✓ Database schema applied"
fi
echo ""

# # Step 5: Start dev server
# echo "[5/5] Starting development server..."
# echo "========================================="
# echo "✓ Setup complete!"
# echo "========================================="
# echo ""
# echo "Starting dev server at http://localhost:5173"
# echo "Press Ctrl+C to stop"
# echo ""

# npm run dev
