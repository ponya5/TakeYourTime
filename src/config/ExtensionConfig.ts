import * as vscode from 'vscode';
import { z } from 'zod';

const GamePresetSchema = z.object({
    name: z.string(),
    url: z.string().url()
});

const ConfigSchema = z.object({
    gameUrl: z.string().url().default('https://onlinegames.io/'),
    games: z.array(GamePresetSchema).default([
        { name: 'OnlineGames.io', url: 'https://onlinegames.io/' }
    ]),
    fallbackUrl: z.string().url().optional().nullable(),
    enableErrorReporting: z.boolean().default(true)
});

export type GamePreset = z.infer<typeof GamePresetSchema>;
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
                gameUrl: vscodeConfig.get<string>('gameUrl') || 'https://onlinegames.io/',
                games: vscodeConfig.get<GamePreset[]>('games') || [],
                fallbackUrl: vscodeConfig.get<string>('fallbackUrl') || undefined,
                enableErrorReporting: vscodeConfig.get<boolean>('enableErrorReporting') ?? true
            };

            // Ensure there's at least one game if the array is empty
            if (rawConfig.games.length === 0) {
                rawConfig.games.push(
                    { name: 'OnlineGames.io', url: 'https://onlinegames.io/' },
                    { name: 'Playpager', url: 'https://playpager.com/' },
                    { name: 'CrazyGames', url: 'https://www.crazygames.com/' },
                    { name: 'SMB Games', url: 'https://www.smbgames.be/' }
                );
            }

            return ConfigSchema.parse(rawConfig);
        } catch (error) {
            console.warn('Failed to parse configuration, using defaults:', error);
            const defaults = {
                gameUrl: 'https://onlinegames.io/',
                games: [{ name: 'OnlineGames.io', url: 'https://onlinegames.io/' }],
                fallbackUrl: undefined,
                enableErrorReporting: true
            };
            return defaults;
        }
    }

    public getGameUrl(): string {
        return this.config.gameUrl;
    }

    public getGamePresets(): GamePreset[] {
        return this.config.games;
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
