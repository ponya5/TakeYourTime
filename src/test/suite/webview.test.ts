import * as assert from 'assert';
import { WebviewContentGenerator } from '../../webview/WebviewContentGenerator';
import * as vscode from 'vscode';

suite('WebviewContentGenerator', () => {
    test('Generate HTML contains CSP and Game URL', () => {
        const mockWebview = { cspSource: 'mock-csp-source' } as vscode.Webview;
        const gameUrl = 'https://www.smbgames.be/';

        const html = WebviewContentGenerator.generate(mockWebview, gameUrl);

        // Assert CSP
        assert.ok(html.includes('<meta http-equiv="Content-Security-Policy"'), 'HTML should contain CSP meta tag');
        assert.ok(html.includes("frame-src https://www.smbgames.be/"), 'CSP should allow game URL frame');

        // Assert Iframe
        assert.ok(html.includes(`<iframe`), 'HTML should contain iframe');
        assert.ok(html.includes(`src="${gameUrl}"`), 'Iframe should have correct src');
        assert.ok(html.includes('sandbox="allow-scripts allow-same-origin allow-forms"'), 'Iframe should have sandbox attributes');
    });

    test('Escapes HTML in Game URL', () => {
        const mockWebview = { cspSource: 'mock-csp-source' } as vscode.Webview;
        const maliciousUrl = 'https://example.com"><script>alert(1)</script>';

        const html = WebviewContentGenerator.generate(mockWebview, maliciousUrl);

        assert.ok(!html.includes('<script>alert(1)</script>'), 'Malicious script should be escaped');
        assert.ok(html.includes('&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;'), 'Special characters should be escaped');
    });
});
