import * as vscode from 'vscode';

export class WebviewContentGenerator {
  /**
   * Generates HTML content for the webview
   */
  static generate(_webview: vscode.Webview, gameUrl: string): string {
    const csp = this.generateCSP();
    const nonce = this.getNonce();

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
  <div class="toolbar">
    <div class="title">🎮 Take Your Time</div>
    <div class="actions">
      <button class="btn" onclick="reloadGame()">🔄 Reload</button>
      <button class="btn" onclick="openExternal('${this.escapeHtml(gameUrl)}')">🌐 Open in Browser</button>
    </div>
  </div>
  
  <div class="game-container">
    <iframe 
      id="game-frame"
      src="${this.escapeHtml(gameUrl)}" 
      frameborder="0" 
      allowfullscreen
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    ></iframe>
    
    <div id="loading-overlay">
      <div class="loader"></div>
      <div>Loading Game Arcade...</div>
    </div>
  </div>

  <script nonce="${nonce}">
    ${this.getScript()}
  </script>
</body>
</html>`;
  }



  private static generateCSP(): string {
    return [
      `default-src 'none'`,
      `script-src 'unsafe-inline' 'unsafe-eval'`,
      `style-src 'unsafe-inline'`,
      `img-src https: data:`,
      `frame-src * https: http:`,
      `font-src https: data:`
    ].join('; ');
  }

  private static getStyles(): string {

    return `
      :root {
        --header-height: 48px;
        --bg-color: var(--vscode-editor-background);
        --text-color: var(--vscode-editor-foreground);
        --border-color: var(--vscode-widget-border);
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      html, body {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: var(--bg-color);
        color: var(--text-color);
        font-family: var(--vscode-font-family);
      }

      .toolbar {
        height: var(--header-height);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        border-bottom: 1px solid var(--border-color);
        background-color: var(--vscode-editorHeader-background);
      }

      .title {
        font-weight: 600;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .actions {
        display: flex;
        gap: 8px;
      }

      .btn {
        background: var(--vscode-button-secondaryBackground);
        color: var(--vscode-button-secondaryForeground);
        border: none;
        padding: 4px 12px;
        border-radius: 2px;
        cursor: pointer;
        font-family: inherit;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: opacity 0.2s;
      }

      .btn:hover {
        opacity: 0.9;
        background: var(--vscode-button-secondaryHoverBackground);
      }

      .game-container {
        width: 100%;
        height: calc(100% - var(--header-height));
        position: relative;
        background: #000;
      }

      iframe {
        width: 100%;
        height: 100%;
        border: none;
        background: #fff;
      }

      #loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-color);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        z-index: 10;
        pointer-events: none;
        opacity: 1;
        transition: opacity 0.5s ease-out;
      }

      #loading-overlay.hidden {
        opacity: 0;
      }

      .loader {
        width: 32px;
        height: 32px;
        border: 3px solid var(--vscode-progressBar-background);
        border-bottom-color: transparent;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
      }

      @keyframes rotation {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
  }

  private static getScript(): string {

    return `
      const vscode = acquireVsCodeApi();
      const gameFrame = document.getElementById('game-frame');
      const loader = document.getElementById('loading-overlay');
      
      // Handle iframe load
      gameFrame.onload = () => {
        // Short delay to ensure render
        setTimeout(() => {
          loader.classList.add('hidden');
          // Remove from DOM after transition
          setTimeout(() => {
            if(loader.parentNode) loader.parentNode.removeChild(loader);
          }, 500);
        }, 1000);
      };

      function reloadGame() {
        if (gameFrame) {
          gameFrame.src = gameFrame.src;
          // Re-show loader? Maybe not needed for quick reload
        }
      }

      function openExternal(url) {
        vscode.postMessage({
          command: 'openExternal',
          url: url
        });
      }
      
      console.log('TYT: Webview loaded successfully');
    `;
  }

  private static getNonce() {
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
