# Take Your Time 🎮

A VS Code extension that lets you play arcade games while waiting for AI agents, builds, or long-running tasks to complete. Transform idle time into fun breaks without leaving your IDE.

## Features

- 🎯 **Quick Access**: Activity bar icon for instant game launch
- 🎮 **Multiple Game Sites**: Switch between OnlineGames.io, CrazyGames, Playpager, and SMB Games
- 📑 **Multiple Tabs**: Open several games simultaneously
- 🔒 **Safe & Secure**: Runs in sandboxed webviews with Content Security Policy
- ⚡ **Non-Blocking**: Games run independently without interfering with your work

## Installation

### From VSIX File (Recommended for Direct Sharing)

1. Download the `.vsix` file from the [Releases](../../releases) page
2. Open VS Code
3. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
4. Type "Install from VSIX" and select `Extensions: Install from VSIX...`
5. Navigate to the downloaded `.vsix` file and select it
6. Reload VS Code when prompted

**Alternative method:**
```bash
code --install-extension take-your-time-0.1.0.vsix
```

For detailed installation instructions, see [INSTALL.md](INSTALL.md).

## Usage

1. Click the game controller icon (🎮) in the Activity Bar
2. A new editor tab opens with the game site
3. Play while your tasks run in the background
4. Open multiple game tabs if you want variety

**Command Palette:**
- Press `Ctrl+Shift+P` / `Cmd+Shift+P`
- Type "Take Your Time: Open Game"

## Configuration

Access settings via `File > Preferences > Settings` and search for "Take Your Time":

### Available Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `takeYourTime.gameUrl` | string | `https://onlinegames.io/` | Primary game site URL |
| `takeYourTime.games` | array | See below | List of game sites to choose from |
| `takeYourTime.fallbackUrl` | string | - | Backup URL if primary site fails |
| `takeYourTime.enableErrorReporting` | boolean | `true` | Enable error notifications |

### Default Game Sites

- **OnlineGames.io** - Wide variety of browser games
- **Playpager** - Board games and puzzles
- **CrazyGames** - Action and arcade games
- **SMB Games** - Classic retro games

### Custom Game Sites

Add your own game sites in VS Code settings:

```json
{
  "takeYourTime.games": [
    {
      "name": "My Favorite Games",
      "url": "https://example.com/games"
    }
  ]
}
```

## Development

### Prerequisites

- Node.js 20.x or higher
- npm
- VS Code 1.85.0 or higher

### Building from Source

```bash
# Clone the repository
git clone https://github.com/yourusername/take-your-time.git
cd take-your-time

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Run tests
npm test

# Package extension
npm install -g @vscode/vsce
vsce package
```

This creates a `.vsix` file you can install or share.

### Project Structure

```
take-your-time/
├── src/
│   ├── extension.ts              # Entry point
│   ├── commands/                 # Command handlers
│   ├── webview/                  # Webview management
│   ├── config/                   # Configuration
│   └── errors/                   # Error handling
├── media/                        # Icons and images
├── package.json                  # Extension manifest
└── tsconfig.json                 # TypeScript config
```

## Technology Stack

- **Language**: TypeScript 5.3+
- **Platform**: VS Code Extension API
- **Runtime**: Node.js 20.x
- **Validation**: Zod for type-safe configuration

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

Created by [Daniel Shalom](https://www.linkedin.com/in/daniel-shalom-13987a1a/)

Connect with me on LinkedIn for questions, feedback, or collaboration opportunities!

## License

This project is open source and available under the MIT License.

## Known Issues

None currently. Please report issues on the [GitHub Issues](../../issues) page.

## Release Notes

### 0.1.0 (Initial Release)

- Activity bar integration with game controller icon
- Support for multiple game sites
- Configurable game URLs
- Sandboxed webview with CSP
- Multiple simultaneous game tabs
- Type-safe configuration with Zod validation

---

**Enjoy your gaming breaks!** 🎮✨
