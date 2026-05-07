# Development Guide

## 🔄 Development Workflow: Cursor ↔ GitHub ↔ Lovable

This project is built with [Lovable](https://lovable.dev) and syncs automatically between your local environment (Cursor IDE), GitHub, and Lovable's platform.

### How It Works

```
Cursor IDE (local) → GitHub → Lovable (automatic sync)
      ↑                                    ↓
      └────────────────────────────────────┘
             (changes deployed automatically)
```

### Setup Instructions

#### 1. **Enable Lovable Git Sync**

Before you start development, ensure Lovable's Git sync is enabled:

1. Go to your project in [Lovable Dashboard](https://lovable.dev)
2. Navigate to **Settings** → **Git Integration**
3. Enable **"Sync with GitHub"**
4. Select the repository: `asperpharma/asperbeauty`
5. Select the branch you want to sync (typically `main` or your feature branch)
6. Click **"Enable Sync"**

> ⚠️ **Important**: Git sync must be enabled for your working branch for changes to sync properly.

#### 2. **Clone and Setup Local Environment**

```bash
# Clone the repository
git clone https://github.com/asperpharma/asperbeauty.git
cd asperbeauty

# Install dependencies
npm install

# Start development server
npm run dev
```

#### 3. **Development Workflow**

##### Option A: Work in Cursor → Push to GitHub → Auto-sync to Lovable

This is the recommended workflow for code-heavy tasks:

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes in Cursor IDE
# ... edit files ...

# Stage and commit changes
git add .
git commit -m "feat: your feature description"

# Push to GitHub
git push origin feature/your-feature-name
```

**What happens next:**
- GitHub receives your changes
- Lovable detects the push via Git sync
- Lovable automatically rebuilds and deploys your changes
- Changes are visible at https://asperbeautyshop.lovable.app

##### Option B: Work in Lovable → Auto-sync to GitHub

For quick UI tweaks or prompt-based development:

1. Open your project in [Lovable](https://lovable.dev)
2. Use the AI assistant to make changes
3. Changes are automatically committed and pushed to GitHub
4. Pull the changes locally:
   ```bash
   git pull origin main
   ```

##### Option C: Work in GitHub Web Editor

1. Edit files directly in GitHub
2. Commit changes via GitHub UI
3. Lovable syncs automatically
4. Pull changes locally if needed

### 🔍 Verifying Sync Status

#### Check Lovable Sync Status

1. Visit your [Lovable Dashboard](https://lovable.dev)
2. Look for the **Git sync indicator** in your project
3. Check the **Activity Log** for sync events

#### Check GitHub Commits

```bash
# View recent commits
git log --oneline -10

# Check remote status
git remote -v
git fetch origin
git status
```

### 🚨 Troubleshooting

#### Changes Not Syncing to Lovable?

1. **Verify Git sync is enabled**:
   - Go to Lovable Dashboard → Settings → Git Integration
   - Ensure sync is ON for your branch

2. **Check branch name**:
   - Lovable syncs only the configured branch
   - Verify you're pushing to the correct branch

3. **Review GitHub webhook**:
   - Go to GitHub → Settings → Webhooks
   - Ensure Lovable webhook is active
   - Check recent deliveries for errors

4. **Force a sync**:
   - In Lovable Dashboard, go to Settings → Git Integration
   - Click **"Sync Now"** to manually trigger a sync

#### Changes Not Syncing from Lovable to GitHub?

1. **Check Lovable Git credentials**:
   - Ensure Lovable has write access to your repository
   - Verify OAuth connection in Settings

2. **Review commit history**:
   ```bash
   git log --all --author="lovable-dev" --oneline
   ```

3. **Re-authorize GitHub connection**:
   - Go to Lovable Settings → Git Integration
   - Click **"Reconnect GitHub"**

#### Merge Conflicts

If you edit the same files in both Cursor and Lovable simultaneously:

```bash
# Pull latest changes from GitHub
git pull origin main

# Resolve conflicts in your editor
# ... fix conflicts ...

# Stage resolved files
git add .

# Commit the merge
git commit -m "chore: resolve merge conflicts"

# Push to GitHub
git push origin main
```

### 📋 Best Practices

1. **Always pull before starting work**:
   ```bash
   git pull origin main
   ```

2. **Use feature branches** for major changes:
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Keep commits atomic and well-described**:
   ```bash
   git commit -m "feat(cart): add quantity selector"
   ```

4. **Test locally before pushing**:
   ```bash
   npm run build
   npm run lint
   ```

5. **Verify sync after pushing**:
   - Check Lovable Dashboard for build status
   - Visit live site to confirm deployment

### 🔐 Environment Variables

Environment variables are managed separately in Lovable:

1. **Local development**: Use `.env` file (git-ignored)
2. **Lovable production**: Set in Dashboard → Settings → Environment Variables

Never commit secrets to Git:
```bash
# .env file (already in .gitignore)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### 🚀 Deployment

Deployment is automatic:

1. **Push to GitHub** → Triggers Lovable build
2. **Lovable builds** → Runs `npm run build`
3. **Deploy** → Updates https://asperbeautyshop.lovable.app
4. **Notifications** → Check build status in Lovable Dashboard

### 📚 Additional Resources

- [Lovable Documentation](https://docs.lovable.dev)
- [Lovable Git Sync Guide](https://docs.lovable.dev/git-sync)
- [Cursor IDE Documentation](https://cursor.sh/docs)
- [GitHub Workflow Documentation](https://docs.github.com/en/actions)

### 💡 Tips

- **Use Cursor for complex logic**: Better for TypeScript, debugging, refactoring
- **Use Lovable for UI work**: AI-assisted styling, component generation
- **Use GitHub for reviews**: Pull requests, code reviews, collaboration
- **Keep branches synced**: Regular pulls prevent conflicts
- **Monitor build logs**: Check Lovable Dashboard for errors

---

For more information, see:
- [README.md](./README.md) - Project overview
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [.github/copilot-instructions.md](./.github/copilot-instructions.md) - Coding standards
