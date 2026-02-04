export interface GameConfig {
    gameUrl: string;
    fallbackUrl?: string;
    enableErrorReporting: boolean;
}

export interface WebviewState {
    gameUrl: string;
    timestamp: number;
}
