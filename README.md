# Rahva Raamat Documentation

Comprehensive developer documentation for **Rahva Raamat**, Estonia's largest bookstore chain and digital content provider. This documentation covers the complete e-commerce backend system that powers their hybrid retail platform.

## 🚀 Quick Start


# test
### Local Development (Windows)

1. **Install Dependencies:**
   ```powershell
   .\dev-start.ps1 -Install
   ```

2. **Start Development Server:**
   ```powershell
   .\dev-start.ps1 -Start
   ```

3. **Build for Production:**
   ```powershell
   .\dev-start.ps1 -Build
   ```

4. **Clean Build Files:**
   ```powershell
   .\dev-start.ps1 -Clean
   ```

### Manual Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Serve production build locally
npm run serve
```

## 🌐 EC2 Ubuntu Deployment

### Prerequisites

- Ubuntu 20.04+ EC2 instance
- Root access or sudo privileges
- Domain name (optional, for SSL)

### Automated Deployment

1. **Upload the deployment script to your EC2 instance:**
   ```bash
   scp -i your-key.pem deploy.sh ubuntu@your-ec2-ip:/home/ubuntu/
   ```

2. **SSH into your EC2 instance:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Run the deployment script:**
   ```bash
   sudo bash deploy.sh
   ```

### Manual Deployment Steps

1. **Update system and install dependencies:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y curl git nginx nodejs npm
   ```

2. **Install Node.js 18+:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

3. **Clone the repository:**
   ```bash
   sudo mkdir -p /var/www/rahva-raamat-docs
   cd /var/www/rahva-raamat-docs
   sudo git clone https://github.com/your-username/rahva-raamat-docs.git gaincafe-docs
   cd gaincafe-docs
   ```

4. **Install dependencies and build:**
   ```bash
   sudo npm ci --production
   sudo npm run build
   ```

5. **Configure Nginx:**
   ```bash
   sudo nano /etc/nginx/sites-available/rahva-raamat-docs
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;  # Replace with your domain

       root /var/www/rahva-raamat-docs/gaincafe-docs/build;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

6. **Enable the site and restart Nginx:**
   ```bash
   sudo ln -sf /etc/nginx/sites-available/rahva-raamat-docs /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   sudo systemctl enable nginx
   ```

7. **Set proper permissions:**
   ```bash
   sudo chown -R www-data:www-data /var/www/rahva-raamat-docs
   sudo chmod -R 755 /var/www/rahva-raamat-docs
   ```

### Updating the Documentation

#### Local Development Workflow

1. **Make changes locally:**
   ```powershell
   .\dev-start.ps1 -Start
   ```

2. **Test your changes:**
   - Open http://localhost:3000
   - Verify all links work correctly

3. **Build and test production build:**
   ```powershell
   .\dev-start.ps1 -Build
   npm run serve
   ```

4. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Update documentation"
   git push origin main
   ```

#### Server Update Workflow

1. **SSH into your EC2 instance:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

2. **Update the documentation:**
   ```bash
   cd /var/www/rahva-raamat-docs/gaincafe-docs
   sudo git pull origin main
   sudo npm ci --production
   sudo npm run build
   sudo systemctl reload nginx
   ```

### SSL Setup (Optional)

1. **Install Certbot:**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. **Get SSL certificate:**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. **Auto-renewal (recommended):**
   ```bash
   sudo crontab -e
   ```
   Add this line:
   ```
   0 12 * * * /usr/bin/certbot renew --quiet
   ```

## 📁 Project Structure

```
gaincafe-project-documentatin/
├── docs/                          # Documentation files
│   ├── intro.md                   # Main introduction
│   ├── setup-guide/              # Environment setup
│   ├── core/                      # Core models
│   ├── reference/                 # API documentation
│   ├── authentication/            # Security docs
│   ├── deployment/                # Deployment guides
│   ├── monitoring/                # Monitoring & logging
│   ├── faq/                      # FAQ & troubleshooting
│   └── hotline-and-oidc/         # Hotline & OIDC docs
├── src/                          # Source files
├── static/                       # Static assets
├── docusaurus.config.js          # Docusaurus configuration
├── sidebars.js                   # Sidebar configuration
├── package.json                  # Dependencies
├── deploy.sh                     # EC2 deployment script
├── dev-start.ps1                 # Windows development script
└── README.md                     # This file
```

## 🔧 Configuration

### Docusaurus Configuration

The main configuration is in `docusaurus.config.js`:

- **Title**: "Rahva Raamat Website Setup & Developer Guide"
- **URL**: https://kenno.gaincafe.com
- **Base URL**: /
- **Broken Links**: Set to 'warn' to prevent build failures

### Sidebar Configuration

The sidebar structure is defined in `sidebars.js`:

- **Introduction**: Main entry point
- **Setup Guide**: Environment and database setup
- **Core**: Data models and relationships
- **Reference**: API documentation and admin panel
- **Authentication**: Security and authorization
- **Deployment**: Testing and deployment guides
- **Monitoring**: Logging, security, and performance
- **FAQ**: Troubleshooting and contributing guidelines

## 🐛 Troubleshooting

### Common Issues

1. **EISDIR Error:**
   - This happens when there are duplicate `intro.md` files
   - Solution: Ensure only one `intro.md` file exists in the `docs/` directory

2. **Broken Links:**
   - Check that all file names in links match actual file names
   - Use the correct numbered file names (e.g., `02-ENVIRONMENT_SETUP.md`)

3. **Build Failures:**
   - Run `npm run build` to see specific error messages
   - Check that all dependencies are installed: `npm install`

4. **PowerShell Issues:**
   - Use the provided `dev-start.ps1` script for Windows
   - Ensure PowerShell execution policy allows scripts: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned`

### Development Commands

```bash
# Check for broken links
npm run build

# Start development server
npm start

# Clear cache
npm run clear

# Write heading IDs
npm run write-heading-ids
```

## 📚 Documentation Sections

### Setup Guide
- **Environment Setup**: Complete development environment setup
- **Database Schema**: Database configuration and schema details

### Core
- **Core Models**: Understanding the data models and relationships

### Reference
- **Project Overview**: Architecture and business context
- **API Documentation**: Complete API reference
- **Admin Panel**: Admin interface documentation
- **Console Commands**: Available console commands
- **Configuration**: System configuration options

### Authentication
- **Authentication Authorization**: Security and authorization details

### Deployment
- **Testing**: Testing strategies and procedures
- **Deployment Guide**: Production deployment instructions

### Monitoring
- **Monitoring Logging**: System monitoring and logging
- **Security**: Security best practices
- **Performance**: Performance optimization

### FAQ
- **FAQ Troubleshooting**: Common issues and solutions
- **Glossary**: Technical terminology
- **Contributing**: Contribution guidelines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally: `.\dev-start.ps1 -Start`
5. Build and test: `.\dev-start.ps1 -Build`
6. Submit a pull request

## 📞 Support

For questions or issues:
- Check the [FAQ & Troubleshooting](./docs/faq/15-FAQ_TROUBLESHOOTING.md) section
- Review the [Contributing Guidelines](./docs/faq/17-CONTRIBUTING.md)
- Consult the [Glossary](./docs/faq/16-GLOSSARY.md) for terminology

---

*This documentation is maintained by the Rahva Raamat development team and covers the complete e-commerce backend system.*
