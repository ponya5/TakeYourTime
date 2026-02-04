# Quick Start Guide - Take Your Time Extension

## 🚀 How to Run the Extension

### Method 1: Press F5 (Recommended)

1. **Make sure you're in the TakeYourTime folder**
   - Open VS Code
   - File → Open Folder → Select `TakeYourTime`

2. **Press F5**
   - A new VS Code window will open (Extension Development Host)
   - The extension is now running in that window

3. **Test the extension**
   - In the new window, press `Ctrl+Shift+P`
   - Type: `Take Your Time: Open Game`
   - Press Enter
   - The game should open in a new tab!

### Method 2: Manual Compile & Run

```powershell
# Compile the extension
npm run compile

# Run in watch mode (auto-recompile on changes)
npm run watch
```

Then press F5 to launch.

## 🎮 Using the Extension

Once the Extension Development Host opens:

1. **Open Command Palette**: `Ctrl+Shift+P`
2. **Type**: `Take Your Time: Open Game`
3. **Enjoy**: The game emulator from https://www.smbgames.be/ will open

You can open multiple game tabs by running the command multiple times!

## 🧪 Running Tests

```powershell
npm test
```

All 4 tests should pass ✅

## 📦 Package for Distribution (Optional)

To create a `.vsix` file for sharing:

```powershell
# Install vsce globally
npm install -g @vscode/vsce

# Package the extension
vsce package
```

This creates a `take-your-time-0.1.0.vsix` file that you can:
- Share with others
- Install via: Extensions → ... → Install from VSIX

## 🔧 Troubleshooting

**Problem**: F5 shows debugger selection menu
**Solution**: The `.vscode/launch.json` file has been created. Close and reopen VS Code, then try F5 again.

**Problem**: Extension doesn't activate
**Solution**: Check the Debug Console (Ctrl+Shift+Y) for errors

**Problem**: Game doesn't load
**Solution**: Check your internet connection - the game loads from https://www.smbgames.be/
