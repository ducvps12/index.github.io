# 🚀 Deployment Guide

This guide covers various ways to deploy your MTD Link Bio.

## Table of Contents
- [GitHub Pages](#github-pages)
- [Netlify](#netlify)
- [Vercel](#vercel)
- [Custom Server](#custom-server)
- [Custom Domain](#custom-domain)

---

## GitHub Pages

### Quick Deploy (Recommended)

1. **Fork this repository**
   - Click the "Fork" button at the top right
   - This creates a copy in your GitHub account

2. **Enable GitHub Pages**
   - Go to your forked repository
   - Click "Settings" → "Pages"
   - Under "Source", select "main" branch
   - Click "Save"

3. **Access your site**
   - Your site will be live at: `https://yourusername.github.io/mtd-linkbio`
   - Wait 1-2 minutes for deployment

### Custom Repository Name

If you want your link bio at `https://yourusername.github.io`:

1. Rename your repository to `yourusername.github.io`
2. Enable GitHub Pages (same as above)
3. Your site will be at: `https://yourusername.github.io`

---

## Netlify

### Deploy with Netlify

1. **Sign up at [Netlify](https://netlify.com)**

2. **New Site from Git**
   - Click "New site from Git"
   - Choose GitHub
   - Select your repository
   - Click "Deploy site"

3. **Configure**
   - Build command: (leave empty)
   - Publish directory: `/`
   - Click "Deploy"

4. **Custom Domain** (Optional)
   - Go to "Domain settings"
   - Add your custom domain
   - Follow DNS configuration instructions

### Deploy Button

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/mtd-linkbio)

---

## Vercel

### Deploy with Vercel

1. **Sign up at [Vercel](https://vercel.com)**

2. **Import Project**
   - Click "New Project"
   - Import from GitHub
   - Select your repository

3. **Configure**
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Click "Deploy"

4. **Custom Domain** (Optional)
   - Go to project settings
   - Add your custom domain
   - Follow DNS configuration

### Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mtd-linkbio)

---

## Custom Server

### Requirements
- Web server (Apache, Nginx, etc.)
- HTTPS certificate (recommended)

### Apache

1. **Upload files**
   ```bash
   scp -r * user@yourserver.com:/var/www/html/
   ```

2. **Configure .htaccess** (optional)
   ```apache
   # Force HTTPS
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

   # Cache static assets
   <FilesMatch "\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2)$">
     Header set Cache-Control "max-age=31536000, public"
   </FilesMatch>
   ```

### Nginx

1. **Upload files**
   ```bash
   scp -r * user@yourserver.com:/var/www/html/
   ```

2. **Configure nginx.conf**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/html;
       index index.html;

       # Force HTTPS
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name yourdomain.com;
       root /var/www/html;
       index index.html;

       # SSL configuration
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;

       # Cache static assets
       location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;
   }
   ```

3. **Restart Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

---

## Custom Domain

### GitHub Pages

1. **Add CNAME file**
   - Create a file named `CNAME` in your repository
   - Add your domain: `yourdomain.com`
   - Commit and push

2. **Configure DNS**
   Add these records at your domain provider:

   **For apex domain (yourdomain.com):**
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

   **For www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: yourusername.github.io
   ```

3. **Enable HTTPS**
   - Go to repository Settings → Pages
   - Check "Enforce HTTPS"

### Netlify

1. **Add Custom Domain**
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Enter your domain

2. **Configure DNS**
   - Option A: Use Netlify DNS (recommended)
   - Option B: Add CNAME record pointing to your Netlify subdomain

3. **Enable HTTPS**
   - Netlify automatically provisions SSL certificate
   - Usually takes a few minutes

### Vercel

1. **Add Custom Domain**
   - Go to Project Settings → Domains
   - Add your domain

2. **Configure DNS**
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

3. **HTTPS**
   - Automatically enabled by Vercel

---

## Environment-Specific Configuration

### Production Checklist

- [ ] Update profile information in admin panel
- [ ] Add all your links
- [ ] Customize theme and colors
- [ ] Test all links work correctly
- [ ] Test on mobile devices
- [ ] Enable HTTPS
- [ ] Set up custom domain (optional)
- [ ] Test backup/restore functionality
- [ ] Share your link bio! 🎉

### Performance Optimization

1. **Enable Caching**
   - Configure cache headers for static assets
   - Use CDN if available

2. **Compress Assets**
   - Enable gzip/brotli compression on server
   - Most hosting providers do this automatically

3. **Monitor Performance**
   - Use Google PageSpeed Insights
   - Check mobile performance
   - Optimize images if needed

---

## Troubleshooting

### Site Not Loading

1. Check if files are uploaded correctly
2. Verify index.html is in root directory
3. Check browser console for errors
4. Clear browser cache

### Custom Domain Not Working

1. Verify DNS records are correct
2. Wait for DNS propagation (up to 48 hours)
3. Check CNAME file exists (GitHub Pages)
4. Verify domain is added in hosting settings

### HTTPS Issues

1. Wait for SSL certificate provisioning
2. Check if HTTPS is enabled in settings
3. Clear browser cache
4. Try incognito mode

### Data Not Persisting

1. Check if LocalStorage is enabled
2. Verify browser allows LocalStorage
3. Check if in private/incognito mode
4. Try different browser

---

## Support

Need help with deployment?

- 📧 Email: support@mtdvps.com
- 💬 Discord: https://discord.gg/Mumgffrp5b
- 📱 Zalo: https://zalo.me/g/afdrwb295
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/mtd-linkbio/issues)

---

**Happy Deploying! 🚀**
