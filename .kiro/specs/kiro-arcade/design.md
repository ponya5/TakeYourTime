# Technical Design: Take Your Time (TYT) Extension

## Architecture Overview

The Take Your Time extension is a VS Code extension built with TypeScript that embeds a web-based game emulator in editor tabs. The architecture follows VS Code's extension API patterns with strict type safety and proper error handling.

```
┌─────────────────────────────────────────────────────────┐
│                    VS Code Extension Host                │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │              TYT Extension                          │ │
│  │                                                      │ │
│  │  ┌──────────────┐      ┌──────────────────────┐   │ │
│  │  │  Extension   │      │  Webview Manager     │   │ │
│  │  │  Activation  │─────▶│                      │   │ │
│  │  │              │      │  - Panel Creation    │   │ │
│  │  └──────────────┘      │  - CSP Configuration │   │ │
│  │                        │  - HTML Generation   │   │ │
│  │  ┌──────────────┐      │  - State Management  │   │ │
│  │  │  Command     │      │                      │   │ │
│  │  │  Handler     │─────▶│                      │   │ │
│  │  │              │      └──────────────────────┘   │ │
│  │  └──────────────┘               │                 │ │
│  │                                  │                 │ │
│  │  ┌──────────────┐               │                 │ │
│  │  │  Config      │               │                 │ │
│  │  │  Manager     │               │                 │ │
│  │  │              │               │                 │ │
│  │  └──────────────┘               │                 │ │
│  │                                  ▼                 │ │
│  │                        ┌──────────────────────┐   │ │
│  │                        │  Webview Panel       │   │ │
│  │                        │                      │   │ │
│  │                        │  ┌────────────────┐ │   │ │
│  │                        │  │  iframe        │ │   │ │
│  │                        │  │  (Game Site)   │ │   │ │
│  │                        │  └────────────────┘ │   │ │
│  │                        └──────────────────────┘   │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## System Components

### 1. Extension Entry Point (`extension.ts`)

The main extension module that handles activation and registration.

```typescript
import * as vscode from 'vscode';
import { TYTWebviewManager } from './webview/WebviewManager';
import { ExtensionConfig } from './config/ExtensionConfig';
import { CommandHandler } from './commands/CommandHandler';
import { ExtensionError } from './errors/ExtensionError';

export function activate(context: vscode.ExtensionContext): void {
  try {
    const config = new ExtensionConfig();
    const webviewManager = new TYTWebviewManager(context, config);
    const commandHandler = new CommandHandler(webviewManager);

    const disposable = vscode.commands.registerCommand(
      'takeYourTime.openGame',
      () => commandHandler.handleOpenGame()
    );

    context.subscriptions.push(disposable);
  } catch (error) {
    throw new ExtensionError('Failed to activate extension', { error });
  }
}

export function deactivate(): void {
  // Cleanup if needed
}
```

### 2. Webview Manager (`webview/WebviewManager.ts`)

Manages webview panel lifecycle, creation, and configuration.

```typescript
import * as vscode from 'vscode';
import { ExtensionConfig } from '../config/ExtensionConfig';
import { WebviewPanelFactory } from './WebviewPanelFactory';
import { WebviewContentGenerator } from './WebviewContentGenerator';

/**
 * Manages the lifecycle of TYT webview panels
 */
export class TYTWebviewManager {
  private panels: Map<string, vscode.WebviewPanel> = new Map();
  private panelCounter = 0;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly config: ExtensionConfig
  ) {}

  /**
   * Creates and displays a new game webview panel
   * @returns The created webview panel
   */
  public createGamePanel(): vscode.WebviewPanel {
    this.panelCounter++;
    const panelId = `tyt-panel-${this.panelCounter}`;
    const title = this.panelCounter === 1 
      ? 'Take Your Time' 
      : `Take Your Time (${this.panelCounter})`;

    const panel = WebviewPanelFactory.create(
      this.context,
      panelId,
      title,
      this.config
    );

    const content = WebviewContentGenerator.generate(
      panel.webview,
      this.config.getGameUrl()
    );
    
    panel.webview.html = content;

    // Handle panel disposal
    panel.onDidDispose(() => {
      this.panels.delete(panelId);
    });

    this.panels.set(panelId, panel);
    return panel;
  }

  /**
   * Gets all active panels
   */
  public getActivePanels(): vscode.WebviewPanel[] {
    return Array.from(this.panels.values());
  }

  /**
   * Disposes all panels
   */
  public disposeAll(): void {
    this.panels.forEach(panel => panel.dispose());
    this.panels.clear();
  }
}
```

### 3. Webview Panel Factory (`webview/WebviewPanelFactory.ts`)

Factory for creating properly configured webview panels.

```typescript
import * as vscode from 'vscode';
import { ExtensionConfig } from '../config/ExtensionConfig';

export class WebviewPanelFactory {
  /**
   * Creates a webview panel with proper configuration
   */
  static create(
    context: vscode.ExtensionContext,
    panelId: string,
    title: string,
    config: ExtensionConfig
  ): vscode.WebviewPanel {
    const panel = vscode.window.createWebviewPanel(
      'takeYourTimeGame',
      title,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: []
      }
    );

    // Set icon if available
    const iconPath = this.getIconPath(context);
    if (iconPath) {
      panel.iconPath = iconPath;
    }

    return panel;
  }

  private static getIconPath(
    context: vscode.ExtensionContext
  ): vscode.Uri | undefined {
    try {
      return vscode.Uri.joinPath(context.extensionUri, 'resources', 'icon.png');
    } catch {
      return undefined;
    }
  }
}
```

### 4. Webview Content Generator (`webview/WebviewContentGenerator.ts`)

Generates HTML content with proper CSP and styling.

```typescript
import * as vscode from 'vscode';

export class WebviewContentGenerator {
  /**
   * Generates HTML content for the webview
   */
  static generate(webview: vscode.Webview, gameUrl: string): string {
    const csp = this.generateCSP(webview);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <title>Take Your Time</title>
  <style>
    ${this.getStyles()}
  </style>
</head>
<body>
  <div id="game-container">
    <iframe 
      id="game-frame"
      src="${this.escapeHtml(gameUrl)}"
      title="Game Emulator"
      sandbox="allow-scripts allow-same-origin allow-forms"
    ></iframe>
  </div>
  <script>
    ${this.getScript()}
  </script>
</body>
</html>`;
  }

  private static generateCSP(webview: vscode.Webview): string {
    const nonce = this.getNonce();
    return [
      `default-src 'none'`,
      `frame-src https://www.smbgames.be/`,
      `script-src 'unsafe-inline'`,
      `style-src 'unsafe-inline'`,
      `img-src https: data:`
    ].join('; ');
  }

  private static getStyles(): string {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      html, body {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      
      #game-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      
      #game-frame {
        width: 100%;
        height: 100%;
        border: none;
        flex: 1;
      }
    `;
  }

  private static getScript(): string {
    return `
      (function() {
        const iframe = document.getElementById('game-frame');
        
        iframe.addEventListener('error', function(e) {
          console.error('Failed to load game:', e);
          document.body.innerHTML = '<div style="padding: 20px; text-align: center;">' +
            '<h2>Unable to load game</h2>' +
            '<p>The game site may be unavailable. Please try again later.</p>' +
            '</div>';
        });
      })();
    `;
  }

  private static getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  private static escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
```

### 5. Command Handler (`commands/CommandHandler.ts`)

Handles command execution with proper error handling.

```typescript
import * as vscode from 'vscode';
import { TYTWebviewManager } from '../webview/WebviewManager';
import { CommandError } from '../errors/CommandError';

export class CommandHandler {
  constructor(private readonly webviewManager: TYTWebviewManager) {}

  /**
   * Handles the open game command
   */
  async handleOpenGame(): Promise<void> {
    try {
      const panel = this.webviewManager.createGamePanel();
      panel.reveal();
    } catch (error) {
      const commandError = new CommandError(
        'Failed to open game panel',
        'takeYourTime.openGame',
        { error }
      );
      
      vscode.window.showErrorMessage(
        'Failed to open Take Your Time game. Please try again.'
      );
      
      throw commandError;
    }
  }
}
```

### 6. Configuration Manager (`config/ExtensionConfig.ts`)

Type-safe configuration with validation using Zod.

```typescript
import * as vscode from 'vscode';
import { z } from 'zod';
import { ConfigurationError } from '../errors/ConfigurationError';

const ConfigSchema = z.object({
  gameUrl: z.string().url().default('https://www.smbgames.be/'),
  fallbackUrl: z.string().url().optional(),
  enableErrorReporting: z.boolean().default(true)
});

type Config = z.infer<typeof ConfigSchema>;

export class ExtensionConfig {
  private config: Config;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): Config {
    try {
      const vscodeConfig = vscode.workspace.getConfiguration('takeYourTime');
      
      const rawConfig = {
        gameUrl: vscodeConfig.get<string>('gameUrl'),
        fallbackUrl: vscodeConfig.get<string>('fallbackUrl'),
        enableErrorReporting: vscodeConfig.get<boolean>('enableErrorReporting')
      };

      return ConfigSchema.parse(rawConfig);
    } catch (error) {
      throw new ConfigurationError('Invalid extension configuration', { error });
    }
  }

  public getGameUrl(): string {
    return this.config.gameUrl;
  }

  public getFallbackUrl(): string | undefined {
    return this.config.fallbackUrl;
  }

  public isErrorReportingEnabled(): boolean {
    return this.config.enableErrorReporting;
  }

  public reload(): void {
    this.config = this.loadConfig();
  }
}
```

### 7. Error Handling (`errors/`)

Custom error classes for different error scenarios.

```typescript
// errors/ExtensionError.ts
export class ExtensionError extends Error {
  readonly code = 'EXTENSION_ERROR';
  
  constructor(
    message: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ExtensionError';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context
    };
  }
}

// errors/CommandError.ts
export class CommandError extends ExtensionError {
  readonly code = 'COMMAND_ERROR';
  
  constructor(
    message: string,
    public readonly commandId: string,
    context?: Record<string, unknown>
  ) {
    super(message, { ...context, commandId });
    this.name = 'CommandError';
  }
}

// errors/ConfigurationError.ts
export class ConfigurationError extends ExtensionError {
  readonly code = 'CONFIGURATION_ERROR';
  
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, context);
    this.name = 'ConfigurationError';
  }
}
```

## Project Structure

```
take-your-time/
├── src/
│   ├── extension.ts              # Extension entry point
│   ├── commands/
│   │   └── CommandHandler.ts     # Command handling logic
│   ├── webview/
│   │   ├── WebviewManager.ts     # Webview lifecycle management
│   │   ├── WebviewPanelFactory.ts # Panel creation
│   │   └── WebviewContentGenerator.ts # HTML generation
│   ├── config/
│   │   └── ExtensionConfig.ts    # Configuration management
│   ├── errors/
│   │   ├── ExtensionError.ts     # Base error class
│   │   ├── CommandError.ts       # Command errors
│   │   └── ConfigurationError.ts # Config errors
│   └── types/
│       └── index.ts              # Type definitions
├── resources/
│   └── icon.png                  # Extension icon
├── test/
│   ├── suite/
│   │   ├── extension.test.ts
│   │   ├── webview.test.ts
│   │   └── config.test.ts
│   └── runTest.ts
├── .vscode/
│   ├── launch.json
│   └── tasks.json
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .gitignore
└── README.md
```

## Package.json Configuration

```json
{
  "name": "take-your-time",
  "displayName": "Take Your Time",
  "description": "Play arcade games while waiting for AI agents or long-running tasks",
  "version": "0.1.0",
  "publisher": "your-publisher-name",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": ["Other"],
  "activationEvents": [],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "takeYourTime.openGame",
        "title": "Take Your Time: Open Game",
        "icon": "$(game)"
      }
    ],
    "configuration": {
      "title": "Take Your Time",
      "properties": {
        "takeYourTime.gameUrl": {
          "type": "string",
          "default": "https://www.smbgames.be/",
          "description": "URL of the game emulator site"
        },
        "takeYourTime.fallbackUrl": {
          "type": "string",
          "description": "Fallback URL if primary site is unavailable"
        },
        "takeYourTime.enableErrorReporting": {
          "type": "boolean",
          "default": true,
          "description": "Enable error reporting"
        }
      }
    }
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./",
    "pretest": "npm run compile && npm run lint",
    "lint": "eslint src --ext ts",
    "test": "node ./out/test/runTest.js"
  },
  "devDependencies": {
    "@types/vscode": "^1.85.0",
    "@types/node": "^20.x",
    "@typescript-eslint/eslint-plugin": "^6.x",
    "@typescript-eslint/parser": "^6.x",
    "eslint": "^8.x",
    "typescript": "^5.3.0",
    "@vscode/test-electron": "^2.3.0"
  },
  "dependencies": {
    "zod": "^3.22.0"
  }
}
```

## TypeScript Configuration

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2022",
    "outDir": "out",
    "lib": ["ES2022"],
    "sourceMap": true,
    "rootDir": "src",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules", ".vscode-test"]
}
```

## ESLint Configuration

```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["error", "warn"] }]
  }
}
```

## Security Considerations

### Content Security Policy
- Strict CSP that only allows the game site iframe
- No inline scripts except for error handling
- Sandboxed iframe with minimal permissions

### Input Validation
- All configuration values validated with Zod
- URL validation for game site configuration
- HTML escaping for any dynamic content

### Error Handling
- Custom error classes with context
- No sensitive information in error messages
- Proper error boundaries

## Performance Considerations

### Webview Optimization
- `retainContextWhenHidden: true` to preserve game state
- Minimal HTML generation overhead
- No unnecessary re-renders

### Memory Management
- Proper disposal of webview panels
- Cleanup on extension deactivation
- Map-based panel tracking for O(1) lookups

## Testing Strategy

### Unit Tests
```typescript
// test/suite/webview.test.ts
import * as assert from 'assert';
import { WebviewContentGenerator } from '../../webview/WebviewContentGenerator';

suite('WebviewContentGenerator', () => {
  test('generates valid HTML', () => {
    const mockWebview = { cspSource: 'mock' } as any;
    const html = WebviewContentGenerator.generate(mockWebview, 'https://example.com');
    
    assert.ok(html.includes('<!DOCTYPE html>'));
    assert.ok(html.includes('https://example.com'));
  });

  test('escapes HTML in URLs', () => {
    const mockWebview = { cspSource: 'mock' } as any;
    const html = WebviewContentGenerator.generate(mockWebview, '<script>alert("xss")</script>');
    
    assert.ok(!html.includes('<script>'));
    assert.ok(html.includes('&lt;script&gt;'));
  });
});
```

### Integration Tests
- Test extension activation
- Test command registration
- Test webview panel creation
- Test configuration loading

### Manual Testing Checklist
- [ ] Extension activates without errors
- [ ] Activity bar icon appears
- [ ] Clicking icon opens game tab
- [ ] Multiple tabs can be opened
- [ ] Game loads correctly
- [ ] Tabs can be closed
- [ ] Configuration changes apply
- [ ] Error handling works

## Deployment Strategy

### Build Process
1. Compile TypeScript to JavaScript
2. Run linting checks
3. Run test suite
4. Package extension with vsce

### Version Management
- Semantic versioning (MAJOR.MINOR.PATCH)
- Changelog maintenance
- Git tags for releases

### Distribution
- VS Code Marketplace publication
- GitHub releases for source code
- Documentation updates

## Monitoring and Observability

### Logging
- Error logging with context
- Command execution logging
- Configuration change logging

### Metrics to Track
- Extension activation time
- Command execution count
- Error frequency
- Panel creation count

## Future Enhancements

### Potential Features
- Multiple game site options
- Game favorites/bookmarks
- Keyboard shortcuts
- Custom themes
- Game history tracking
- Multiplayer support

### Technical Improvements
- Lazy loading of webview content
- Caching strategies
- Performance monitoring
- Analytics integration
