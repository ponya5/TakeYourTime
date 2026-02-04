# GitHub Publishing Checklist

Use this checklist before making your repository public.

## Pre-Publishing Review

### Code Review
- [x] No personal email addresses in code
- [x] No hardcoded file paths (C:\Users\, /home/, etc.)
- [x] No API keys or secrets
- [x] No personal identifiers
- [x] Generic publisher name ("kiro") in package.json

### Documentation
- [x] README.md updated with features and installation
- [x] INSTALL.md created with detailed instructions
- [x] PACKAGING.md created for distribution
- [x] LICENSE file added (MIT)
- [x] Code comments are professional

### Files to Exclude
- [x] .gitignore configured properly
- [x] .vsixignore created for packaging
- [x] Build artifacts excluded (out/, *.vsix)
- [x] node_modules excluded
- [x] Personal config files excluded

### Repository Setup
- [ ] Create new GitHub repository
- [ ] Add repository description
- [ ] Add topics/tags (vscode, extension, games, productivity)
- [ ] Choose MIT license on GitHub
- [ ] Add .github/workflows if you want CI/CD (optional)

## Publishing Steps

### 1. Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Take Your Time VS Code extension"
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `take-your-time` or `vscode-take-your-time`
3. Description: "VS Code extension for playing arcade games while waiting for tasks"
4. Choose: **Public**
5. Don't initialize with README (you already have one)
6. Click "Create repository"

### 3. Push to GitHub

```bash
# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/take-your-time.git

# Push code
git branch -M main
git push -u origin main
```

### 4. Create First Release

```bash
# Tag the release
git tag -a v0.1.0 -m "Initial release"
git push origin v0.1.0
```

Then on GitHub:
1. Go to repository → Releases → "Create a new release"
2. Choose tag: v0.1.0
3. Release title: "v0.1.0 - Initial Release"
4. Description: Copy from README release notes
5. Upload the `.vsix` file as an asset
6. Click "Publish release"

### 5. Repository Settings

**About Section** (top right of repo):
- Add description
- Add website (if any)
- Add topics: `vscode-extension`, `games`, `arcade`, `productivity`, `typescript`

**README Badges** (optional):
Add to top of README.md:
```markdown
![VS Code Version](https://img.shields.io/badge/VS%20Code-1.85.0%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-0.1.0-orange)
```

## Post-Publishing

### Share Your Extension

Share the repository URL:
```
https://github.com/YOUR_USERNAME/take-your-time
```

Share the release download:
```
https://github.com/YOUR_USERNAME/take-your-time/releases/latest
```

### Update Package.json

Add repository info to `package.json`:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/take-your-time.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/take-your-time/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/take-your-time#readme"
}
```

Then commit and push:
```bash
git add package.json
git commit -m "Add repository links to package.json"
git push
```

## Security Check

Before going public, verify:

```bash
# Search for common PII patterns
git grep -i "email"
git grep -i "@gmail\|@yahoo\|@hotmail"
git grep -E "C:\\\\Users|/home/|/Users/"
git grep -i "password\|secret\|token\|api.key"
```

If any matches found, review and remove before publishing.

## Optional Enhancements

### Add GitHub Actions CI

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npm run lint
      - run: npm run compile
      - run: npm test
```

### Add Contributing Guidelines

Create `CONTRIBUTING.md` with:
- How to report bugs
- How to suggest features
- Code style guidelines
- Pull request process

### Add Issue Templates

Create `.github/ISSUE_TEMPLATE/bug_report.md` and `feature_request.md`

## Final Verification

- [ ] Repository is public
- [ ] README displays correctly
- [ ] License is visible
- [ ] Release has .vsix file attached
- [ ] Installation instructions work
- [ ] No sensitive information visible

---

**You're ready to share!** 🚀

Users can now:
1. Visit your GitHub repository
2. Download the .vsix from Releases
3. Install following INSTALL.md instructions

**Author**: [Daniel Shalom](https://www.linkedin.com/in/daniel-shalom-13987a1a/)
