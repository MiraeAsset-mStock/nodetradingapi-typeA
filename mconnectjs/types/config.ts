export interface MConnectConfig {
    api_key: string;
    baseUrl?: string;
    accessToken?: string | null;
    timeout?: number;
    debug?: boolean;
}

export interface MTickerConfig {
    api_key: string;
    access_token: string;
    baseUrl?: string;
    maxReconnectionAttempts?: number;
    reconnectDelay?: number;
}