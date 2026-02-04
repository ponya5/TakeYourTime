# Project Structure

## Directory Layout

```
take-your-time/
├── src/                          # Source code
│   ├── extension.ts              # Extension entry point (activate/deactivate)
│   ├── commands/                 # Command handlers
│   │   └── CommandHandler.ts     # Handles takeYourTime.openGame command
│   ├── webview/                  # Webview management
│   │   ├── WebviewManager.ts     # Panel lifecycle and state management
│   │   ├── WebviewPanelFactory.ts # Panel creation with proper config
│   │   └── WebviewContentGenerator.ts # HTML/CSP generation
│   ├── config/                   # Configuration management
│   │   └── ExtensionConfig.ts    # Type-safe config with Zod validation
│   ├── errors/                   # Custom error classes
│   │   ├── ExtensionError.ts     # Base error class
│   │   ├── CommandError.ts       # Command-specific errors
│   │   └── ConfigurationError.ts # Config-specific errors
│   └── types/                    # TypeScript type definitions
│       └── index.ts              # Shared types and interfaces
├── resources/                    # Static assets
│   └── icon.png                  # Extension and activity bar icon
├── test/                         # Test suite
│   ├── suite/                    # Test files
│   │   ├── extension.test.ts     # Extension activation tests
│   │   ├── webview.test.ts       # Webview functionality tests
│   │   └── config.test.ts        # Configuration tests
│   └── runTest.ts                # Test runner
├── out/                          # Compiled JavaScript (generated)
├── .vscode/                      # VS Code workspace config
│   ├── launch.json               # Debug configurations
│   └── tasks.json                # Build tasks
├── .kiro/                        # Kiro configuration
│   ├── specs/                    # Feature specifications
│   ├── steering/                 # Development guidelines
│   ├── hooks/                    # Agent hooks
│   └── rules/                    # Project rules
├── package.json                  # Extension manifest and dependencies
├── tsconfig.json                 # TypeScript configuration
├── .eslintrc.json                # ESLint configuration
├── .gitignore                    # Git ignore patterns
└── README.md                     # Extension documentation
```

## Module Organization

### Core Modules

**extension.ts**
- Extension activation and deactivation
- Dependency injection setup
- Command registration
- Top-level error handling

**commands/**
- Command handlers with error boundaries
- User-facing command logic
- Integration with webview manager

**webview/**
- Webview panel lifecycle management
- HTML content generation with CSP
- Panel factory for consistent configuration
- State management for multiple panels

**config/**
- Type-safe configuration loading
- Zod schema validation
- Configuration change handling
- Default values management

**errors/**
- Custom error hierarchy
- Error context preservation
- Structured error reporting
- Type-safe error handling

### Naming Conventions

- **Files**: PascalCase for classes (e.g., `WebviewManager.ts`)
- **Directories**: lowercase for categories (e.g., `commands/`, `webview/`)
- **Classes**: PascalCase (e.g., `TYTWebviewManager`)
- **Interfaces**: PascalCase with descriptive names (e.g., `WebviewConfig`)
- **Functions**: camelCase (e.g., `createGamePanel`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_GAME_URL`)

## Import Patterns

- Use absolute imports from `src/` root
- Group imports: external → vscode → internal
- Explicit file extensions not required (TypeScript resolution)

Example:
```typescript
import * as vscode from 'vscode';
import { TYTWebviewManager } from './webview/WebviewManager';
import { ExtensionConfig } from './config/ExtensionConfig';
```

## Configuration Files

**package.json**
- Extension manifest (name, version, publisher)
- Activation events
- Contributed commands and configurations
- Dependencies and scripts

**tsconfig.json**
- Strict TypeScript settings
- ES2022 target
- CommonJS modules
- Source maps enabled

**.eslintrc.json**
- TypeScript-specific rules
- No explicit any enforcement
- Unused variable detection

## Testing Structure

- Tests mirror source structure in `test/suite/`
- Each module has corresponding `.test.ts` file
- Integration tests for VS Code API interactions
- Unit tests for pure logic functions

## Build Artifacts

**out/** directory contains:
- Compiled JavaScript files
- Source maps (.js.map)
- Type declarations (if generated)

This directory is git-ignored and regenerated on each build.
