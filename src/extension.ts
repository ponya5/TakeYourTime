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
            () => {
                return commandHandler.handleOpenGame();
            }
        );

        context.subscriptions.push(disposable);
        vscode.window.showInformationMessage('Take Your Time extension activated!');
    } catch (error) {
        console.error('TYT: Extension activation failed:', error);
        vscode.window.showErrorMessage('Failed to activate Take Your Time extension');
        throw new ExtensionError('Failed to activate extension', { error });
    }
}

export function deactivate(): void {
    // Cleanup if needed
}
