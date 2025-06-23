# Deployment Guide

## Repository Secrets Setup

To enable automatic deployments, you need to set up a Cloudflare API token as a repository secret.

### 1. Create Cloudflare API Token

1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use the "Custom token" template
4. Configure the token with these permissions:
   - **Zone** - `Zone:Edit` (for your domain)
   - **Account** - `Cloudflare Workers:Edit`
   - **Zone Resources** - Include your specific zone or all zones
   - **Account Resources** - Include your account

### 2. Add Token to GitHub Repository

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `CLOUDFLARE_API_TOKEN`
5. Value: Paste your API token from step 1
6. Click **Add secret**

## Deployment Environments

The workflow is configured with three environments:

- **Preview** (`esquie-app-preview`) - Deployed on Pull Requests
- **Staging** (`esquie-app-staging`) - Manual deployment only  
- **Production** (`esquie-app-prod`) - Deployed on main branch push

## Manual Deployment Commands

```bash
# Deploy to preview
npm run deploy:preview

# Deploy to staging  
npm run deploy:staging

# Deploy to production
npm run deploy:prod
```

## Workflow Triggers

- **Pull Request**: Runs tests + deploys to preview environment
- **Push to main**: Runs tests + deploys to production environment

## Environment URLs

After deployment, your apps will be available at:

- **Preview**: `https://esquie-app-preview.esquie-workers.workers.dev`
- **Staging**: `https://esquie-app-staging.esquie-workers.workers.dev`  
- **Production**: `https://esquie-app-prod.esquie-workers.workers.dev`

*Note: Replace `esquie-workers` with your actual Cloudflare account subdomain.*