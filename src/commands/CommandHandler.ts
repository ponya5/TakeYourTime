import * as vscode from 'vscode';
import { TYTWebviewManager } from '../webview/WebviewManager';
import { CommandError } from '../errors/CommandError';

export class CommandHandler {
    constructor(private readonly webviewManager: TYTWebviewManager) { }

    /**
     * Handles the open game command
     */
    async handleOpenGame(): Promise<void> {
        try {
            console.log('TYT: handleOpenGame called');
            vscode.window.showInformationMessage('Opening Take Your Time game...');
            const panel = this.webviewManager.createGamePanel();
            panel.reveal();
            console.log('TYT: Panel created and revealed');
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
