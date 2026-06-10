#!/bin/bash

# Simple EC2 Deployment Script for Rahva Raamat Documentation
# This script handles basic deployment without complex configurations

set -e

echo "🚀 Simple EC2 Deployment for Rahva Raamat Documentation"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install required packages
print_status "Installing required packages..."
apt install -y curl git nginx nodejs npm

# Install Node.js 18+ if needed
if ! command -v node &> /dev/null || [ "$(node --version | cut -d'v' -f2 | cut -d'.' -f1)" -lt 18 ]; then
    print_status "Installing Node.js 18+..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi

# Create deployment directory
print_status "Creating deployment directory..."
mkdir -p /var/www/rahva-raamat-docs

# Clone repository
print_status "Cloning repository..."
cd /var/www/rahva-raamat-docs
git clone https://github.com/vibhanshuGaincafe/gaincafe-project-documentatin.git
cd gaincafe-project-documentatin

# Install dependencies and build
print_status "Installing dependencies and building..."
npm ci --production
npm run build

# Configure Nginx
print_status "Configuring Nginx..."
cat > /etc/nginx/sites-available/rahva-raamat-docs << 'EOF'
server {
    listen 80;
    server_name _;

    root /var/www/rahva-raamat-docs/gaincafe-project-documentatin/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/rahva-raamat-docs /etc/nginx/sites-enabled/

# Test and restart Nginx
print_status "Testing and restarting Nginx..."
nginx -t
systemctl restart nginx
systemctl enable nginx

# Set permissions
print_status "Setting permissions..."
chown -R www-data:www-data /var/www/rahva-raamat-docs
chmod -R 755 /var/www/rahva-raamat-docs

# Create update script
print_status "Creating update script..."
cat > /usr/local/bin/update-docs << 'EOF'
#!/bin/bash
cd /var/www/rahva-raamat-docs/gaincafe-project-documentatin
git pull origin main
npm ci --production
npm run build
systemctl reload nginx
echo "Documentation updated successfully!"
EOF

chmod +x /usr/local/bin/update-docs

print_status "✅ Deployment completed successfully!"
print_status "📖 Documentation is now available at: http://your-ec2-ip"
print_status "🔄 To update: run 'sudo update-docs'"
print_status "📁 Build files are in: /var/www/rahva-raamat-docs/gaincafe-project-documentatin/build" 