/**
 * @fileoverview Configuration interfaces for the MConnect trading platform.
 * This module provides TypeScript interfaces for configuring API clients, authentication,
 * and connection settings for both REST API and WebSocket connections.
 * @module config
 */

/**
 * Configuration interface for MConnect REST API client.
 * Defines all configuration options needed to initialize and customize the API client.
 * 
 * @interface MConnectConfig
 * @property {string} api_key - Required API key for authentication with the trading platform
 * @property {string} [baseUrl] - Optional base URL for API endpoints (defaults to production URL)
 * @property {string|null} [accessToken] - Optional access token for authenticated requests (null for public endpoints)
 * @property {number} [timeout] - Optional request timeout in milliseconds (default: 7000ms)
 * @property {boolean} [debug] - Optional debug mode flag for verbose logging (default: false)
 * 
 * @example
 * // Basic configuration with required API key
 * const config: MConnectConfig = {
 *   api_key: 'your-api-key-here',
 *   baseUrl: 'https://api.mstock.trade',
 *   timeout: 10000,
 *   debug: true
 * };
 * 
 * @example
 * // Configuration for authenticated requests
 * const config: MConnectConfig = {
 *   api_key: 'your-api-key-here',
 *   accessToken: 'your-access-token-here',
 *   timeout: 15000,
 *   debug: false
 * };
 */
export interface MConnectConfig {
    /** 
     * Required API key for authenticating with the MConnect trading platform.
     * This key is provided when you register for API access and must be kept secure.
     * @type {string}
     */
    api_key: string;
    
    /** 
     * Optional base URL for API endpoints.
     * If not provided, defaults to the production API URL.
     * Useful for testing with sandbox environments.
     * @type {string}
     * @default 'https://api.mstock.trade'
     */
    baseUrl?: string;
    
    /** 
     * Optional access token for authenticated API requests.
     * Set to null for public endpoints that don't require authentication.
     * Access tokens are obtained after successful login and have expiration times.
     * @type {string|null}
     * @default null
     */
    accessToken?: string | null;
    
    /** 
     * Optional request timeout in milliseconds.
     * Controls how long to wait for API responses before timing out.
     * @type {number}
     * @default 7000
     */
    timeout?: number;
    
    /** 
     * Optional debug mode flag for verbose logging.
     * When enabled, logs detailed information about API requests and responses.
     * @type {boolean}
     * @default false
     */
    debug?: boolean;
}

/**
 * Configuration interface for MTicker WebSocket client.
 * Defines all configuration options needed to establish and maintain WebSocket connections
 * for real-time market data streaming.
 * 
 * @interface MTickerConfig
 * @property {string} api_key - Required API key for WebSocket authentication
 * @property {string} access_token - Required access token for WebSocket connection
 * @property {string} [baseUrl] - Optional WebSocket base URL (defaults to production WebSocket URL)
 * @property {number} [maxReconnectionAttempts] - Optional maximum reconnection attempts (default: 5)
 * @property {number} [reconnectDelay] - Optional delay between reconnection attempts in milliseconds (default: 1000ms)
 * 
 * @example
 * // Basic WebSocket configuration
 * const wsConfig: MTickerConfig = {
 *   api_key: 'your-api-key-here',
 *   access_token: 'your-access-token-here',
 *   baseUrl: 'wss://ws.mstock.trade',
 *   maxReconnectionAttempts: 3,
 *   reconnectDelay: 2000
 * };
 * 
 * @example
 * // WebSocket configuration with custom reconnection settings
 * const wsConfig: MTickerConfig = {
 *   api_key: 'your-api-key-here',
 *   access_token: 'your-access-token-here',
 *   maxReconnectionAttempts: 10,
 *   reconnectDelay: 5000
 * };
 */
export interface MTickerConfig {
    /** 
     * Required API key for WebSocket authentication.
     * Same API key used for REST API authentication.
     * @type {string}
     */
    api_key: string;
    
    /** 
     * Required access token for WebSocket connection.
     * Obtained after successful login via REST API.
     * This token is used to establish the WebSocket connection.
     * @type {string}
     */
    access_token: string;
    
    /** 
     * Optional WebSocket base URL.
     * If not provided, defaults to the production WebSocket URL.
     * @type {string}
     * @default 'wss://ws.mstock.trade'
     */
    baseUrl?: string;
    
    /** 
     * Optional maximum reconnection attempts for WebSocket connection.
     * Controls how many times the client will try to reconnect after connection failures.
     * @type {number}
     * @default 5
     */
    maxReconnectionAttempts?: number;
    
    /** 
     * Optional delay between reconnection attempts in milliseconds.
     * Controls the time to wait before attempting to reconnect after connection failure.
     * @type {number}
     * @default 1000
     */
    reconnectDelay?: number;
}
