import * as vscode from 'vscode';
import { ExtensionConfig } from '../config/ExtensionConfig';

export class WebviewPanelFactory {
    /**
     * Creates a webview panel with proper configuration
     */
    static create(
        context: vscode.ExtensionContext,
        _panelId: string,
        title: string,
        _config: ExtensionConfig
    ): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'takeYourTimeGame',
            title,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(context.extensionUri, 'media'),
                    vscode.Uri.joinPath(context.extensionUri, 'resources')
                ]
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
