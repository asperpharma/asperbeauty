# Lovable Git Sync - Quick Setup Guide

## ✅ Checklist: Enable Cursor → GitHub → Lovable Sync

### 1. Enable Git Sync in Lovable (Required)

- [ ] Open [Lovable Dashboard](https://lovable.dev)
- [ ] Navigate to your project
- [ ] Go to **Settings** → **Git Integration**
- [ ] Click **"Connect GitHub"** (if not already connected)
- [ ] Select repository: **asperpharma/asperbeauty**
- [ ] Select branch: **main** (or your working branch)
- [ ] Enable **"Sync with GitHub"** toggle
- [ ] Enable **"Auto-deploy on push"** (recommended)
- [ ] Click **"Save Changes"**

### 2. Verify GitHub Integration

- [ ] Go to GitHub repository settings
- [ ] Navigate to **Settings** → **Webhooks**
- [ ] Verify Lovable webhook is present and active
- [ ] Check recent deliveries for successful pings

### 3. Test the Connection

```bash
# Make a small test change
echo "# Test sync" >> TEST_SYNC.md

# Commit and push
git add TEST_SYNC.md
git commit -m "test: verify Lovable Git sync"
git push origin main

# Clean up
git rm TEST_SYNC.md
git commit -m "chore: remove test file"
git push origin main
```

### 4. Monitor Sync Status

- [ ] Open Lovable Dashboard
- [ ] Check **Activity Log** for sync events
- [ ] Verify build triggered automatically
- [ ] Confirm deployment to https://asperbeautyshop.lovable.app

## 🔧 Common Issues

### Issue: Changes not syncing to Lovable

**Solution:**
1. Check Git sync is enabled in Lovable Settings
2. Verify you're pushing to the correct branch
3. Check GitHub webhook deliveries
4. Manually trigger sync in Lovable Dashboard

### Issue: Build failing on Lovable

**Solution:**
1. Check build logs in Lovable Dashboard
2. Verify `npm run build` works locally
3. Check environment variables are set in Lovable
4. Review `.lovable.yml` configuration

### Issue: Lovable changes not appearing in GitHub

**Solution:**
1. Check Lovable has write access to repository
2. Verify GitHub OAuth connection
3. Re-authenticate in Lovable Settings
4. Check repository permissions

## 🎯 Best Practices

1. **Always enable sync before starting work**
2. **Use feature branches** for development
3. **Pull before pushing** to avoid conflicts
4. **Monitor build logs** after pushing
5. **Test locally** before pushing to main

## 📚 Resources

- Full Guide: [DEVELOPMENT.md](./DEVELOPMENT.md)
- Project Setup: [README.md](./README.md)
- Contribution Guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Lovable Docs: https://docs.lovable.dev
- Git Sync Guide: https://docs.lovable.dev/git-sync

## 🆘 Need Help?

1. Check [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed troubleshooting
2. Review [Lovable Documentation](https://docs.lovable.dev)
3. Create an issue in this repository
4. Contact Lovable support: hello@lovable.dev

---

**Quick Command Reference:**

```bash
# Clone repository
git clone https://github.com/asperpharma/asperbeauty.git

# Install dependencies
cd asperbeauty && npm install

# Start development
npm run dev

# Build and test
npm run build
npm run lint

# Push changes (triggers Lovable deployment)
git add .
git commit -m "feat: your changes"
git push origin main
```

✅ Once Git sync is enabled, all pushes to GitHub automatically trigger Lovable builds and deployments!
