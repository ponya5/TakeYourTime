# Technology Stack

## Core Technologies

- **Language**: TypeScript 5.3+ with strict mode enabled
- **Platform**: VS Code Extension API (v1.85.0+)
- **Runtime**: Node.js 20.x
- **Package Manager**: npm

## Key Dependencies

### Production
- `zod` (^3.22.0) - Runtime type validation and schema parsing

### Development
- `@types/vscode` - VS Code API type definitions
- `@types/node` - Node.js type definitions
- `@typescript-eslint/eslint-plugin` & `@typescript-eslint/parser` - TypeScript linting
- `eslint` - Code quality and style enforcement
- `@vscode/test-electron` - Extension testing framework

## Build System

### Compilation
- TypeScript compiler (`tsc`) compiles source to CommonJS
- Output directory: `out/`
- Source maps enabled for debugging

### Common Commands

```bash
# Compile TypeScript
npm run compile

# Watch mode for development
npm run watch

# Run linter
npm run lint

# Run tests
npm test

# Pre-publish build (compile + lint + test)
npm run vscode:prepublish
```

## TypeScript Configuration

- **Target**: ES2022
- **Module**: CommonJS
- **Strict mode**: Enabled with all strict checks
- **No implicit any**: Enforced
- **Unused locals/parameters**: Error on unused code

## Code Quality Tools

### ESLint Rules
- No explicit `any` types (error)
- Explicit function return types (warning)
- No unused variables (error, except `_` prefix)
- Console usage limited to error/warn

### Testing
- Framework: VS Code Test Electron
- Minimum coverage target: 80%
- Unit tests for all core functionality
- Integration tests for VS Code API interactions

## Security

- Content Security Policy (CSP) for webviews
- Input validation with Zod schemas
- HTML escaping for dynamic content
- Sandboxed iframes with minimal permissions

## Extension Packaging

- Bundler: TypeScript compiler (no webpack/esbuild currently)
- Package format: VSIX
- Distribution: VS Code Marketplace
