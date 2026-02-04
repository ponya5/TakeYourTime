import * as vscode from 'vscode';
import { z } from 'zod';

const ConfigSchema = z.object({
    gameUrl: z.string().url().default('https://www.smbgames.be/'),
    fallbackUrl: z.string().url().optional().nullable(),
    enableErrorReporting: z.boolean().default(true)
});

type Config = z.infer<typeof ConfigSchema>;

export class ExtensionConfig {
    private config: Config;

    constructor() {
        this.config = this.loadConfig();
    }

    private loadConfig(): Config {
        try {
            const vscodeConfig = vscode.workspace.getConfiguration('takeYourTime');

            const rawConfig = {
                gameUrl: vscodeConfig.get<string>('gameUrl') || undefined,
                fallbackUrl: vscodeConfig.get<string>('fallbackUrl') || undefined,
                enableErrorReporting: vscodeConfig.get<boolean>('enableErrorReporting') ?? true
            };

            return ConfigSchema.parse(rawConfig);
        } catch (error) {
            // If config parsing fails, use defaults
            console.warn('Failed to parse configuration, using defaults:', error);
            return {
                gameUrl: 'https://www.smbgames.be/',
                fallbackUrl: undefined,
                enableErrorReporting: true
            };
        }
    }

    public getGameUrl(): string {
        return this.config.gameUrl;
    }

    public getFallbackUrl(): string | undefined | null {
        return this.config.fallbackUrl;
    }

    public isErrorReportingEnabled(): boolean {
        return this.config.enableErrorReporting;
    }

    public reload(): void {
        this.config = this.loadConfig();
    }
}
