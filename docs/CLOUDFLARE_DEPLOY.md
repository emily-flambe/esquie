# Cloudflare Deployment Guide for esquie.org

This guide outlines the steps to deploy a simple web application using Cloudflare's platform, based on comprehensive research of their 2024 documentation and best practices.

## Executive Summary

**Important 2024 Update**: Cloudflare now recommends **Workers over Pages** for all new projects. Workers has become the unified platform with enhanced features, better tooling, and is the focus of future development.

## Platform Decision: Workers vs Pages

### Why Choose Workers (Recommended)
- **Official Recommendation**: Cloudflare explicitly recommends Workers for new projects in 2024
- **Enhanced Features**: Access to Durable Objects, Cron Triggers, comprehensive observability
- **Static Asset Support**: Now supports hosting static files (previously Pages-only feature)
- **Unified Experience**: Single platform for frontend and backend with one deployment
- **Better Tooling**: Advanced debugging, logging, and monitoring capabilities
- **Future-Proof**: Primary focus of Cloudflare's development efforts

### When to Consider Pages
- **Git-Ops Workflow**: If you specifically need git-centered automatic deployments
- **Existing Projects**: Current Pages projects can continue (migration available)
- **Simple Static Sites**: If you only need basic static hosting with minimal server-side logic

## Deployment Options

### Option 1: Cloudflare Workers (Recommended)

#### Step 1: Initial Setup
```bash
# Install Wrangler CLI
npm install -g wrangler

# Create new project with C3
npm create cloudflare@latest esquie-app -- --platform=workers

# Alternative: Initialize in existing directory
wrangler init esquie-app
```

#### Step 2: Project Structure
```
esquie-app/
├── src/
│   ├── index.js              # Main Worker script
│   └── assets/               # Static assets (HTML, CSS, JS, images)
├── wrangler.toml             # Configuration file
├── package.json
└── .dev.vars                 # Local environment variables
```

#### Step 3: Configuration (wrangler.toml)
```toml
name = "esquie-app"
main = "src/index.js"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

# Assets configuration for static files
[assets]
directory = "./src/assets"
binding = "ASSETS"

# Environment variables
[vars]
ENVIRONMENT = "production"

# Custom domain
[[route]]
pattern = "esquie.org/*"
custom_domain = true
```

#### Step 4: Basic Worker Code
```javascript
// src/index.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Serve static assets
    if (url.pathname.startsWith('/static/')) {
      return env.ASSETS.fetch(request);
    }
    
    // API routes
    if (url.pathname.startsWith('/api/')) {
      return handleAPI(request, env);
    }
    
    // Serve main HTML
    return new Response(await getHTML(), {
      headers: { 'Content-Type': 'text/html' }
    });
  }
};

async function handleAPI(request, env) {
  return new Response(JSON.stringify({ 
    message: "Hello from Cloudflare Workers!" 
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getHTML() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Esquie.org</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      <h1>Welcome to Esquie.org</h1>
      <p>Your silly web app is live!</p>
    </body>
    </html>
  `;
}
```

#### Step 5: Development and Deployment
```bash
# Local development
wrangler dev

# Deploy to Cloudflare
wrangler deploy

# Deploy with custom domain
wrangler deploy --routes="esquie.org/*"
```

### Option 2: Cloudflare Pages (Alternative)

#### Step 1: Setup via Git Integration
1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings in Cloudflare dashboard
3. Set up automatic deployments

#### Step 2: Project Structure
```
esquie-app/
├── functions/               # Server-side functions
│   ├── api/
│   │   └── hello.js        # /api/hello endpoint
│   └── _middleware.js      # Global middleware
├── public/                 # Static assets
├── dist/                   # Build output
└── wrangler.toml          # Configuration
```

#### Step 3: Pages Function Example
```javascript
// functions/api/hello.js
export function onRequest(context) {
  return new Response(JSON.stringify({
    message: "Hello from Cloudflare Pages!",
    environment: context.env.ENVIRONMENT
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

#### Step 4: Deployment
```bash
# Direct deployment
wrangler pages deploy ./dist

# Local development
wrangler pages dev
```

## Custom Domain Setup (esquie.org)

### Step 1: Domain Configuration
1. Log into Cloudflare Dashboard
2. Navigate to Workers & Pages
3. Select your project
4. Go to "Settings" → "Domains"
5. Click "Set up a domain"
6. Enter `esquie.org`

### Step 2: DNS Configuration
Since you already have esquie.org registered with Cloudflare:

1. **Automatic Setup**: Cloudflare will automatically configure DNS
2. **SSL Certificate**: Automatically provisioned
3. **CNAME Record**: `esquie.org` → `your-worker.your-subdomain.workers.dev`

### Step 3: Verification
```bash
# Test your deployment
curl https://esquie.org
dig esquie.org
```

## Environment Variables and Secrets

### Local Development (.dev.vars)
```bash
# .dev.vars (never commit this file)
API_KEY="development-key"
DATABASE_URL="sqlite://local.db"
DEBUG="true"
```

### Production Configuration
```bash
# Using Wrangler CLI
wrangler secret put API_KEY
wrangler secret put DATABASE_URL

# Or via Dashboard: Workers & Pages > Project > Settings > Variables
```

### Accessing in Code
```javascript
export default {
  async fetch(request, env, ctx) {
    const apiKey = env.API_KEY;
    const dbUrl = env.DATABASE_URL;
    // Use environment variables
  }
};
```

## Best Practices and Recommendations

### Performance Optimization
- **Edge Caching**: Utilize Cloudflare's global CDN
- **Bundle Size**: Keep Workers under 1MB limit
- **Cold Starts**: Already optimized at ~0ms with Workers
- **Asset Optimization**: Use Cloudflare's image optimization

### Security Best Practices
- **Secrets Management**: Use Wrangler secrets, never hardcode
- **CORS Configuration**: Implement proper CORS headers
- **Rate Limiting**: Implement request rate limiting
- **Input Validation**: Always validate and sanitize inputs

### Development Workflow
```bash
# Recommended development workflow
git checkout -b feature/new-feature
wrangler dev                    # Local development
git commit -am "Add new feature"
wrangler deploy --env preview   # Preview deployment
# Test preview deployment
wrangler deploy                 # Production deployment
```

### Monitoring and Debugging
- **Workers Analytics**: Available in Cloudflare Dashboard
- **Real-time Logs**: `wrangler tail` for live debugging
- **Error Tracking**: Built-in error reporting
- **Performance Metrics**: Request duration, CPU time, memory usage

## Migration Path

### From Pages to Workers
If you start with Pages and need to migrate:

```bash
# 1. Create new Workers project
wrangler init esquie-workers

# 2. Move static assets to src/assets/
# 3. Convert functions/ to Worker routes
# 4. Update wrangler.toml configuration
# 5. Test and deploy
wrangler deploy
```

### Key Changes Needed
- `functions/api/hello.js` → URL routing in main Worker
- Environment variables remain the same
- Static assets served via Assets binding

## Troubleshooting Common Issues

### Build Failures
- **Check build commands**: Ensure correct output directory
- **Dependencies**: Verify all dependencies are installed
- **Environment**: Check compatibility_date and flags

### Domain Issues
- **DNS Propagation**: Allow 24-48 hours for global propagation
- **SSL Certificate**: Verify CAA records allow Cloudflare
- **Redirect Loops**: Check redirect configurations

### Performance Issues
- **Bundle Size**: Keep under limits, use dynamic imports
- **Memory Usage**: Monitor Worker memory consumption
- **Database Connections**: Use connection pooling

## Next Steps

1. **Choose Platform**: Workers for new projects (recommended)
2. **Set Up Repository**: Initialize git repository
3. **Configure Domain**: Set up esquie.org custom domain
4. **Implement Features**: Build your silly web app
5. **Deploy**: Use `wrangler deploy` for production
6. **Monitor**: Set up analytics and monitoring

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Migration Guide: Pages to Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)

---

*Last Updated: December 2024 - Based on latest Cloudflare documentation and 2024 best practices*