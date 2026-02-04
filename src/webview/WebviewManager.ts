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
    ) { }

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

        const resources = {
            smbBg: vscode.Uri.joinPath(this.context.extensionUri, 'media', 'smb_preview.png'),
            crazyGamesBg: vscode.Uri.joinPath(this.context.extensionUri, 'media', 'crazyGames.png')
        };

        const updateContent = (url: string) => {
            panel.webview.html = WebviewContentGenerator.generate(
                panel.webview,
                url,
                this.config.getGamePresets(),
                resources
            );
        };

        // Initial content
        updateContent(this.config.getGameUrl());

        console.log('TYT: Webview HTML set successfully');

        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(
            message => {
                if (message.command === 'openExternal') {
                    vscode.env.openExternal(vscode.Uri.parse(message.url));
                } else if (message.command === 'switchGame') {
                    updateContent(message.url);
                }
            },
            undefined,
            this.context.subscriptions
        );

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
