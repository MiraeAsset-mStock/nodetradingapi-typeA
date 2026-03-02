/**
 * @fileoverview API route definitions for the trading platform.
 * This module contains all endpoint paths for authentication, orders, portfolio, market data, and user operations.
 * Routes include parameter placeholders marked with curly braces {} that need to be replaced with actual values.
 * @module routes
 */

/**
 * API route paths organized by functionality.
 * These routes define the endpoints for various trading operations.
 * 
 * @namespace ROUTES
 * @property {string} login - User login endpoint for authentication via web interface
 * @property {string} sessionToken - Session token generation endpoint after successful login
 * @property {string} totpToken - TOTP verification endpoint for two-factor authentication
 * @property {string} orderplacement - Order placement endpoint with {variety} parameter (regular/co/amo/iceberg/auction)
 * @property {string} ordermodify - Order modification endpoint with {variety} and {order_id} parameters
 * @property {string} ordercancel - Order cancellation endpoint for regular orders with {order_id} parameter
 * @property {string} cancellall - Cancel all pending orders endpoint
 * @property {string} getorders - Get all orders history endpoint
 * @property {string} getorderdetails - Get detailed information for specific order
 * @property {string} ordermargin - Calculate margin required for placing orders
 * @property {string} losergainer - Get top losers and gainers for the day
 * @property {string} netpositions - Get current net positions across all instruments
 * @property {string} holdings - Get current portfolio holdings
 * @property {string} historicalcandledata - Get historical candle data with {exchange}, {instrument_token} and {interval} parameters
 * @property {string} intradychartdata - Get intraday chart data with {exchange}, {instrument_token}, and {interval} parameters
 * @property {string} scriptmaster - Get complete script master data for all instruments
 * @property {string} ohlcdata - Get OHLC (Open, High, Low, Close) quote data
 * @property {string} ltpdata - Get Last Traded Price (LTP) data
 * @property {string} fundsummary - Get user fund summary and available margins
 * @property {string} positionconversion - Convert positions from one product type to another
 * @property {string} trades - Get executed trades information
 * @property {string} tradebook - Get detailed trade book with P&L information
 * @property {string} logout - User logout endpoint to terminate session
 * @property {string} createbasket - Create a new basket of orders
 * @property {string} fetchbasket - Fetch existing basket details
 * @property {string} renamebasket - Rename an existing basket
 * @property {string} deletebasket - Delete a basket
 * @property {string} calculatebasket - Calculate margin and other details for basket orders
 * @property {string} optionchainmaster - Get option chain master data with {exchange} parameter
 * @property {string} optionchain - Get option chain data with {exchange}, {expiry}, and {token} parameters
 * 
 * @example
 * // Using routes for API calls
 * import { ROUTES } from './constants/routes';
 * 
 * // Login endpoint
 * const loginUrl = ROUTES.login;
 * 
 * // Order placement with variety parameter
 * const placeOrderUrl = ROUTES.orderplacement.replace('{variety}', 'regular');
 * 
 * // Historical data with parameters
 * const historicalUrl = ROUTES.historicalcandledata
 *   .replace('{exchange}', 'NSE')
 *   .replace('{instrument_token}', '256265')
 *   .replace('{interval}', '15minute');
 * 
 * @example
 * // Complete API endpoint construction
 * import { ROUTES, DEFAULTS } from './constants/routes';
 * 
 * const baseUrl = DEFAULTS.baseURL;
 * const fullUrl = `${baseUrl}${ROUTES.getorders}`;
 */
export const ROUTES = {
    /** @type {string} User login endpoint - GET request for OAuth/login flow */
    login: "/openapi/typea/connect/login",
    /** @type {string} Session token endpoint - POST request to generate session token */
    sessionToken: "/openapi/typea/session/token",
    /** @type {string} TOTP verification endpoint - POST request for 2FA verification */
    totpToken: "/openapi/typea/session/verifytotp",
    /** @type {string} Order placement endpoint - POST request with {variety} path parameter */
    orderplacement: "/openapi/typea/orders/{variety}",
    /** @type {string} Order modification endpoint - PUT request with {variety} and {order_id} parameters */
    ordermodify: "/openapi/typea/orders/{variety}/{order_id}",
    /** @type {string} Order cancellation endpoint - DELETE request with {order_id} parameter */
    ordercancel: "/openapi/typea/orders/regular/{order_id}",
    /** @type {string} Cancel all orders endpoint - DELETE request to cancel all pending orders */
    cancellall: "/openapi/typea/orders/cancelall",
    /** @type {string} Get all orders endpoint - GET request for order history */
    getorders: "/openapi/typea/orders",
    /** @type {string} Get order details endpoint - GET request for specific order information */
    getorderdetails: "/openapi/typea/order/details",
    /** @type {string} Order margin calculation endpoint - POST request to calculate required margin */
    ordermargin: "/openapi/typea/margins/orders",
    /** @type {string} Top losers/gainers endpoint - GET request for daily market movers */
    losergainer: "/openapi/typea/losergainer",
    /** @type {string} Net positions endpoint - GET request for current open positions */
    netpositions: "/openapi/typea/portfolio/positions",
    /** @type {string} Holdings endpoint - GET request for portfolio holdings */
    holdings: "/openapi/typea/portfolio/holdings",
    /** @type {string} Historical candle data endpoint - GET request with {instrument_token} and {interval} parameters */
    historicalcandledata: "/openapi/typea/instruments/historical/{exchange}/{instrument_token}/{interval}",
    /** @type {string} Intraday chart data endpoint - GET request with {exchange}, {instrument_token}, and {interval} parameters */
    intradychartdata: "/openapi/typea/instruments/intraday/{exchange}/{instrument_token}/{interval}",
    /** @type {string} Script master endpoint - GET request for complete instrument list */
    scriptmaster: "/openapi/typea/instruments/scriptmaster",
    /** @type {string} OHLC data endpoint - GET request for Open, High, Low, Close quotes */
    ohlcdata: "/openapi/typea/instruments/quote/ohlc",
    /** @type {string} LTP data endpoint - GET request for Last Traded Price */
    ltpdata: "/openapi/typea/instruments/quote/ltp",
    /** @type {string} Fund summary endpoint - GET request for account balance and margins */
    fundsummary: "/openapi/typea/user/fundsummary",
    /** @type {string} Position conversion endpoint - PUT request to convert position types */
    positionconversion: "/openapi/typea/portfolio/convertposition",
    /** @type {string} Trades endpoint - GET request for executed trades */
    trades: "/openapi/typea/trades",
    /** @type {string} Tradebook endpoint - GET request for detailed trade history with P&L */
    tradebook: "/openapi/typea/tradebook",
    /** @type {string} Logout endpoint - DELETE request to terminate user session */
    logout: "/openapi/typea/logout",
    /** @type {string} Create basket endpoint - POST request to create order basket */
    createbasket: "/openapi/typea/CreateBasket",
    /** @type {string} Fetch basket endpoint - GET request to retrieve basket details */
    fetchbasket: "/openapi/typea/FetchBasket",
    /** @type {string} Rename basket endpoint - PUT request to update basket name */
    renamebasket: "/openapi/typea/RenameBasket",
    /** @type {string} Delete basket endpoint - DELETE request to remove basket */
    deletebasket: "/openapi/typea/DeleteBasket",
    /** @type {string} Calculate basket endpoint - POST request to compute basket margins */
    calculatebasket: "/openapi/typea/CalculateBasket",
    /** @type {string} Option chain master endpoint - GET request with {exchange} parameter */
    optionchainmaster: "/openapi/typea/getoptionchainmaster/{exchange}",
    /** @type {string} Option chain data endpoint - GET request with {exchange}, {expiry}, and {token} parameters */
    optionchain: "/openapi/typea/GetOptionChain/{exchange}/{expiry}/{token}"
};

/**
 * Default configuration values for API connections.
 * These values provide standard settings for API client initialization.
 * 
 * @namespace DEFAULTS
 * @property {string} baseURL - Base URL for REST API endpoints
 * @property {string} wsURL - WebSocket URL for real-time data streaming
 * @property {number} timeout - Request timeout in milliseconds (7000ms = 7 seconds)
 * @property {boolean} debug - Debug mode flag for verbose logging
 * 
 * @example
 * // Using defaults for API client configuration
 * import { DEFAULTS } from './constants/routes';
 * 
 * const config = {
 *   baseURL: DEFAULTS.baseURL,
 *   timeout: DEFAULTS.timeout,
 *   debug: DEFAULTS.debug
 * };
 */
export const DEFAULTS = {
    /** @type {string} Primary API base URL for production environment */
    baseURL: 'https://api.mstock.trade',
    /** @type {string} WebSocket URL for real-time market data streaming */
    wsURL: 'wss://ws.mstock.trade',
    /** @type {number} Request timeout in milliseconds - 7 seconds default */
    timeout: 7000,
    /** @type {boolean} Debug mode disabled by default for production */
    debug: false
};
