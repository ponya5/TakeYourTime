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
