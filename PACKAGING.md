# Packaging Guide for Distribution

This guide explains how to create a `.vsix` file for sharing the extension.

## Quick Start

```bash
# Install the packaging tool (one-time setup)
npm install -g @vscode/vsce

# Package the extension
npm run package
```

This creates `take-your-time-0.1.0.vsix` in the project root.

## Detailed Steps

### 1. Prepare for Packaging

Ensure your code is ready:

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Run tests
npm test

# Compile TypeScript
npm run compile
```

### 2. Install VSCE (if not already installed)

```bash
npm install -g @vscode/vsce
```

### 3. Package the Extension

```bash
vsce package
```

This command:
- Validates `package.json`
- Compiles TypeScript (if needed)
- Bundles all necessary files
- Creates a `.vsix` file

### 4. Verify the Package

```bash
# List contents of the VSIX
vsce ls

# Test install locally
code --install-extension take-your-time-0.1.0.vsix
```

## Distribution Methods

### GitHub Releases (Recommended)

1. Create a new release on GitHub
2. Upload the `.vsix` file as a release asset
3. Share the release URL with users

```bash
# Tag the release
git tag v0.1.0
git push origin v0.1.0
```

### Direct File Sharing

Share the `.vsix` file via:
- Email
- Shared drive
- Internal file server
- Cloud storage (Dropbox, Google Drive, etc.)

### Internal Extension Marketplace

If your organization has an internal marketplace:
1. Follow your organization's extension submission process
2. Upload the `.vsix` file
3. Users can install via the internal marketplace

## Package Contents

The `.vsix` includes:
- Compiled JavaScript (`out/` directory)
- `package.json` manifest
- Icons and media files
- README and documentation
- LICENSE file

The `.vsix` excludes (via `.vsignore`):
- Source TypeScript files
- `node_modules/`
- Test files
- Development configuration
- Git files

## Versioning

Update version in `package.json` before packaging:

```json
{
  "version": "0.2.0"
}
```

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

## Troubleshooting

### "vsce: command not found"

Install vsce globally:
```bash
npm install -g @vscode/vsce
```

### Package Size Too Large

Check what's being included:
```bash
vsce ls
```

Add exclusions to `.vsignore` if needed.

### Missing Files in Package

Ensure required files aren't in `.vsignore`:
- `out/` directory (compiled code)
- `media/` directory (icons)
- `README.md`
- `package.json`

### Validation Errors

Common issues:
- Missing required fields in `package.json`
- Invalid icon paths
- Broken activation events

Run validation:
```bash
vsce package --allow-star-activation
```

## Publishing to Marketplace (Future)

If you decide to publish officially:

1. Create a publisher account at https://marketplace.visualstudio.com/
2. Get a Personal Access Token from Azure DevOps
3. Login with vsce:
   ```bash
   vsce login <publisher-name>
   ```
4. Publish:
   ```bash
   vsce publish
   ```

For now, stick with direct `.vsix` distribution.

## Automation

Add to `package.json` scripts:

```json
{
  "scripts": {
    "package": "vsce package",
    "package:check": "vsce ls"
  }
}
```

Then run:
```bash
npm run package
```

---

**Ready to share!** Your `.vsix` file is now ready for distribution.

**Author**: [Daniel Shalom](https://www.linkedin.com/in/daniel-shalom-13987a1a/)
