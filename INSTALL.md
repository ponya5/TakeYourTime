# Installation Guide

This guide covers different methods to install the Take Your Time extension.

## Method 1: Install from VSIX File (Easiest)

### Step 1: Get the VSIX File

Download the `.vsix` file from one of these sources:
- GitHub Releases page
- Direct download link shared by the developer
- Build it yourself (see Method 3)

### Step 2: Install via VS Code UI

1. Open Visual Studio Code
2. Click the Extensions icon in the Activity Bar (or press `Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Click the `...` (More Actions) button at the top of the Extensions view
4. Select **Install from VSIX...**
5. Browse to the downloaded `.vsix` file
6. Click **Install**
7. Reload VS Code when prompted

### Step 3: Verify Installation

1. Look for the game controller icon (🎮) in the Activity Bar
2. Click it to open a game tab
3. If you see the game site, installation was successful!

## Method 2: Install via Command Line

If you prefer using the terminal:

```bash
# Navigate to the directory containing the .vsix file
cd /path/to/download

# Install the extension
code --install-extension take-your-time-0.1.0.vsix
```

Then restart VS Code.

## Method 3: Build and Install from Source

### Prerequisites

- Node.js 20.x or higher
- npm
- Git
- VS Code 1.85.0+

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/take-your-time.git
cd take-your-time

# 2. Install dependencies
npm install

# 3. Compile the TypeScript code
npm run compile

# 4. Install vsce (VS Code Extension packager) if not already installed
npm install -g @vscode/vsce

# 5. Package the extension
vsce package

# 6. Install the generated .vsix file
code --install-extension take-your-time-0.1.0.vsix
```

## Troubleshooting

### Extension Not Appearing

- **Check Extensions List**: Press `Ctrl+Shift+X` and search for "Take Your Time"
- **Reload Window**: Press `Ctrl+Shift+P` / `Cmd+Shift+P`, type "Reload Window"
- **Check VS Code Version**: Ensure you're running VS Code 1.85.0 or higher
  - Help > About to check version

### Installation Fails

- **Permission Issues**: Try running VS Code as administrator (Windows) or with sudo (Linux/Mac)
- **Corrupted VSIX**: Re-download the `.vsix` file
- **Conflicting Extensions**: Disable other extensions temporarily

### Game Not Loading

- **Check Internet Connection**: The extension loads games from external websites
- **Firewall/Proxy**: Ensure your network allows access to game sites
- **Try Different Game Site**: Change `takeYourTime.gameUrl` in settings

### Command Not Found

If `code` command doesn't work:

**Windows:**
- VS Code should add itself to PATH during installation
- Reinstall VS Code with "Add to PATH" option checked

**Mac:**
1. Open VS Code
2. Press `Cmd+Shift+P`
3. Type "Shell Command: Install 'code' command in PATH"
4. Restart terminal

**Linux:**
- Add VS Code to PATH: `export PATH="$PATH:/path/to/vscode"`
- Or use the full path: `/path/to/vscode/bin/code --install-extension ...`

## Uninstalling

### Via UI
1. Open Extensions view (`Ctrl+Shift+X`)
2. Find "Take Your Time"
3. Click the gear icon
4. Select **Uninstall**

### Via Command Line
```bash
code --uninstall-extension kiro.take-your-time
```

## Updating

To update to a newer version:

1. Uninstall the current version (optional but recommended)
2. Download the new `.vsix` file
3. Install using any method above

VS Code will automatically replace the old version if you install directly.

## Sharing with Others

To share this extension with teammates:

1. **Share the VSIX file** directly via:
   - Email attachment
   - Shared drive
   - Internal file server
   - GitHub Releases

2. **Share this guide** so they know how to install it

3. **Optional**: Host on internal extension marketplace if your organization has one

## Next Steps

After installation:
- Read the [README.md](README.md) for usage instructions
- Configure game sites in VS Code settings
- Start playing while your builds run!

---

**Author**: [Daniel Shalom](https://www.linkedin.com/in/daniel-shalom-13987a1a/)

Need help? Open an issue on GitHub or reach out on LinkedIn.
