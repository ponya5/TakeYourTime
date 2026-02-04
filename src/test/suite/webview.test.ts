import * as assert from 'assert';
import { WebviewContentGenerator } from '../../webview/WebviewContentGenerator';
import * as vscode from 'vscode';

suite('WebviewContentGenerator', () => {
    test('Generate HTML contains CSP and Game URL', () => {
        const mockWebview = { cspSource: 'mock-csp-source' } as vscode.Webview;
        const gameUrl = 'https://www.smbgames.be/';
        const presets = [{ name: 'Test', url: gameUrl }];

        const html = WebviewContentGenerator.generate(mockWebview, gameUrl, presets);

        // Assert CSP
        assert.ok(html.includes('<meta http-equiv="Content-Security-Policy"'), 'HTML should contain CSP meta tag');
        // CSP is now broader for compatibility
        assert.ok(html.includes("frame-src * https: http:"), 'CSP should allow frames');

        // Assert Iframe
        assert.ok(html.includes(`<iframe`), 'HTML should contain iframe');
        assert.ok(html.includes(`src="${gameUrl}"`), 'Iframe should have correct src');
    });

    test('Escapes HTML in Game URL', () => {
        const mockWebview = { cspSource: 'mock-csp-source' } as vscode.Webview;
        const maliciousUrl = 'https://example.com"><script>alert(1)</script>';
        const presets = [{ name: 'Test', url: maliciousUrl }];

        const html = WebviewContentGenerator.generate(mockWebview, maliciousUrl, presets);

        assert.ok(!html.includes('<script>alert(1)</script>'), 'Malicious script should be escaped');
        assert.ok(html.includes('&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;'), 'Special characters should be escaped');
    });
});
