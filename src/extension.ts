import * as vscode from 'vscode';
import { TYTWebviewManager } from './webview/WebviewManager';
import { ExtensionConfig } from './config/ExtensionConfig';
import { CommandHandler } from './commands/CommandHandler';
import { ExtensionError } from './errors/ExtensionError';

export function activate(context: vscode.ExtensionContext): void {
    console.log('TYT: Extension activation starting...');
    try {
        const config = new ExtensionConfig();
        console.log('TYT: Config loaded, game URL:', config.getGameUrl());

        const webviewManager = new TYTWebviewManager(context, config);
        console.log('TYT: WebviewManager created');

        const commandHandler = new CommandHandler(webviewManager);
        console.log('TYT: CommandHandler created');

        const disposable = vscode.commands.registerCommand(
            'takeYourTime.openGame',
            () => {
                console.log('TYT: Command "takeYourTime.openGame" triggered!');
                return commandHandler.handleOpenGame();
            }
        );

        context.subscriptions.push(disposable);
        console.log('TYT: Extension activated successfully! Command registered.');
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
