import * as vscode from 'vscode';

export class WebviewContentGenerator {
  /**
   * Generates HTML content for the webview
   */
  static generate(webview: vscode.Webview, gameUrl: string, gamePresets: { name: string, url: string }[], resources?: { smbBg: vscode.Uri, crazyGamesBg: vscode.Uri }): string {
    const csp = this.generateCSP(webview);
    const nonce = this.getNonce();

    const normalizedUrl = gameUrl.toLowerCase();
    const isSmbGame = normalizedUrl.includes('smbgames.be') || normalizedUrl.includes('mario');
    const isCrazyGame = normalizedUrl.includes('crazygames.com');
    const isBlocked = isSmbGame || isCrazyGame;

    // Generate options for the dropdown
    const options = gamePresets.map(preset =>
      `<option value="${this.escapeHtml(preset.url)}" ${preset.url === gameUrl ? 'selected' : ''}>${this.escapeHtml(preset.name)}</option>`
    ).join('');

    let mainContent = '';

    if (isBlocked) {
      let bgUri = '';
      let titleText = 'External Browser Required';

      if (isSmbGame && resources?.smbBg) {
        bgUri = webview.asWebviewUri(resources.smbBg).toString();
        titleText = 'Mario Games Preview';
      } else if (isCrazyGame && resources?.crazyGamesBg) {
        bgUri = webview.asWebviewUri(resources.crazyGamesBg).toString();
        titleText = 'CrazyGames Preview';
      }

      const bgStyle = bgUri ? `
            background-image: url('${bgUri}'); 
            background-size: cover; 
            background-position: center;
            background-repeat: no-repeat;
            background-color: #1e1e1e;
        ` : 'background-color: #1e1e1e;';

      mainContent = `
        <div class="blocked-container" style="${bgStyle}">
            <div class="blocked-overlay">
                <div class="blocked-content">
                    <div class="blocked-icon">⚠️</div>
                    <h2>${titleText}</h2>
                    <p>This game website cannot be played directly inside VS Code.</p>
                    <button class="btn-primary" onclick="openExternal('${this.escapeHtml(gameUrl)}')">
                        🚀 Open in Browser
                    </button>
                    <div style="margin-top: 10px; font-size: 0.8em; opacity: 0.7">
                        ${this.escapeHtml(gameUrl)}
                    </div>
                </div>
            </div>
        </div>`;
    } else {
      mainContent = `
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
        </div>`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <title>Take Your Time</title>
  <style>
    ${this.getStyles()}
    
    .blocked-container {
        width: 100%;
        height: 100%;
        position: relative;
    }
    .blocked-overlay {
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }
    .blocked-content {
        text-align: center;
        padding: 40px;
        max-width: 600px;
        background: rgba(30, 30, 30, 0.9);
        border-radius: 12px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    }
    .blocked-icon {
        font-size: 48px;
        margin-bottom: 16px;
    }
    .btn-primary {
        margin-top: 24px;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 600;
        background: var(--vscode-button-background);
        color: var(--vscode-button-foreground);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: transform 0.1s;
    }
    .btn-primary:hover {
        background: var(--vscode-button-hoverBackground);
        transform: scale(1.05);
    }
    h2 { 
        margin-bottom: 16px; 
        font-size: 24px;
        font-weight: 500;
    }
    p { 
        font-size: 16px;
        line-height: 1.5;
        opacity: 0.9; 
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div class="title">
      <span>🎮</span>
      <select id="game-selector" onchange="switchGame(this.value)" style="margin-left: 8px; padding: 4px; border-radius: 4px; background: var(--vscode-dropdown-background); color: var(--vscode-dropdown-foreground); border: 1px solid var(--vscode-dropdown-border);">
        ${options}
      </select>
    </div>
    <div class="actions">
      <button class="btn" onclick="reloadGame()">🔄 Reload</button>
      <button class="btn" onclick="openExternal('${this.escapeHtml(gameUrl)}')">🌐 Open in Browser</button>
    </div>
  </div>
  
  <div class="game-container">
    ${mainContent}
  </div>

  <script nonce="${nonce}">
    ${this.getScript(gameUrl)}
  </script>
</body>
</html>`;
  }

  private static generateCSP(webview: vscode.Webview): string {
    return [
      `default-src 'none'`,
      `script-src 'unsafe-inline' 'unsafe-eval'`,
      `style-src 'unsafe-inline'`,
      `img-src ${webview.cspSource} https: data:`,
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

  private static getScript(gameUrl: string): string {
    return `
      const vscode = acquireVsCodeApi();
      const gameFrame = document.getElementById('game-frame');
      let loader = document.getElementById('loading-overlay');
      
      // Handle iframe load
      if (gameFrame) {
          gameFrame.onload = () => {
            // If loader got removed or lost reference, try to find it again
            if (!loader) loader = document.getElementById('loading-overlay');
            
            if (loader) {
                // Short delay to ensure render
                setTimeout(() => {
                loader.classList.add('hidden');
                // Remove from DOM after transition
                setTimeout(() => {
                    if(loader && loader.parentNode) {
                        loader.parentNode.removeChild(loader);
                        loader = null; // Clear reference
                    }
                }, 500);
                }, 1000);
            }
          };
      }

      function reloadGame() {
        if (gameFrame) {
          showLoader();
          gameFrame.src = gameFrame.src;
        } else {
          // If we are in blocked view, reload just re-requests the same URL via extension
          // which effectively refreshes the view
          vscode.postMessage({
             command: 'switchGame',
             // we need the current url, but we don't store it in a var easily here
             // assume the user just clicked reload on the current view
             url: '${this.escapeHtml(gameUrl)}' 
          });
        }
      }

      function switchGame(url) {
        vscode.postMessage({
           command: 'switchGame',
           url: url
        });
      }
      
      function showLoader() {
           // If loader doesn't exist, create it
           if (!document.getElementById('loading-overlay')) {
             const overlay = document.createElement('div');
             overlay.id = 'loading-overlay';
             overlay.innerHTML = '<div class="loader"></div><div>Loading Game Arcade...</div>';
             // Apply styles inline to match initial state
             overlay.style.position = 'absolute';
             overlay.style.top = '0';
             overlay.style.left = '0';
             overlay.style.width = '100%';
             overlay.style.height = '100%';
             overlay.style.background = 'var(--bg-color)';
             overlay.style.display = 'flex';
             overlay.style.flexDirection = 'column';
             overlay.style.alignItems = 'center';
             overlay.style.justifyContent = 'center';
             overlay.style.gap = '16px';
             overlay.style.zIndex = '10';
             overlay.style.transition = 'opacity 0.5s ease-out';
             
             const container = document.querySelector('.game-container');
             if (container) {
                container.appendChild(overlay);
                loader = overlay;
             }
           } else {
             // It exists, make sure it's visible
             loader = document.getElementById('loading-overlay');
             if (loader) {
                loader.classList.remove('hidden');
                loader.style.opacity = '1';
             }
           }
      }

      function openExternal(url) {
        const targetUrl = url || (gameFrame ? gameFrame.src : null);
        if (targetUrl) {
            vscode.postMessage({
            command: 'openExternal',
            url: targetUrl
            });
        }
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
