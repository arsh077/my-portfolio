# Deployment Guide

This guide covers different deployment options for your portfolio website.

## 🚀 Vercel (Recommended)

Vercel is perfect for React applications and offers excellent performance.

### Steps:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project
   - Click "Deploy"

3. **Custom Domain** (Optional):
   - Go to your project settings in Vercel
   - Add your custom domain
   - Update DNS records as instructed

## 🌐 Netlify

Another excellent option for static sites.

### Steps:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Visit [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect your GitHub repository for automatic deployments

## 🔧 Manual Hosting

For traditional web hosting providers:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload files**:
   - Upload all files from the `dist` folder to your web server
   - Ensure your server supports SPA routing (for React Router if added later)

## 📧 Contact Form Setup

The contact form currently uses a basic HTML form. For production, you'll need:

### Option 1: Formspree
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Option 2: Netlify Forms
Add `netlify` attribute to your form:
```html
<form netlify>
```

### Option 3: Custom Backend
Create a backend API endpoint to handle form submissions.

## 🔒 Environment Variables

For production, create environment variables for:
- Contact form endpoints
- Analytics tracking IDs
- Any API keys

Create `.env.production`:
```
VITE_CONTACT_FORM_URL=your_form_endpoint
VITE_GA_TRACKING_ID=your_google_analytics_id
```

## 📊 Analytics Setup

### Google Analytics 4

1. Create a GA4 property
2. Add the tracking code to `index.html`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🎯 SEO Optimization

### Meta Tags
Update `index.html` with proper meta tags:
```html
<meta name="description" content="Arshad Khan - Full-Stack Developer & Legal-Tech Expert">
<meta name="keywords" content="legal-tech, web development, React, Python, full-stack developer">
<meta property="og:title" content="Arshad Khan - Portfolio">
<meta property="og:description" content="Full-Stack Developer specializing in Legal-Tech solutions">
<meta property="og:image" content="https://your-domain.com/og-image.jpg">
```

### Sitemap
Create a `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <lastmod>2026-01-07</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

## 🔧 Performance Optimization

### Image Optimization
- Compress images using tools like TinyPNG
- Use WebP format when possible
- Implement lazy loading for images

### Bundle Optimization
```bash
npm run build -- --analyze
```

This will show you bundle size analysis.

## 🚨 Pre-deployment Checklist

- [ ] Test on different devices and browsers
- [ ] Verify all links work correctly
- [ ] Check contact form functionality
- [ ] Optimize images
- [ ] Add proper meta tags
- [ ] Set up analytics
- [ ] Test performance with Lighthouse
- [ ] Ensure HTTPS is enabled
- [ ] Set up custom domain (if applicable)

## 📱 Progressive Web App (Optional)

To make your portfolio a PWA:

1. Add a `public/manifest.json`
2. Create service worker for offline functionality
3. Add PWA meta tags to `index.html`

This will allow users to "install" your portfolio on their devices.

## 🔄 Continuous Deployment

Set up automatic deployments:
- Push to `main` branch triggers deployment
- Preview deployments for pull requests
- Environment-specific configurations

Your portfolio is now ready for production! 🎉