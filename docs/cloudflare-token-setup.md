# Cloudflare API Token Setup Guide

## Step 1: Access Cloudflare API Tokens

1. Go to [https://dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Log in to your Cloudflare account
3. Click **"Create Token"**

## Step 2: Choose Token Template

Select **"Custom token"** (not "Use template") for maximum control over permissions.

## Step 3: Configure Token Permissions

Set up the token with these **minimum required permissions**:

### Account Permissions
- **Cloudflare Workers:Edit** - Required to deploy workers

### Zone Permissions (if your worker uses a custom domain)
- **Zone:Read** - To read zone information
- **Zone Settings:Edit** - To modify zone settings if needed

### Account Resources
- **Include: All accounts** (or select your specific account)

### Zone Resources
- **Include: All zones** (or select specific zones if you have a custom domain)

## Step 4: Additional Settings

- **Client IP Address Filtering**: Leave blank (unless you want to restrict)
- **TTL (Time to Live)**: Set expiration date or leave blank for no expiration

## Step 5: Create and Copy Token

1. Click **"Continue to summary"**
2. Review permissions
3. Click **"Create Token"**
4. **Copy the token immediately** - you won't be able to see it again!

## Step 6: Add to GitHub Repository

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `CLOUDFLARE_API_TOKEN`
5. Value: Paste the token you copied
6. Click **"Add secret"**

## Alternative: Account-Level Token

If you prefer broader permissions, you can create an account-level token:

### Template: "Account - Cloudflare Workers:Edit"
1. Choose the pre-built template
2. Select your account
3. Create token

## Testing Your Token

To test if your token works, you can run this locally:

```bash
# Set the token temporarily
export CLOUDFLARE_API_TOKEN="your-token-here"

# Test with wrangler
npx wrangler whoami
```

## Common Issues

- **Permission denied**: Token needs `Cloudflare Workers:Edit` permission
- **Zone not found**: Add `Zone:Read` permission if using custom domains
- **Account access**: Ensure token has access to the correct account

## Security Best Practices

- ✅ Use minimal required permissions
- ✅ Set token expiration dates
- ✅ Never commit tokens to code
- ✅ Rotate tokens periodically
- ❌ Don't share tokens in chat/email