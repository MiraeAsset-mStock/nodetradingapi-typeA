/**
 * @fileoverview TypeScript type definitions for the MConnect trading platform.
 * This module provides comprehensive interfaces for request parameters, response models,
 * and data structures used throughout the trading API.
 * @module types
 */

// --- Request Parameter Interfaces ---

/**
 * Login parameters for user authentication.
 * Used when initiating the login flow via username/password.
 * 
 * @interface loginParmas
 * @property {string} username - User's registered username or client ID
 * @property {string} password - User's password for authentication
 * 
 * @example
 * const loginData: loginParmas = {
 *   username: "user123",
 *   password: "securePassword123"
 * };
 */
export interface loginParmas {
    /** User's registered username or client ID */
    username: string;
    /** User's password for authentication */
    password: string
}

/**
 * Parameters for verifying OAuth request token.
 * Used after receiving request token from OAuth callback.
 * 
 * @interface verifyOTP
 * @property {string} api_key - API key for authentication
 * @property {string} request_token - Request token received from OAuth callback
 * @property {string} checksum - Checksum for request validation
 * 
 * @example
 * const verifyData: verifyOTP = {
 *   api_key: "your-api-key",
 *   request_token: "request_token_from_callback",
 *   checksum: "calculated_checksum"
 * };
 */
export interface verifyOTP {
    /** API key for authentication */
    api_key: string;
    /** Request token received from OAuth callback */
    request_token: string;
    /** Checksum for request validation */
    checksum: string;
}

/**
 * Parameters for verifying TOTP (Time-based One-Time Password).
 * Used for two-factor authentication after login.
 * 
 * @interface verifyTOTP
 * @property {string} api_key - API key for authentication
 * @property {string} totp - 6-digit TOTP code from authenticator app
 * 
 * @example
 * const totpData: verifyTOTP = {
 *   api_key: "your-api-key",
 *   totp: "123456"
 * };
 */
export interface verifyTOTP {
    /** API key for authentication */
    api_key: string;
    /** 6-digit TOTP code from authenticator app */
    totp: string;
}

/**
 * Parameters for placing a new order.
 * Comprehensive interface covering all order types and parameters.
 * 
 * @interface PlaceOrderParams
 * @property {string} exchange - Exchange where order should be placed (NSE, BSE, etc.)
 * @property {string} tradingsymbol - Trading symbol of the instrument
 * @property {'BUY' | 'SELL'} transaction_type - Transaction type (BUY or SELL)
 * @property {number} quantity - Order quantity in units
 * @property {number} [price] - Order price (required for LIMIT orders)
 * @property {string} [product] - Product type (MIS, CNC, NRML)
 * @property {string} [order_type] - Order type (MARKET, LIMIT, SL, SL-M)
 * @property {string} [validity] - Order validity (DAY, IOC, TTL)
 * @property {number} [disclosed_quantity] - Disclosed quantity for iceberg orders
 * @property {number} [trigger_price] - Trigger price for stop loss orders
 * @property {number} [squareoff] - Square off price for bracket orders
 * @property {number} [stoploss] - Stop loss price for bracket orders
 * @property {number} [trailing_stoploss] - Trailing stop loss value
 * @property {'regular' | 'co' | 'amo' | 'iceberg' | 'auction'} [variety] - Order variety
 * @property {string} [tag] - Custom tag for order identification
 * @property {number} [validity_ttl] - Time to live in seconds for TTL validity
 * @property {number} [iceberg_legs] - Number of legs for iceberg orders
 * @property {number} [iceberg_quantity] - Quantity per leg for iceberg orders
 * @property {string} [auction_number] - Auction number for auction orders
 * 
 * @example
 * const marketOrder: PlaceOrderParams = {
 *   exchange: "NSE",
 *   tradingsymbol: "INFY",
 *   transaction_type: "BUY",
 *   quantity: 100,
 *   order_type: "MARKET",
 *   product: "MIS",
 *   variety: "regular"
 * };
 * 
 * @example
 * const limitOrder: PlaceOrderParams = {
 *   exchange: "NSE",
 *   tradingsymbol: "RELIANCE",
 *   transaction_type: "SELL",
 *   quantity: 50,
 *   price: 2500,
 *   order_type: "LIMIT",
 *   product: "CNC",
 *   variety: "regular"
 * };
 */
export interface PlaceOrderParams {
    /** Exchange where order should be placed (NSE, BSE, etc.) */
    exchange: string;
    /** Trading symbol of the instrument */
    tradingsymbol: string;
    /** Transaction type (BUY or SELL) */
    transaction_type: 'BUY' | 'SELL';
    /** Order quantity in units */
    quantity: number;
    /** Order price (required for LIMIT orders) */
    price?: number;
    /** Product type (MIS, CNC, NRML) */
    product?: string;
    /** Order type (MARKET, LIMIT, SL, SL-M) */
    order_type?: string;
    /** Order validity (DAY, IOC, TTL) */
    validity?: string;
    /** Disclosed quantity for iceberg orders */
    disclosed_quantity?: number;
    /** Trigger price for stop loss orders */
    trigger_price?: number;
    /** Square off price for bracket orders */
    squareoff?: number;
    /** Stop loss price for bracket orders */
    stoploss?: number;
    /** Trailing stop loss value */
    trailing_stoploss?: number;
    /** Order variety */
    variety?: 'regular' | 'co' | 'amo' | 'iceberg' | 'auction';
    /** Custom tag for order identification */
    tag?: string;
    /** Time to live in seconds for TTL validity */
    validity_ttl?: number;
    /** Number of legs for iceberg orders */
    iceberg_legs?: number;
    /** Quantity per leg for iceberg orders */
    iceberg_quantity?: number;
    /** Auction number for auction orders */
    auction_number?: string;
}

/**
 * Parameters for modifying an existing order.
 * Used to update order parameters like price, quantity, or validity.
 * 
 * @interface ModifyOrderParams
 * @property {string} order_id - Unique order identifier to modify
 * @property {'regular' | 'co' | 'amo' | 'iceberg' | 'auction'} variety - Order variety
 * @property {string} [order_type] - Updated order type
 * @property {number} [quantity] - Updated quantity
 * @property {number} [price] - Updated price
 * @property {string} [validity] - Updated validity
 * @property {number} [disclosed_quantity] - Updated disclosed quantity
 * @property {number} [trigger_price] - Updated trigger price
 * 
 * @example
 * const modifyParams: ModifyOrderParams = {
 *   order_id: "123456789",
 *   variety: "regular",
 *   price: 2550,
 *   quantity: 75
 * };
 */
export interface ModifyOrderParams {
    /** Unique order identifier to modify */
    order_id: string;
    /** Order variety */
    variety: 'regular' | 'co' | 'amo' | 'iceberg' | 'auction';
    /** Updated order type */
    order_type?: string;
    /** Updated quantity */
    quantity?: number;
    /** Updated price */
    price?: number;
    /** Updated validity */
    validity?: string;
    /** Updated disclosed quantity */
    disclosed_quantity?: number;
    /** Updated trigger price */
    trigger_price?: number;
}

/**
 * Parameters for cancelling an order.
 * Used to cancel pending orders.
 * 
 * @interface CancelOrderParams
 * @property {string} order_id - Unique order identifier to cancel
 * @property {'regular' | 'co' | 'amo' | 'iceberg' | 'auction'} variety - Order variety
 * 
 * @example
 * const cancelParams: CancelOrderParams = {
 *   order_id: "123456789",
 *   variety: "regular"
 * };
 */
export interface CancelOrderParams {
    /** Unique order identifier to cancel */
    order_id: string;
    /** Order variety */
    variety: 'regular' | 'co' | 'amo' | 'iceberg' | 'auction';
}

/**
 * Parameters for getting specific order details.
 * Used to retrieve detailed information about a particular order.
 * 
 * @interface OrderDetailsReq
 * @property {string} order_no - Order number to query
 * @property {string} segment - Market segment (NSE, BSE, etc.)
 * 
 * @example
 * const orderDetails: OrderDetailsReq = {
 *   order_no: "123456789",
 *   segment: "NSE"
 * };
 */
export interface OrderDetailsReq {
    /** Order number to query */
    order_no: string;
    /** Market segment (NSE, BSE, etc.) */
    segment: string;
}

/**
 * Parameters for converting position types.
 * Used to convert positions between different product types.
 * 
 * @interface ConvertPositionParams
 * @property {string} tradingsymbol - Trading symbol of the position
 * @property {string} exchange - Exchange where position exists
 * @property {'BUY' | 'SELL'} transaction_type - Transaction type
 * @property {'day' | 'overnight'} position_type - Position type to convert to
 * @property {number} quantity - Quantity to convert
 * @property {string} old_product - Current product type
 * @property {string} new_product - New product type to convert to
 * 
 * @example
 * const convertParams: ConvertPositionParams = {
 *   tradingsymbol: "INFY",
 *   exchange: "NSE",
 *   transaction_type: "BUY",
 *   position_type: "overnight",
 *   quantity: 100,
 *   old_product: "MIS",
 *   new_product: "NRML"
 * };
 */
export interface ConvertPositionParams {
    /** Trading symbol of the position */
    tradingsymbol: string;
    /** Exchange where position exists */
    exchange: string;
    /** Transaction type */
    transaction_type: 'BUY' | 'SELL';
    /** Position type to convert to */
    position_type: 'day' | 'overnight';
    /** Quantity to convert */
    quantity: number;
    /** Current product type */
    old_product: string;
    /** New product type to convert to */
    new_product: string;
}

// --- Models ---

/**
 * Real-time market data feed structure.
 * Contains comprehensive market data including price, volume, and depth information.
 * 
 * @interface FeedData
 * @property {string} [Mode] - Data mode (full, quote, ltp)
 * @property {number} [InstrumentToken] - Unique instrument identifier
 * @property {boolean} [Tradable] - Whether instrument is currently tradable
 * @property {number} [LastPrice] - Last traded price
 * @property {number} [LastQuantity] - Last traded quantity
 * @property {number} [AveragePrice] - Average traded price
 * @property {number} [Volume] - Total traded volume
 * @property {number} [BuyQuantity] - Total buy quantity
 * @property {number} [SellQuantity] - Total sell quantity
 * @property {number} [Open] - Opening price
 * @property {number} [High] - High price
 * @property {number} [Low] - Low price
 * @property {number} [Close] - Closing price
 * @property {number} [Change] - Price change from previous close
 * @property {DepthItem[]} [Bids] - Array of bid depth items
 * @property {DepthItem[]} [Offers] - Array of offer depth items
 * @property {Date|null} [LastTradeTime] - Time of last trade
 * @property {number} [OI] - Open interest (for derivatives)
 * @property {number} [OIDayHigh] - Day's high open interest
 * @property {number} [OIDayLow] - Day's low open interest
 * @property {Date|null} [Timestamp] - Data timestamp
 */
export interface FeedData {
    /** Data mode (full, quote, ltp) */
    Mode?: string;
    /** Unique instrument identifier */
    InstrumentToken?: number;
    /** Whether instrument is currently tradable */
    Tradable?: boolean;
    /** Last traded price */
    LastPrice?: number;
    /** Last traded quantity */
    LastQuantity?: number;
    /** Average traded price */
    AveragePrice?: number;
    /** Total traded volume */
    Volume?: number;
    /** Total buy quantity */
    BuyQuantity?: number;
    /** Total sell quantity */
    SellQuantity?: number;
    /** Opening price */
    Open?: number;
    /** High price */
    High?: number;
    /** Low price */
    Low?: number;
    /** Closing price */
    Close?: number;
    /** Price change from previous close */
    Change?: number;
    /** Array of bid depth items */
    Bids?: DepthItem[];
    /** Array of offer depth items */
    Ask?: DepthItem[];
    /** Time of last trade */
    LastTradeTime?: Date | null;
    /** Open interest (for derivatives) */
    OI?: number;
    /** Day's high open interest */
    OIDayHigh?: number;
    /** Day's low open interest */
    OIDayLow?: number;
    /** Data timestamp */
    Timestamp?: Date | null;
}

/**
 * Market depth item for bid/offer data.
 * Represents a single level in the market depth.
 * 
 * @interface DepthItem
 * @property {number} Quantity - Quantity at this price level
 * @property {number} Price - Price at this level
 * @property {number} Orders - Number of orders at this level
 * 
 * @example
 * const depthItem: DepthItem = {
 *   Quantity: 1000,
 *   Price: 150.50,
 *   Orders: 5
 * };
 */
export interface DepthItem {
    /** Quantity at this price level */
    Quantity: number;
    /** Price at this level */
    Price: number;
    /** Number of orders at this level */
    Orders: number;
}

/**
 * Real-time order update structure.
 * Contains comprehensive information about order status changes.
 * 
 * @interface TypeAUpdate
 * @property {string} user_id - User ID who placed the order
 * @property {number} unfilled_quantity - Remaining unfilled quantity
 * @property {number} app_id - Application ID
 * @property {string} checksum - Message checksum for validation
 * @property {string} placed_by - User who placed the order
 * @property {string} order_id - Unique order identifier
 * @property {string} exchange_order_id - Exchange order identifier
 * @property {string} parent_order_id - Parent order ID (for bracket orders)
 * @property {string} status - Current order status
 * @property {string|null} status_message - Status message
 * @property {string|null} status_message_raw - Raw status message from exchange
 * @property {string} order_timestamp - Order placement timestamp
 * @property {string} exchange_update_timestamp - Exchange update timestamp
 * @property {string} exchange_timestamp - Exchange timestamp
 * @property {string} variety - Order variety
 * @property {string} exchange - Exchange name
 * @property {string} tradingsymbol - Trading symbol
 * @property {number} instrument_token - Instrument token
 * @property {string} order_type - Order type
 * @property {string} transaction_type - Transaction type
 * @property {string} validity - Order validity
 * @property {string} product - Product type
 * @property {number} quantity - Order quantity
 * @property {number} disclosed_quantity - Disclosed quantity
 * @property {number} price - Order price
 * @property {number} trigger_price - Trigger price
 * @property {number} average_price - Average execution price
 * @property {number} filled_quantity - Filled quantity
 * @property {number} pending_quantity - Pending quantity
 * @property {number} cancelled_quantity - Cancelled quantity
 * @property {number} market_protection - Market protection percentage
 * @property {string} guid - Global unique identifier
 */
export interface TypeAUpdate {
    /** User ID who placed the order */
    user_id: string;
    /** Remaining unfilled quantity */
    unfilled_quantity: number;
    /** Application ID */
    app_id: number;
    /** Message checksum for validation */
    checksum: string;
    /** User who placed the order */
    placed_by: string;
    /** Unique order identifier */
    order_id: string;
    /** Exchange order identifier */
    exchange_order_id: string;
    /** Parent order ID (for bracket orders) */
    parent_order_id: string;
    /** Current order status */
    status: string;
    /** Status message */
    status_message: string | null;
    /** Raw status message from exchange */
    status_message_raw: string | null;
    /** Order placement timestamp */
    order_timestamp: string;
    /** Exchange update timestamp */
    exchange_update_timestamp: string;
    /** Exchange timestamp */
    exchange_timestamp: string;
    /** Order variety */
    variety: string;
    /** Exchange name */
    exchange: string;
    /** Trading symbol */
    tradingsymbol: string;
    /** Instrument token */
    instrument_token: number;
    /** Order type */
    order_type: string;
    /** Transaction type */
    transaction_type: string;
    /** Order validity */
    validity: string;
    /** Product type */
    product: string;
    /** Order quantity */
    quantity: number;
    /** Disclosed quantity */
    disclosed_quantity: number;
    /** Order price */
    price: number;
    /** Trigger price */
    trigger_price: number;
    /** Average execution price */
    average_price: number;
    /** Filled quantity */
    filled_quantity: number;
    /** Pending quantity */
    pending_quantity: number;
    /** Cancelled quantity */
    cancelled_quantity: number;
    /** Market protection percentage */
    market_protection: number;
    /** Global unique identifier */
    guid: string;
}

/**
 * Order structure for order book and order history.
 * Contains complete order information including execution details.
 * 
 * @interface Order
 * @property {string} PlacedBy - User who placed the order
 * @property {string} OrderId - Unique order identifier
 * @property {string} ExchangeOrderId - Exchange order identifier
 * @property {string} ParentOrderId - Parent order ID
 * @property {string} Status - Current order status
 * @property {string} StatusMessage - Status message
 * @property {string} StatusMessageRaw - Raw status message
 * @property {string|null} OrderTimestamp - Order placement timestamp
 * @property {string|null} ExchangeUpdateTimestamp - Exchange update timestamp
 * @property {string|null} ExchangeTimestamp - Exchange timestamp
 * @property {string} Variety - Order variety
 * @property {boolean} Modified - Whether order has been modified
 * @property {string} Exchange - Exchange name
 * @property {string} Tradingsymbol - Trading symbol
 * @property {number} InstrumentToken - Instrument token
 * @property {string} OrderType - Order type
 * @property {string} TransactionType - Transaction type
 * @property {string} Validity - Order validity
 * @property {string} Product - Product type
 * @property {number} Quantity - Order quantity
 * @property {number} DisclosedQuantity - Disclosed quantity
 * @property {number} Price - Order price
 * @property {number} TriggerPrice - Trigger price
 * @property {number} AveragePrice - Average execution price
 * @property {number} FilledQuantity - Filled quantity
 * @property {number} PendingQuantity - Pending quantity
 * @property {number} CancelledQuantity - Cancelled quantity
 * @property {string} Tag - Custom tag
 * @property {string} guid - Global unique identifier
 */
export interface Order {
    /** User who placed the order */
    PlacedBy: string;
    /** Unique order identifier */
    OrderId: string;
    /** Exchange order identifier */
    ExchangeOrderId: string;
    /** Parent order ID */
    ParentOrderId: string;
    /** Current order status */
    Status: string;
    /** Status message */
    StatusMessage: string;
    /** Raw status message */
    StatusMessageRaw: string;
    /** Order placement timestamp */
    OrderTimestamp: string | null;
    /** Exchange update timestamp */
    ExchangeUpdateTimestamp: string | null;
    /** Exchange timestamp */
    ExchangeTimestamp: string | null;
    /** Order variety */
    Variety: string;
    /** Whether order has been modified */
    Modified: boolean;
    /** Exchange name */
    Exchange: string;
    /** Trading symbol */
    Tradingsymbol: string;
    /** Instrument token */
    InstrumentToken: number;
    /** Order type */
    OrderType: string;
    /** Transaction type */
    TransactionType: string;
    /** Order validity */
    Validity: string;
    /** Product type */
    Product: string;
    /** Order quantity */
    Quantity: number;
    /** Disclosed quantity */
    DisclosedQuantity: number;
    /** Order price */
    Price: number;
    /** Trigger price */
    TriggerPrice: number;
    /** Average execution price */
    AveragePrice: number;
    /** Filled quantity */
    FilledQuantity: number;
    /** Pending quantity */
    PendingQuantity: number;
    /** Cancelled quantity */
    CancelledQuantity: number;
    /** Custom tag */
    Tag: string;
    /** Global unique identifier */
    guid: string;
}

/**
 * Position structure for portfolio positions.
 * Contains information about open positions including P&L calculations.
 * 
 * @interface Position
 * @property {string} TradingSymbol - Trading symbol
 * @property {string} Exchange - Exchange name
 * @property {number} InstrumentToken - Instrument token
 * @property {string} Product - Product type
 * @property {number} Quantity - Position quantity
 * @property {number} OvernightQuantity - Overnight position quantity
 * @property {number} Multiplier - Contract multiplier
 * @property {number} AveragePrice - Average price
 * @property {number} ClosePrice - Close price
 * @property {number} LastPrice - Last price
 * @property {number} Value - Position value
 * @property {number} PNL - Profit and loss
 * @property {number} M2M - Mark to market
 * @property {number} Unrealised - Unrealised P&L
 * @property {number} Realised - Realised P&L
 * @property {number} BuyQuantity - Buy quantity
 * @property {number} BuyPrice - Buy price
 * @property {number} BuyValue - Buy value
 * @property {number} BuyM2M - Buy mark to market
 * @property {number} SellQuantity - Sell quantity
 * @property {number} SellPrice - Sell price
 * @property {number} SellValue - Sell value
 * @property {number} SellM2M - Sell mark to market
 * @property {number} DayBuyQuantity - Day buy quantity
 * @property {number} DayBuyPrice - Day buy price
 * @property {number} DayBuyValue - Day buy value
 * @property {number} DaySellQuantity - Day sell quantity
 * @property {number} DaySellPrice - Day sell price
 * @property {number} DaySellValue - Day sell value
 */
export interface Position {
    /** Trading symbol */
    TradingSymbol: string;
    /** Exchange name */
    Exchange: string;
    /** Instrument token */
    InstrumentToken: number;
    /** Product type */
    Product: string;
    /** Position quantity */
    Quantity: number;
    /** Overnight position quantity */
    OvernightQuantity: number;
    /** Contract multiplier */
    Multiplier: number;
    /** Average price */
    AveragePrice: number;
    /** Close price */
    ClosePrice: number;
    /** Last price */
    LastPrice: number;
    /** Position value */
    Value: number;
    /** Profit and loss */
    PNL: number;
    /** Mark to market */
    M2M: number;
    /** Unrealised P&L */
    Unrealised: number;
    /** Realised P&L */
    Realised: number;
    /** Buy quantity */
    BuyQuantity: number;
    /** Buy price */
    BuyPrice: number;
    /** Buy value */
    BuyValue: number;
    /** Buy mark to market */
    BuyM2M: number;
    /** Sell quantity */
    SellQuantity: number;
    /** Sell price */
    SellPrice: number;
    /** Sell value */
    SellValue: number;
    /** Sell mark to market */
    SellM2M: number;
    /** Day buy quantity */
    DayBuyQuantity: number;
    /** Day buy price */
    DayBuyPrice: number;
    /** Day buy value */
    DayBuyValue: number;
    /** Day sell quantity */
    DaySellQuantity: number;
    /** Day sell price */
    DaySellPrice: number;
    /** Day sell value */
    DaySellValue: number;
}

/**
 * Position response structure containing day and net positions.
 * 
 * @interface PositionResponse
 * @property {Position[]} Day - Day positions
 * @property {Position[]} Net - Net positions
 */
export interface PositionResponse {
    /** Day positions */
    Day: Position[];
    /** Net positions */
    Net: Position[];
}

/**
 * Holdings structure for portfolio holdings.
 * Contains information about demat holdings including quantity and value.
 * 
 * @interface Holdings
 * @property {string} tradingsymbol - Trading symbol
 * @property {string} exchange - Exchange name
 * @property {number} instrument_token - Instrument token
 * @property {string} isin - ISIN code
 * @property {string} product - Product type
 * @property {number} price - Price
 * @property {number} quantity - Quantity
 * @property {number} t1_quantity - T1 quantity
 * @property {number} realised_quantity - Realised quantity
 * @property {number} authorised_quantity - Authorised quantity
 * @property {string} authorised_date - Authorised date
 * @property {number} opening_quantity - Opening quantity
 * @property {number} collateral_quantity - Collateral quantity
 * @property {string} collateral_type - Collateral type
 * @property {boolean} discrepancy - Discrepancy flag
 * @property {number} last_price - Last price
 * @property {number} close_price - Close price
 * @property {number} pnl - Profit and loss
 * @property {number} day_change - Day change
 * @property {number} day_change_percentage - Day change percentage
 */
export interface Holdings {
    /** Trading symbol */
    tradingsymbol: string;
    /** Exchange name */
    exchange: string;
    /** Instrument token */
    instrument_token: number;
    /** ISIN code */
    isin: string;
    /** Product type */
    product: string;
    /** Price */
    price: number;
    /** Quantity */
    quantity: number;
    /** T1 quantity */
    t1_quantity: number;
    /** Realised quantity */
    realised_quantity: number;
    /** Authorised quantity */
    authorised_quantity: number;
    /** Authorised date */
    authorised_date: string;
    /** Opening quantity */
    opening_quantity: number;
    /** Collateral quantity */
    collateral_quantity: number;
    /** Collateral type */
    collateral_type: string;
    /** Discrepancy flag */
    discrepancy: boolean;
    /** Last price */
    last_price: number;
    /** Close price */
    close_price: number;
    /** Profit and loss */
    pnl: number;
    /** Day change */
    day_change: number;
    /** Day change percentage */
    day_change_percentage: number;
}

/**
 * Instrument master data structure.
 * Contains comprehensive information about trading instruments.
 * 
 * @interface Instrument
 * @property {number} InstrumentToken - Unique instrument identifier
 * @property {number} ExchangeToken - Exchange token
 * @property {string} TradingSymbol - Trading symbol
 * @property {string} Name - Instrument name
 * @property {number} LastPrice - Last traded price
 * @property {number} TickSize - Minimum price movement
 * @property {string|null} Expiry - Expiry date (for derivatives)
 * @property {string} InstrumentType - Instrument type (EQ, FUT, OPT, etc.)
 * @property {string} Segment - Market segment
 * @property {string} Exchange - Exchange name
 * @property {number} Strike - Strike price (for options)
 * @property {number} LotSize - Lot size (for derivatives)
 */
export interface Instrument {
    /** Unique instrument identifier */
    InstrumentToken: number;
    /** Exchange token */
    ExchangeToken: number;
    /** Trading symbol */
    TradingSymbol: string;
    /** Instrument name */
    Name: string;
    /** Last traded price */
    LastPrice: number;
    /** Minimum price movement */
    TickSize: number;
    /** Expiry date (for derivatives) */
    Expiry: string | null;
    /** Instrument type (EQ, FUT, OPT, etc.) */
    InstrumentType: string;
    /** Market segment */
    Segment: string;
    /** Exchange name */
    Exchange: string;
    /** Strike price (for options) */
    Strike: number;
    /** Lot size (for derivatives) */
    LotSize: number;
}

/**
 * OHLC (Open, High, Low, Close) data structure.
 * Contains basic price information for an instrument.
 * 
 * @interface OHLC
 * @property {number} InstrumentToken - Instrument token
 * @property {number} LastPrice - Last traded price
 * @property {number} Open - Opening price
 * @property {number} Close - Closing price
 * @property {number} High - High price
 * @property {number} Low - Low price
 */
export interface OHLC {
    /** Instrument token */
    InstrumentToken: number;
    /** Last traded price */
    LastPrice: number;
    /** Opening price */
    Open: number;
    /** Closing price */
    Close: number;
    /** High price */
    High: number;
    /** Low price */
    Low: number;
}

/**
 * Last Traded Price (LTP) data structure.
 * Contains minimal price information for an instrument.
 * 
 * @interface LTP
 * @property {number} InstrumentToken - Instrument token
 * @property {number} LastPrice - Last traded price
 */
export interface LTP {
    /** Instrument token */
    InstrumentToken: number;
    /** Last traded price */
    LastPrice: number;
}

/**
 * Order details structure for order information.
 * Contains comprehensive order execution details.
 * 
 * @interface OrderDetails
 * @property {number} average_price - Average execution price
 * @property {number} cancelled_quantity - Cancelled quantity
 * @property {number} disclosed_quantity - Disclosed quantity
 * @property {string} exchange - Exchange name
 * @property {string} exchange_order_id - Exchange order ID
 * @property {string} exchange_timestamp - Exchange timestamp
 * @property {number} filled_quantity - Filled quantity
 * @property {number} instrument_token - Instrument token
 * @property {string} order_id - Order ID
 * @property {string} order_timestamp - Order timestamp
 * @property {string} order_type - Order type
 * @property {string} parent_order_id - Parent order ID
 * @property {number} pending_quantity - Pending quantity
 * @property {number} price - Order price
 * @property {string} product - Product type
 * @property {number} quantity - Order quantity
 * @property {string} status - Order status
 * @property {string} status_message - Status message
 * @property {string} tag - Order tag
 * @property {string} tradingsymbol - Trading symbol
 * @property {string} transaction_type - Transaction type
 * @property {number} trigger_price - Trigger price
 * @property {string} validity - Validity
 * @property {string} variety - Variety
 * @property {boolean} modified - Whether order was modified
 */
export interface OrderDetails {
    /** Average execution price */
    average_price: number;
    /** Cancelled quantity */
    cancelled_quantity: number;
    /** Disclosed quantity */
    disclosed_quantity: number;
    /** Exchange name */
    exchange: string;
    /** Exchange order ID */
    exchange_order_id: string;
    /** Exchange timestamp */
    exchange_timestamp: string;
    /** Filled quantity */
    filled_quantity: number;
    /** Instrument token */
    instrument_token: number;
    /** Order ID */
    order_id: string;
    /** Order timestamp */
    order_timestamp: string;
    /** Order type */
    order_type: string;
    /** Parent order ID */
    parent_order_id: string;
    /** Pending quantity */
    pending_quantity: number;
    /** Order price */
    price: number;
    /** Product type */
    product: string;
    /** Order quantity */
    quantity: number;
    /** Order status */
    status: string;
    /** Status message */
    status_message: string;
    /** Order tag */
    tag: string;
    /** Trading symbol */
    tradingsymbol: string;
    /** Transaction type */
    transaction_type: string;
    /** Trigger price */
    trigger_price: number;
    /** Validity */
    validity: string;
    /** Variety */
    variety: string;
    /** Whether order was modified */
    modified: boolean;
}

/**
 * Order margin calculation parameters.
 * Used to calculate margin requirements for placing orders.
 * 
 * @interface OrderMargin
 * @property {string} exchange - Exchange name
 * @property {string} tradingsymbol - Trading symbol
 * @property {string} transaction_type - Transaction type
 * @property {string} variety - Order variety
 * @property {string} product - Product type
 * @property {string} order_type - Order type
 * @property {number} quantity - Order quantity
 * @property {number} price - Order price
 * @property {number} trigger_price - Trigger price
 */
export interface OrderMargin {
    /** Exchange name */
    exchange: string;
    /** Trading symbol */
    tradingsymbol: string;
    /** Transaction type */
    transaction_type: string;
    /** Order variety */
    variety: string;
    /** Product type */
    product: string;
    /** Order type */
    order_type: string;
    /** Order quantity */
    quantity: number;
    /** Order price */
    price: number;
    /** Trigger price */
    trigger_price: number;
}

/**
 * Loser/Gainer parameters for market movers.
 * Used to query top losers and gainers.
 * 
 * @interface LoserGainer
 * @property {number} Exchange - Exchange identifier
 * @property {number} SecurityIdCode - Security ID code
 * @property {number} segment - Market segment
 * @property {string} TypeFlag - Type flag (L for losers, G for gainers)
 */
export interface LoserGainer {
    /** Exchange identifier */
    Exchange: number;
    /** Security ID code */
    SecurityIdCode: number;
    /** Market segment */
    segment: number;
    /** Type flag (L for losers, G for gainers) */
    TypeFlag: string;
}

/**
 * Create basket parameters.
 * Used to create a new basket of orders.
 * 
 * @interface CreateBasket
 * @property {string} BaskName - Basket name
 * @property {string} BaskDesc - Basket description
 * 
 * @example
 * const createBasket: CreateBasket = {
 *   BaskName: "My Strategy",
 *   BaskDesc: "Long term investment basket"
 * };
 */
export interface CreateBasket {
    /** Basket name */
    BaskName: string;
    /** Basket description */
    BaskDesc: string;
}

/**
 * Rename basket parameters.
 * Used to rename an existing basket.
 * 
 * @interface RenameBasket
 * @property {string} basketName - New basket name
 * @property {string} BasketId - Basket ID to rename
 * 
 * @example
 * const renameBasket: RenameBasket = {
 *   basketName: "Updated Strategy",
 *   BasketId: "12345"
 * };
 */
export interface RenameBasket {
    /** New basket name */
    basketName: string;
    /** Basket ID to rename */
    BasketId: string;
}

/**
 * Delete basket parameters.
 * Used to delete a basket.
 * 
 * @interface DeleteBasket
 * @property {string} BasketId - Basket ID to delete
 * 
 * @example
 * const deleteBasket: DeleteBasket = {
 *   BasketId: "12345"
 * };
 */
export interface DeleteBasket {
    /** Basket ID to delete */
    BasketId: string;
}

/**
 * Calculate basket parameters.
 * Used to calculate margin and other details for basket orders.
 * 
 * @interface CalcualteBasket
 * @property {string} include_exist_pos - Include existing positions
 * @property {string} ord_product - Order product type
 * @property {string} disc_qty - Disclosed quantity
 * @property {string} segment - Market segment
 * @property {string} trigger_price - Trigger price
 * @property {string} scriptcode - Script code
 * @property {string} ord_type - Order type
 * @property {string} basket_name - Basket name
 * @property {string} operation - Operation type
 * @property {string} order_validity - Order validity
 * @property {string} order_qty - Order quantity
 * @property {string} script_stat - Script status
 * @property {string} buy_sell_indi - Buy/Sell indicator
 * @property {string} basket_priority - Basket priority
 * @property {string} order_price - Order price
 * @property {string} basket_id - Basket ID
 * @property {string} exch_id - Exchange ID
 *
 * @example
 * const basketParams: CalcualteBasket = {
 *   include_exist_pos: "Y",
 *   ord_product: "CNC",
 *   disc_qty: "0",
 *   segment: "E",
 *   trigger_price: "0",
 *   scriptcode: "INFY",
 *   ord_type: "LIMIT",
 *   basket_name: "My Basket",
 *   operation: "ADD",
 *   order_validity: "DAY",
 *   order_qty: "10",
 *   script_stat: "A", 
 *   buy_sell_indi: "B",
 *   basket_priority: "1",
 *   order_price: "1500",
 *   basket_id: "12345",
 *   exch_id: "NSE"
 * };
 */
export interface CalcualteBasket {
    include_exist_pos: string,
    ord_product: string,
    disc_qty: string,
    segment: string,
    trigger_price: string,
    scriptcode: string,
    ord_type: string,
    basket_name: string,
    operation: string,
    order_validity: string,
    order_qty: string,
    script_stat: string,
    buy_sell_indi: string,
    basket_priority: string,
    order_price: string,
    basket_id: string,
    exch_id: string
}

/**
 * Fetch basket response structure.
 * Contains information about a basket of orders.
 *
 * @interface FetchBasket
 * @property {number} BASKET_ID - Unique basket identifier
 * @property {string} BASKET_NAME - Name of the basket
 * @property {number} COUNT - Number of orders in basket
 * @property {string} CREATE_DATE - Basket creation date
 * @property {string} DESCRIPTOR - Basket description
 *
 * @example
 * const basketInfo: FetchBasket = {
 *   BASKET_ID: 12345,
 *   BASKET_NAME: "My Investment Basket",
 *   COUNT: 5,
 *   CREATE_DATE: "2024-01-15",
 *   DESCRIPTOR: "Long term equity investments"
 * };
 */
export interface FetchBasket {
    BASKET_ID: number,
    BASKET_NAME: string,
    COUNT: number,
    CREATE_DATE: string,
    DESCRIPTOR: string
}

/**
 * Trade history request parameters.
 * Used to fetch historical trades within a date range.
 *
 * @interface TradeHistoryReq
 * @property {string} fromdate - Start date for trade history
 * @property {string} todate - End date for trade history
 *
 * @example
 * const historyRequest: TradeHistoryReq = {
 *   fromdate: "2024-01-01",
 *   todate: "2024-01-15"
 * };
 */
export interface TradeHistoryReq {
    fromdate: string,
    todate: string
}

export * from './config';
