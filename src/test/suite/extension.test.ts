import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Extension should be present', () => {
        const extensionId = 'kiro.take-your-time';
        const extension = vscode.extensions.getExtension(extensionId);

        if (!extension) {
            console.error(`Extension ${extensionId} not found.`);
            console.error('Available extensions:', vscode.extensions.all.map(e => e.id).join(', '));
        }

        assert.ok(extension, `Extension ${extensionId} should be present`);
    });

    test('Command should be registered', async () => {
        // Wait for extension to activate if needed
        const extension = vscode.extensions.getExtension('kiro.take-your-time');
        await extension?.activate();

        const commands = await vscode.commands.getCommands(true);
        if (!commands.includes('takeYourTime.openGame')) {
            console.error('Command takeYourTime.openGame not found in commands.');
        }
        assert.ok(commands.includes('takeYourTime.openGame'), 'Command takeYourTime.openGame should be registered');
    });
});
