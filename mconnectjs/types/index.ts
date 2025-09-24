// --- Request Parameter Interfaces ---
export interface loginParmas{
    username: string;
    password: string
}

export interface verifyOTP{
    api_key: string;
    request_token: string,
    checksum: string
}

export interface verifyTOTP{
    api_key: string;
    totp: string
}

export interface PlaceOrderParams {
    exchange: string;
    tradingsymbol: string;
    transaction_type: 'BUY' | 'SELL';
    quantity: number;
    price?: number;
    product?: string;
    order_type?: string;
    validity?: string;
    disclosed_quantity?: number;
    trigger_price?: number;
    squareoff?: number;
    stoploss?: number;
    trailing_stoploss?: number;
    variety?: 'regular' | 'co' | 'amo' | 'iceberg' | 'auction';
    tag?: string;
    validity_ttl?: number;
    iceberg_legs?: number;
    iceberg_quantity?: number;
    auction_number?: string;
}

export interface ModifyOrderParams {
    order_id: string;
    variety: 'regular' | 'co' | 'amo' | 'iceberg' | 'auction';
    order_type?: string;
    quantity?: number;
    price?: number;
    validity?: string;
    disclosed_quantity?: number;
    trigger_price?: number;
}

export interface CancelOrderParams {
    order_id: string;
    variety: 'regular' | 'co' | 'amo' | 'iceberg' | 'auction';
}

export interface OrderDetailsReq {
    order_no: string;
    segment: string;
}

export interface ConvertPositionParams {
    tradingsymbol: string;
    exchange: string;
    transaction_type: 'BUY' | 'SELL';
    position_type: 'day' | 'overnight';
    quantity: number;
    old_product: string;
    new_product: string;
}

// --- Models ---
export interface FeedData {
    Mode?: string;
    InstrumentToken?: number;
    Tradable?: boolean;
    LastPrice?: number;
    LastQuantity?: number;
    AveragePrice?: number;
    Volume?: number;
    BuyQuantity?: number;
    SellQuantity?: number;
    Open?: number;
    High?: number;
    Low?: number;
    Close?: number;
    Change?: number;
    Bids?: DepthItem[];
    Offers?: DepthItem[];
    LastTradeTime?: Date | null;
    OI?: number;
    OIDayHigh?: number;
    OIDayLow?: number;
    Timestamp?: Date | null;
}

export interface DepthItem {
    Quantity: number;
    Price: number;
    Orders: number;
}

export interface TypeAUpdate {
    user_id: string;
    unfilled_quantity: number;
    app_id: number;
    checksum: string;
    placed_by: string;
    order_id: string;
    exchange_order_id: string;
    parent_order_id: string;
    status: string;
    status_message: string | null;
    status_message_raw: string | null;
    order_timestamp: string;
    exchange_update_timestamp: string;
    exchange_timestamp: string;
    variety: string;
    exchange: string;
    tradingsymbol: string;
    instrument_token: number;
    order_type: string;
    transaction_type: string;
    validity: string;
    product: string;
    quantity: number;
    disclosed_quantity: number;
    price: number;
    trigger_price: number;
    average_price: number;
    filled_quantity: number;
    pending_quantity: number;
    cancelled_quantity: number;
    market_protection: number;
    guid: string;
}

export interface Order {
    PlacedBy: string;
    OrderId: string;
    ExchangeOrderId: string;
    ParentOrderId: string;
    Status: string;
    StatusMessage: string;
    StatusMessageRaw: string;
    OrderTimestamp: string | null;
    ExchangeUpdateTimestamp: string | null;
    ExchangeTimestamp: string | null;
    Variety: string;
    Modified: boolean;
    Exchange: string;
    Tradingsymbol: string;
    InstrumentToken: number;
    OrderType: string;
    TransactionType: string;
    Validity: string;
    Product: string;
    Quantity: number;
    DisclosedQuantity: number;
    Price: number;
    TriggerPrice: number;
    AveragePrice: number;
    FilledQuantity: number;
    PendingQuantity: number;
    CancelledQuantity: number;
    Tag: string;
    guid: string;
}

export interface Position {
    TradingSymbol: string;
    Exchange: string;
    InstrumentToken: number;
    Product: string;
    Quantity: number;
    OvernightQuantity: number;
    Multiplier: number;
    AveragePrice: number;
    ClosePrice: number;
    LastPrice: number;
    Value: number;
    PNL: number;
    M2M: number;
    Unrealised: number;
    Realised: number;
    BuyQuantity: number;
    BuyPrice: number;
    BuyValue: number;
    BuyM2M: number;
    SellQuantity: number;
    SellPrice: number;
    SellValue: number;
    SellM2M: number;
    DayBuyQuantity: number;
    DayBuyPrice: number;
    DayBuyValue: number;
    DaySellQuantity: number;
    DaySellPrice: number;
    DaySellValue: number;
}

export interface PositionResponse {
    Day: Position[];
    Net: Position[];
}

export interface Holdings {
    tradingsymbol: string;
    exchange: string;
    instrument_token: number;
    isin: string;
    product: string;
    price: number;
    quantity: number;
    t1_quantity: number;
    realised_quantity: number;
    authorised_quantity: number;
    authorised_date: string;
    opening_quantity: number;
    collateral_quantity: number;
    collateral_type: string;
    discrepancy: boolean;
    last_price: number;
    close_price: number;
    pnl: number;
    day_change: number;
    day_change_percentage: number;
}

export interface Instrument {
    InstrumentToken: number;
    ExchangeToken: number;
    TradingSymbol: string;
    Name: string;
    LastPrice: number;
    TickSize: number;
    Expiry: string | null;
    InstrumentType: string;
    Segment: string;
    Exchange: string;
    Strike: number;
    LotSize: number;
}

export interface OHLC {
    InstrumentToken: number;
    LastPrice: number;
    Open: number;
    Close: number;
    High: number;
    Low: number;
}

export interface LTP {
    InstrumentToken: number;
    LastPrice: number;
}

export interface OrderDetails {
    average_price: number,
    cancelled_quantity: number,
    disclosed_quantity: number,
    exchange: string,
    exchange_order_id: string,
    exchange_timestamp: string,
    filled_quantity: number,
    instrument_token: number,
    order_id: string,
    order_timestamp: string,
    order_type: string,
    parent_order_id: string,
    pending_quantity: number,
    price: number,
    product: string,
    quantity: number,
    status: string,
    status_message: string,
    tag: string,
    tradingsymbol: string,
    transaction_type: string,
    trigger_price: number,
    validity: string,
    variety: string,
    modified: boolean
}

export interface OrderMargin {
    exchange: string,
    tradingsymbol: string,
    transaction_type: string,
    variety: string,
    product: string,
    order_type: string,
    quantity: number,
    price: number,
    trigger_price: number
}

export interface LoserGainer {
    Exchange: number,
    SecurityIdCode: number,
    segment: number,
    TypeFlag: string
}

export interface CreateBasket {
    BaskName: string,
    BaskDesc: string
}

export interface RenameBasket {
    basketName: string,
    BasketId: string
}

export interface DeleteBasket {
    BasketId: string
}

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

export interface FetchBasket {
    BASKET_ID: number,
    BASKET_NAME: string,
    COUNT: number,
    CREATE_DATE: string,
    DESCRIPTOR: string
}

export interface TradeHistoryReq {
    fromdate: string,
    todate: string
}

export * from './config';