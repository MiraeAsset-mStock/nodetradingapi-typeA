/**
 * @fileoverview Trading API constants and enumerations for order types, exchanges, intervals, and other trading parameters.
 * This module provides standardized constants used throughout the trading API for consistent parameter handling.
 * @module constants
 */

/**
 * Trading constants organized by category for use with the trading API.
 * These constants represent standardized values for various trading parameters.
 * 
 * @namespace Constants
 * @property {string} PRODUCT_MIS - Margin Intraday Square-off product type for intraday trading
 * @property {string} PRODUCT_CNC - Cash and Carry product type for delivery-based trading
 * @property {string} PRODUCT_NRML - Normal product type for overnight positions in derivatives
 * 
 * @property {string} ORDER_TYPE_MARKET - Market order type for immediate execution at current market price
 * @property {string} ORDER_TYPE_LIMIT - Limit order type for execution at specified price or better
 * @property {string} ORDER_TYPE_SLM - Stop Loss Market order type for market orders triggered at stop price
 * @property {string} ORDER_TYPE_SL - Stop Loss Limit order type for limit orders triggered at stop price
 * 
 * @property {string} VARIETY_REGULAR - Regular order variety for standard orders
 * @property {string} VARIETY_CO - Cover Order variety for bracket orders with stop loss
 * @property {string} VARIETY_AMO - After Market Order variety for orders placed outside market hours
 * @property {string} VARIETY_ICEBERG - Iceberg order variety for large orders split into smaller legs
 * @property {string} VARIETY_AUCTION - Auction order variety for participating in exchange auctions
 * 
 * @property {string} TRANSACTION_TYPE_BUY - Buy transaction type for purchasing securities
 * @property {string} TRANSACTION_TYPE_SELL - Sell transaction type for selling securities
 * 
 * @property {string} VALIDITY_DAY - Day order validity, expires at end of trading day
 * @property {string} VALIDITY_IOC - Immediate or Cancel order validity, fills immediately or cancels
 * @property {string} VALIDITY_TTL - Time to Live order validity with custom expiration
 * 
 * @property {string} EXCHANGE_NSE - National Stock Exchange of India
 * @property {string} EXCHANGE_NFO - NSE Futures and Options segment
 * @property {string} EXCHANGE_BSE - Bombay Stock Exchange
 * @property {string} EXCHANGE_BFO - BSE Futures and Options segment
 * @property {string} EXCHANGE_CDS - Currency Derivatives Segment
 * @property {string} EXCHANGE_MCX - Multi Commodity Exchange
 * 
 * @property {string} MODE_FULL - Full mode for complete market data including depth
 * @property {string} MODE_QUOTE - Quote mode for basic price and volume data
 * @property {string} MODE_LTP - Last Traded Price mode for minimal price data
 * 
 * @property {string} INTERVAL_MINUTE - 1-minute candle interval for historical data
 * @property {string} INTERVAL_3MINUTE - 3-minute candle interval for historical data
 * @property {string} INTERVAL_5MINUTE - 5-minute candle interval for historical data
 * @property {string} INTERVAL_10MINUTE - 10-minute candle interval for historical data
 * @property {string} INTERVAL_15MINUTE - 15-minute candle interval for historical data
 * @property {string} INTERVAL_30MINUTE - 30-minute candle interval for historical data
 * @property {string} INTERVAL_60MINUTE - 1-hour candle interval for historical data
 * @property {string} INTERVAL_DAY - Daily candle interval for historical data
 * 
 * @example
 * // Using constants for placing an order
 * import { Constants } from './constants';
 * 
 * const order = {
 *   product: Constants.PRODUCT_MIS,
 *   order_type: Constants.ORDER_TYPE_MARKET,
 *   variety: Constants.VARIETY_REGULAR,
 *   transaction_type: Constants.TRANSACTION_TYPE_BUY,
 *   exchange: Constants.EXCHANGE_NSE,
 *   validity: Constants.VALIDITY_DAY
 * };
 * 
 * @example
 * // Using constants for fetching historical data
 * import { Constants } from './constants';
 * 
 * const historicalData = {
 *   exchange: Constants.EXCHANGE_NSE,
 *   interval: Constants.INTERVAL_15MINUTE,
 *   mode: Constants.MODE_FULL
 * };
 */
export const Constants = {
    /** @type {string} Margin Intraday Square-off for intraday trading with leverage */
    PRODUCT_MIS: "MIS",
    /** @type {string} Cash and Carry for delivery-based equity trading */
    PRODUCT_CNC: "CNC",
    /** @type {string} Normal for overnight positions in derivatives */
    PRODUCT_NRML: "NRML",

    /** @type {string} Market order for immediate execution at best available price */
    ORDER_TYPE_MARKET: "MARKET",
    /** @type {string} Limit order for execution at specified price or better */
    ORDER_TYPE_LIMIT: "LIMIT",
    /** @type {string} Stop Loss Market order triggered at stop price, executed at market */
    ORDER_TYPE_SLM: "SL-M",
    /** @type {string} Stop Loss Limit order triggered at stop price, executed with limit */
    ORDER_TYPE_SL: "SL",

    /** @type {string} Regular order for standard buy/sell orders */
    VARIETY_REGULAR: "regular",
    /** @type {string} Cover Order with built-in stop loss for risk management */
    VARIETY_CO: "co",
    /** @type {string} After Market Order for trading outside regular market hours */
    VARIETY_AMO: "amo",
    /** @type {string} Iceberg order for splitting large orders into smaller visible quantities */
    VARIETY_ICEBERG: "iceberg",
    /** @type {string} Auction order for participating in exchange auction sessions */
    VARIETY_AUCTION: "auction",

    /** @type {string} Buy transaction for purchasing securities */
    TRANSACTION_TYPE_BUY: "BUY",
    /** @type {string} Sell transaction for selling securities */
    TRANSACTION_TYPE_SELL: "SELL",

    /** @type {string} Day validity - order expires at end of trading session */
    VALIDITY_DAY: "DAY",
    /** @type {string} Immediate or Cancel - fills immediately or gets cancelled */
    VALIDITY_IOC: "IOC",
    /** @type {string} Time to Live - custom expiration time for orders */
    VALIDITY_TTL: "TTL",

    /** @type {string} National Stock Exchange - primary equity exchange in India */
    EXCHANGE_NSE: "NSE",
    /** @type {string} NSE Futures and Options - derivatives segment of NSE */
    EXCHANGE_NFO: "NFO",
    /** @type {string} Bombay Stock Exchange - oldest stock exchange in Asia */
    EXCHANGE_BSE: "BSE",
    /** @type {string} BSE Futures and Options - derivatives segment of BSE */
    EXCHANGE_BFO: "BFO",
    /** @type {string} Currency Derivatives Segment - for currency trading */
    EXCHANGE_CDS: "CDS",
    /** @type {string} Multi Commodity Exchange - for commodity trading */
    EXCHANGE_MCX: "MCX",

    /** @type {string} Full mode - complete market depth with bid/ask prices */
    MODE_FULL: "full",
    /** @type {string} Quote mode - basic price and volume information */
    MODE_QUOTE: "quote",
    /** @type {string} LTP mode - Last Traded Price only */
    MODE_LTP: "ltp",

    /** @type {string} 1-minute candle interval for detailed short-term analysis */
    INTERVAL_MINUTE: "minute",
    /** @type {string} 3-minute candle interval for short-term analysis */
    INTERVAL_3MINUTE: "3minute",
    /** @type {string} 5-minute candle interval for intraday trading */
    INTERVAL_5MINUTE: "5minute",
    /** @type {string} 10-minute candle interval for medium-term intraday analysis */
    INTERVAL_10MINUTE: "10minute",
    /** @type {string} 15-minute candle interval for swing trading */
    INTERVAL_15MINUTE: "15minute",
    /** @type {string} 30-minute candle interval for positional trading */
    INTERVAL_30MINUTE: "30minute",
    /** @type {string} 1-hour candle interval for longer-term analysis */
    INTERVAL_60MINUTE: "60minute",
    /** @type {string} Daily candle interval for long-term investing */
    INTERVAL_DAY: "day",
};

export * from './routes';
