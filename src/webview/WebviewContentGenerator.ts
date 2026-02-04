import * as vscode from 'vscode';

export class WebviewContentGenerator {
  /**
   * Generates HTML content for the webview
   */
  static generate(_webview: vscode.Webview, gameUrl: string): string {
    const csp = this.generateCSP();

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
  <div id="game-container">
    <iframe 
      id="game-frame"
      src="${this.escapeHtml(gameUrl)}"
      title="Game Emulator"
      sandbox="allow-scripts allow-same-origin allow-forms"
    ></iframe>
  </div>
  <script>
    ${this.getScript()}
  </script>
</body>
</html>`;
  }

  private static generateCSP(): string {
    return [
      `default-src 'none'`,
      `frame-src https://www.smbgames.be/`,
      `script-src 'unsafe-inline'`,
      `style-src 'unsafe-inline'`,
      `img-src https: data:`
    ].join('; ');
  }

  private static getStyles(): string {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      html, body {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      
      #game-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      
      #game-frame {
        width: 100%;
        height: 100%;
        border: none;
        flex: 1;
      }
    `;
  }

  private static getScript(): string {
    return `
      (function() {
        const iframe = document.getElementById('game-frame');
        
        iframe.addEventListener('error', function(e) {
          console.error('Failed to load game:', e);
          document.body.innerHTML = '<div style="padding: 20px; text-align: center;">' +
            '<h2>Unable to load game</h2>' +
            '<p>The game site may be unavailable. Please try again later.</p>' +
            '</div>';
        });
      })();
    `;
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
