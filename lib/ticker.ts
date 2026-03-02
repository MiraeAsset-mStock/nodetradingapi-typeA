import WebSocket from 'ws';
import { Utils } from './utils';
import { DEFAULTS } from '../constants/routes';
import { MTickerConfig } from '../types/config';
import { FeedData, TypeAUpdate } from '../types';

/**
 * MTicker WebSocket Client
 * Provides real-time market data and order updates via WebSocket
 */
export class MTicker {
    private readonly apiKey: string;
    private readonly accessToken: string;
    private readonly baseSocketUrl: string;
    private readonly maxReconnectionAttempts: number;
    private readonly reconnectDelay: number;
    
    private socketUrl: string;
    private ws: WebSocket | null = null;
    private reconnectionAttempts: number = 0;
    private subscribedTokens: Set<number> = new Set();
    private currentMode: string = 'full';
    private tokenModes: Map<number, string> = new Map();
    private isManualClose: boolean = false;

    // Event handlers
    public onBroadcastReceived: (data: FeedData) => void = () => {};
    public onOrderTradeReceived: (data: TypeAUpdate) => void = () => {};
    public onConnect: () => void = () => {};
    public onClose: () => void = () => {};
    public onError: (event: Event) => void = () => {};
    public onReconnecting: (attempt: number, maxAttempts: number) => void = () => {};

    constructor(config: MTickerConfig) {
        this.apiKey = config.api_key;
        this.accessToken = config.access_token;
        this.baseSocketUrl = config.baseUrl || DEFAULTS.wsURL;
        this.maxReconnectionAttempts = config.maxReconnectionAttempts || 5;
        this.reconnectDelay = config.reconnectDelay || 5000;
        
        this.socketUrl = `${this.baseSocketUrl}?ACCESS_TOKEN=${this.accessToken}&API_KEY=${this.apiKey}`;
    }

    /**
     * Establishes WebSocket connection
     */
    public connect(): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.warn('WebSocket is already connected');
            return;
        }

        this.isManualClose = false;
        this.createWebSocketConnection();
    }

    /**
     * Creates WebSocket connection with event handlers
     */
    private createWebSocketConnection(): void {
        try {
            this.ws = new WebSocket(this.socketUrl);
            this.ws.binaryType = 'arraybuffer';

            this.ws.onopen = this.handleOpen.bind(this);
            this.ws.onmessage = this.handleMessage.bind(this) as any;
            this.ws.onerror = this.handleError.bind(this) as any;
            this.ws.onclose = this.handleClose.bind(this) as any;
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            this.scheduleReconnection();
        }
    }

    /**
     * Handles WebSocket open event
     */
    private handleOpen(): void {
        console.log('WebSocket connected');
        this.reconnectionAttempts = 0;
        this.onConnect();
    }

    /**
     * Send login message after connection (call this in onConnect callback)
     */
    public sendLoginAfterConnect(): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(`LOGIN:${this.accessToken}`);
            this.resubscribeTokens();
        }
    }

    /**
     * Handles WebSocket message event
     */
    private handleMessage(event: MessageEvent): void {
        if (typeof event.data === 'string') {
            this.handleTextMessage(event.data);
        } else if (event.data instanceof ArrayBuffer) {
            this.handleBinaryMessage(event.data);
        }
    }

    /**
     * Handles text messages (JSON)
     */
    private handleTextMessage(data: string): void {
        try {
            const messageDict = JSON.parse(data);
            if (messageDict.type === "order" || messageDict.type === "trade") {
                this.onOrderTradeReceived(messageDict.data as TypeAUpdate);
            }
        } catch (error) {
            console.error('Failed to parse text message:', error);
        }
    }

    /**
     * Handles binary messages (market data)
     */
    private handleBinaryMessage(data: ArrayBuffer): void {
        try {
            this.parseBinaryMessage(data);
        } catch (error) {
            console.error('Failed to parse binary message:', error);
        }
    }

    /**
     * Handles WebSocket error event
     */
    private handleError(event: Event): void {
        console.error('WebSocket error:', event);
        this.onError(event);
        this.scheduleReconnection();
    }

    /**
     * Handles WebSocket close event
     */
    private handleClose(): void {
        console.log('WebSocket connection closed');
        this.onClose();
        
        if (!this.isManualClose) {
            this.scheduleReconnection();
        }
    }

    /**
     * Schedules reconnection attempt
     */
    private scheduleReconnection(): void {
        if (this.reconnectionAttempts < this.maxReconnectionAttempts && !this.isManualClose) {
            this.reconnectionAttempts++;
            this.onReconnecting(this.reconnectionAttempts, this.maxReconnectionAttempts);
            
            setTimeout(() => {
                if (!this.isManualClose) {
                    this.createWebSocketConnection();
                }
            }, this.reconnectDelay);
        } else if (this.reconnectionAttempts >= this.maxReconnectionAttempts) {
            console.error('Max reconnection attempts reached');
        }
    }

    /**
     * Closes WebSocket connection
     */
    public disconnect(): void {
        this.isManualClose = true;
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        
        this.subscribedTokens.clear();
        this.reconnectionAttempts = 0;
    }

    /**
     * Re-subscribes to all previously subscribed tokens
     */
    private resubscribeTokens(): void {
        if (this.subscribedTokens.size > 0) {
            const tokens = Array.from(this.subscribedTokens);
            this.sendSubscriptionMessage('subscribe', tokens);
        }
    }

    /**
     * Subscribes to market data for given instrument tokens
     */
    public subscribe(tokens: number[]): void {
        if (!Array.isArray(tokens) || tokens.length === 0) {
            console.warn('Invalid tokens provided for subscription');
            return;
        }

        tokens.forEach(token => this.subscribedTokens.add(token));
        this.sendSubscriptionMessage('subscribe', tokens);
    }

    /**
     * Unsubscribes from market data for given instrument tokens
     */
    public unsubscribe(tokens: number[]): void {
        if (!Array.isArray(tokens) || tokens.length === 0) {
            console.warn('Invalid tokens provided for unsubscription');
            return;
        }

        tokens.forEach(token => this.subscribedTokens.delete(token));
        this.sendSubscriptionMessage('unsubscribe', tokens);
    }

    /**
     * Sends subscription/unsubscription message
     */
    private sendSubscriptionMessage(action: 'subscribe' | 'unsubscribe', tokens: number[]): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ a: action, v: tokens });
            this.ws.send(message);
        } else {
            console.warn(`Cannot ${action}: WebSocket is not connected`);
        }
    }

    /**
     * Parses binary market data messages
     */
    private parseBinaryMessage(data: ArrayBuffer): void {
        const view = new DataView(data);
        let offset = 0;
        const count = view.getUint16(offset, false);
        offset += 2;

        for (let i = 0; i < count; i++) {
            if (offset >= data.byteLength) break;
            
            const length = view.getUint16(offset, false);
            offset += 2;

            const tick = this.parseTickData(view, offset, length);
            if (tick) {
                this.onBroadcastReceived(tick);
            }
            
            offset += length;
        }
    }

    /**
     * Parses individual tick data based on packet length
     */
    private parseTickData(view: DataView, offset: number, length: number): FeedData | null {
        try {

            switch (length) {
                case 8:
                    return this.readLTPBroadcast(view, offset);
                case 28:
                    return this.readQuoteIndex(view, offset);
                case 32:
                    return this.readFullIndex(view, offset);
                case 44:
                case 184:
                case 200:
                    return this.readModeBasedData(view, offset, length);
                default:
                    console.warn(`Unknown packet length: ${length}`);
                    return null;
            }
        } catch (error) {
            console.error('Error parsing tick data:', error);
            return null;
        }
    }

    /**
     * Reads data based on requested mode
     */
    private readModeBasedData(view: DataView, offset: number, length: number): FeedData {
        const instrumentToken = view.getUint32(offset, false);
        const requestedMode = this.getTokenMode(instrumentToken);
        
        // For quote mode, extract only quote data regardless of packet size
        if (requestedMode === 'quote') {
            return this.createQuoteFromPacket(view, offset, length);
        }
        
        // For LTP mode, extract only LTP data
        if (requestedMode === 'ltp') {
            return this.createLTPFromPacket(view, offset, instrumentToken);
        }
        
        // Default to full mode parsing
        if (length === 44) {
            return this.readQuote(view, offset);
        } else {
            return this.readFullFeed(view, offset, length);
        }
    }
    
    private createQuoteFromPacket(view: DataView, offset: number, length: number): FeedData {
        const instrumentToken = view.getUint32(offset, false);
        const divisor = Utils.getDecimalDivisor(instrumentToken);
        
        return {
            Mode: 'quote',
            InstrumentToken: instrumentToken,
            Tradable: (instrumentToken & 0xff) !== 9,
            LastPrice: view.getUint32(offset + 4, false) / divisor,
            LastQuantity: length >= 12 ? view.getUint32(offset + 8, false) : 0,
            AveragePrice: length >= 16 ? view.getUint32(offset + 12, false) / divisor : 0,
            Volume: length >= 20 ? view.getUint32(offset + 16, false) : 0,
            BuyQuantity: length >= 24 ? view.getUint32(offset + 20, false) : 0,
            SellQuantity: length >= 28 ? view.getUint32(offset + 24, false) : 0,
            Open: length >= 32 ? view.getUint32(offset + 28, false) / divisor : 0,
            High: length >= 36 ? view.getUint32(offset + 32, false) / divisor : 0,
            Low: length >= 40 ? view.getUint32(offset + 36, false) / divisor : 0,
            Close: length >= 44 ? view.getUint32(offset + 40, false) / divisor : 0
        };
    }
    
    private createLTPFromPacket(view: DataView, offset: number, instrumentToken: number): FeedData {
        const divisor = Utils.getDecimalDivisor(instrumentToken);
        const lastPrice = view.getUint32(offset + 4, false) / divisor;

        
        return {
            Mode: 'ltp',
            InstrumentToken: instrumentToken,
            Tradable: (instrumentToken & 0xff) !== 9,
            LastPrice: lastPrice,
            LastQuantity: 0,
            AveragePrice: 0.0,
            Volume: 0,
            BuyQuantity: 0,
            SellQuantity: 0,
            Open: 0.0,
            High: 0.0,
            Low: 0.0,
            Close: 0.0,
            Change: 0.0,
            LastTradeTime: null,
            OI: 0,
            OIDayHigh: 0,
            OIDayLow: 0,
            Timestamp: null
        };
    }
    
    /**
     * Get the requested mode for a token
     */
    private getTokenMode(token: number): string {
        return this.tokenModes.get(token) || 'full';
    }

    /**
     * Reads LTP broadcast data (8 bytes)
     */
    private readLTPBroadcast(view: DataView, offset: number): FeedData {
        const instrumentToken = view.getUint32(offset, false);
        const divisor = Utils.getDecimalDivisor(instrumentToken);
        const lastPrice = view.getUint32(offset + 4, false) / divisor;
        
        return {
            InstrumentToken: instrumentToken,
            Mode: 'ltp',
            LastPrice: lastPrice,
            Tradable: (instrumentToken & 0xff) !== 9
        };
    }

    /**
     * Reads quote index data (28 bytes)
     */
    private readQuoteIndex(view: DataView, offset: number): FeedData {
        const instrumentToken = view.getUint32(offset, false);
        const divisor = Utils.getDecimalDivisor(instrumentToken);
        
        return {
            Mode: 'quote',
            InstrumentToken: instrumentToken,
            Tradable: (instrumentToken & 0xff) !== 9,
            LastPrice: view.getUint32(offset + 4, false) / divisor,
            High: view.getUint32(offset + 8, false) / divisor,
            Low: view.getUint32(offset + 12, false) / divisor,
            Open: view.getUint32(offset + 16, false) / divisor,
            Close: view.getUint32(offset + 20, false) / divisor,
            Change: view.getUint32(offset + 24, false) / divisor,
        };
    }

    /**
     * Reads full index data (32 bytes)
     */
    private readFullIndex(view: DataView, offset: number): FeedData {
        const instrumentToken = view.getUint32(offset, false);
        const requestedMode = this.getTokenMode(instrumentToken);
        const divisor = Utils.getDecimalDivisor(instrumentToken);
        const lastPrice = view.getUint32(offset + 4, false) / divisor;
        const high = view.getUint32(offset + 8, false) / divisor;
        const low = view.getUint32(offset + 12, false) / divisor;
        const open = view.getUint32(offset + 16, false) / divisor;
        const close = view.getUint32(offset + 20, false) / divisor;
        const time = view.getUint32(offset + 28, false);

        // Return data based on requested mode
        if (requestedMode === 'quote') {
            return {
                Mode: 'quote',
                InstrumentToken: instrumentToken,
                Tradable: (instrumentToken & 0xff) !== 9,
                LastPrice: lastPrice,
                High: high,
                Low: low,
                Open: open,
                Close: close,
                Change: lastPrice - close
            };
        }
        
        if (requestedMode === 'ltp') {
            return {
                Mode: 'ltp',
                InstrumentToken: instrumentToken,
                Tradable: (instrumentToken & 0xff) !== 9,
                LastPrice: lastPrice
            };
        }

        return {
            Mode: 'full',
            InstrumentToken: instrumentToken,
            Tradable: (instrumentToken & 0xff) !== 9,
            LastPrice: lastPrice,
            High: high,
            Low: low,
            Open: open,
            Close: close,
            Change: lastPrice - close,
            Timestamp: Utils.unixToDateTime(time)
        };
    }

    /**
     * Reads quote data (44 bytes)
     */
    private readQuote(view: DataView, offset: number): FeedData {
        const instrumentToken = view.getUint32(offset, false);
        const divisor = Utils.getDecimalDivisor(instrumentToken);
        
        return {
            Mode: 'quote',
            InstrumentToken: instrumentToken,
            Tradable: (instrumentToken & 0xff) !== 9,
            LastPrice: view.getUint32(offset + 4, false) / divisor,
            LastQuantity: view.getUint32(offset + 8, false),
            AveragePrice: view.getUint32(offset + 12, false) / divisor,
            Volume: view.getUint32(offset + 16, false),
            BuyQuantity: view.getUint32(offset + 20, false),
            SellQuantity: view.getUint32(offset + 24, false),
            Open: view.getUint32(offset + 28, false) / divisor,
            High: view.getUint32(offset + 32, false) / divisor,
            Low: view.getUint32(offset + 36, false) / divisor,
            Close: view.getUint32(offset + 40, false) / divisor,
        };
    }

    /**
     * Reads full feed data (184 or 200 bytes)
     */
    private readFullFeed(view: DataView, offset: number, length: number): FeedData {
        const instrumentToken = view.getUint32(offset, false);
        const divisor = Utils.getDecimalDivisor(instrumentToken);
        const lastPrice = view.getUint32(offset + 4, false) / divisor;
        const close = view.getUint32(offset + 40, false) / divisor;

        const tick: FeedData = {
            Mode: 'full',
            InstrumentToken: instrumentToken,
            Tradable: (instrumentToken & 0xff) !== 9,
            LastPrice: lastPrice,
            LastQuantity: view.getUint32(offset + 8, false),
            AveragePrice: view.getUint32(offset + 12, false) / divisor,
            Volume: view.getUint32(offset + 16, false),
            BuyQuantity: view.getUint32(offset + 20, false),
            SellQuantity: view.getUint32(offset + 24, false),
            Open: view.getUint32(offset + 28, false) / divisor,
            High: view.getUint32(offset + 32, false) / divisor,
            Low: view.getUint32(offset + 36, false) / divisor,
            Close: close,
            Change: 0,
            LastTradeTime: Utils.unixToDateTime(view.getUint32(offset + 44, false)),
            OI: view.getUint32(offset + 48, false),
            OIDayHigh: view.getUint32(offset + 52, false),
            OIDayLow: view.getUint32(offset + 56, false),
            Timestamp: Utils.unixToDateTime(view.getUint32(offset + 60, false)),
        };

        // Read bid data
        tick.Bids = [];
        let bidOffset = offset + 64;
        for (let i = 0; i < 5; i++) {
            tick.Bids.push({
                Quantity: view.getUint32(bidOffset, false),
                Price: view.getUint32(bidOffset + 4, false) / divisor,
                Orders: view.getUint16(bidOffset + 8, false),
            });
            bidOffset += 12;
        }

        // Read offer data
        tick.Offers = [];
        let offerOffset = bidOffset;
        for (let i = 0; i < 5; i++) {
            tick.Offers.push({
                Quantity: view.getUint32(offerOffset, false),
                Price: view.getUint32(offerOffset + 4, false) / divisor,
                Orders: view.getUint16(offerOffset + 8, false),
            });
            offerOffset += 12;
        }

        // Read circuit limits and year high/low
        tick.UpperCircuit = view.getUint32(offerOffset, false) / divisor;
        tick.LowerCircuit = view.getUint32(offerOffset + 4, false) / divisor;
        tick.YearHigh = view.getUint32(offerOffset + 8, false) / divisor;
        tick.YearLow = view.getUint32(offerOffset + 12, false) / divisor;

        return tick;
    }

    /**
     * Gets current connection status
     */
    public isConnected(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }

    /**
     * Gets subscribed tokens
     */
    public getSubscribedTokens(): number[] {
        return Array.from(this.subscribedTokens);
    }

    /**
     * Set streaming mode for tokens
     */
    public setMode(mode: 'ltp' | 'quote' | 'full', tokens: number[]): void {
        // Always track the mode for tokens
        this.currentMode = mode;
        tokens.forEach(token => {
            this.tokenModes.set(token, mode);
        });
        
        // Send message only if connected
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ a: 'mode', v: [mode, tokens] });
            this.ws.send(message);
        }
    }

    /**
     * Subscribe with specific mode
     */
    public subscribeWithMode(mode: 'ltp' | 'quote' | 'full', tokens: number[]): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ a: 'subscribe', v: { [mode]: tokens } });

            this.ws.send(message);
            tokens.forEach(token => this.subscribedTokens.add(token));
        }
    }
}
