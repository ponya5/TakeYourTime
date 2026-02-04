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
