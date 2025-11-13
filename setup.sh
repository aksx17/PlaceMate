#!/bin/bash

# PlaceMate Setup Script
# This script automates the setup process for PlaceMate

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════╗"
echo "║     PlaceMate Setup Script v1.0          ║"
echo "║  AI-Powered Placement Companion          ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

# Check if Node.js is installed
print_info "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) is installed"

# Check if MongoDB is available (optional)
if command -v mongod &> /dev/null; then
    print_success "MongoDB is installed locally"
else
    print_warning "MongoDB not found locally. You'll need to use MongoDB Atlas."
fi

# Install dependencies
print_info "Installing dependencies (this may take a few minutes)..."
npm install

print_info "Installing backend dependencies..."
cd backend && npm install && cd ..

print_info "Installing frontend dependencies..."
cd frontend && npm install && cd ..

print_success "All dependencies installed successfully!"

# Setup environment files
print_info "Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    print_success "Created backend/.env file"
    print_warning "IMPORTANT: Edit backend/.env and add your API keys!"
    echo ""
    echo "Required API keys:"
    echo "  1. GEMINI_API_KEY - Get from https://makersuite.google.com/app/apikey"
    echo "  2. GITHUB_TOKEN - Get from GitHub Settings → Developer settings → Tokens"
    echo "  3. MONGODB_URI - Use local MongoDB or MongoDB Atlas"
    echo ""
else
    print_info "backend/.env already exists"
fi

if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    print_success "Created frontend/.env file"
else
    print_info "frontend/.env already exists"
fi

# Create temp directory for PDFs
mkdir -p backend/temp
print_success "Created temp directory for PDFs"

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          Setup Complete! 🎉               ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
echo ""

print_info "Next Steps:"
echo ""
echo "1. Edit backend/.env and add your API keys:"
echo -e "   ${YELLOW}nano backend/.env${NC}"
echo ""
echo "2. Start MongoDB (if using local):"
echo -e "   ${YELLOW}sudo systemctl start mongodb${NC}"
echo ""
echo "3. Run the application:"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "4. Open your browser:"
echo -e "   ${YELLOW}http://localhost:3000${NC}"
echo ""

print_warning "Don't forget to add your API keys in backend/.env before running!"

echo ""
echo -e "${BLUE}For detailed setup instructions, see SETUP_GUIDE.md${NC}"
echo -e "${BLUE}For quick start guide, see QUICK_START.md${NC}"
echo ""
