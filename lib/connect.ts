import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Constants } from '../constants';
import { ROUTES, DEFAULTS } from '../constants/routes';
import { MConnectConfig } from '../types/config';

/**
 * MConnect REST API Client
 * Provides methods to interact with the TypeA trading API
 */
export class MConnect {
    private readonly baseURL: string;
    private readonly apiKey: string;
    private readonly timeout: number;
    private readonly debug: boolean;
    private accessToken: string | null;
    private httpClient: AxiosInstance;

    constructor(config: MConnectConfig) {
        this.baseURL = config.baseUrl || DEFAULTS.baseURL;
        this.apiKey = config.api_key;
        this.accessToken = config.accessToken || null;
        this.timeout = config.timeout || DEFAULTS.timeout;
        this.debug = config.debug || DEFAULTS.debug;

        this.httpClient = this.createHttpClient();
    }

    /**
     * Creates and configures the HTTP client
     */
    private createHttpClient(): AxiosInstance {
        const client = axios.create({
            baseURL: this.baseURL,
            timeout: this.timeout
        });

        // Request interceptor
        client.interceptors.request.use((config) => {
            if (this.debug) {
                console.log('Request:', config);
            }
            return config;
        });

        // Response interceptor
        client.interceptors.response.use(
            (response) => {
                if (this.debug) {
                    console.log('Response:', response);
                }
                return response;
            },
            (error) => {
                if (this.debug) {
                    console.error('Request Error:', error);
                }
                return Promise.reject(error);
            }
        );

        return client;
    }

    /**
     * Sets the access token for authenticated requests
     */
    public setAccessToken(accessToken: string): void {
        this.accessToken = accessToken;
    }

    /**
     * Converts object to URL search parameters
     */
    private toUrlSearchParams(payload: object): URLSearchParams {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(payload)) {
            if (value !== null && value !== undefined) {
                params.append(key, String(value));
            }
        }
        return params;
    }

    /**
     * Executes HTTP request with proper headers and error handling
     */
    private async executeRequest(config: AxiosRequestConfig): Promise<any> {
        try {
            const headers = {
                'Authorization': `token ${this.apiKey}:${this.accessToken}`,
                'X-Mirae-Version': '1',
                'Tag': 'typea',
                ...config.headers,
            };
            const finalConfig: AxiosRequestConfig = { ...config, headers };
            const response = await this.httpClient(finalConfig);

            if (response.headers['content-type']?.includes('text/csv')) {
                return response.data;
            }

            // Return only the response data, not the full axios response
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorData = error.response.data;
                
                // Handle array response with error
                if (Array.isArray(errorData) && errorData.length > 0 && errorData[0].status === 'error') {
                    throw new Error(`API Error: ${errorData[0].message} (${errorData[0].error_type})`);
                }
                
                throw new Error(`API Error: ${error.response.status} ${errorData?.message || error.message}`);
            }
            throw error;
        }
    }

    /**
     * Replaces path parameters in route URLs
     */
    private buildRoute(routeKey: string, params: Record<string, string> = {}): string {
        let route = ROUTES[routeKey as keyof typeof ROUTES];
        for (const [key, value] of Object.entries(params)) {
            route = route.replace(`{${key}}`, value);
        }
        return route;
    }

    // Authentication Methods
    public async login(params: { username: string; password: string }): Promise<any> {
        return this.executeRequest({
            method: 'POST',
            url: ROUTES.login,
            data: this.toUrlSearchParams(params),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    public async generateSession(params: { api_key: string; request_token: string; checksum: string }): Promise<any> {
        const response = await this.executeRequest({
            method: 'POST',
            url: ROUTES.sessionToken,
            data: this.toUrlSearchParams(params),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        // Set access token for current instance
        const accessToken = response.data?.access_token || response.access_token;
        if (accessToken) {
            this.setAccessToken(accessToken);
        }
        
        return response;
    }

    public async verifyTOTP(params: { api_key: string; totp: string }): Promise<any> {
        return this.executeRequest({
            method: 'POST',
            url: ROUTES.totpToken,
            data: this.toUrlSearchParams(params),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    public async logout(): Promise<any> {
        return this.executeRequest({ method: 'GET', url: ROUTES.logout });
    }

    // Order Management Methods
    public async placeOrder(params: any): Promise<any> {
        const route = this.buildRoute('orderplacement', { variety: params.variety || Constants.VARIETY_REGULAR });
        
        // Add required parameters that might be missing
        const orderParams = {
            ...params,
            validity: params.validity || 'DAY',
            trigger_price: params.trigger_price || '0',
            disclosed_quantity: params.disclosed_quantity || '0'
        };
        
        return this.executeRequest({
            method: 'POST',
            url: route,
            data: this.toUrlSearchParams(orderParams),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    public async modifyOrder(params: any): Promise<any> {
        const route = this.buildRoute('ordermodify', { variety: params.variety, order_id: params.order_id });
        const { order_id, variety, ...bodyParams } = params;
        return this.executeRequest({
            method: 'PUT',
            url: route,
            data: this.toUrlSearchParams(bodyParams),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    public async cancelOrder(order_id: string): Promise<any> {
        const route = this.buildRoute('ordercancel', { order_id });
        return this.executeRequest({ method: 'DELETE', url: route });
    }

    public async cancelAllOrders(): Promise<any> {
        return this.executeRequest({ method: 'POST', url: ROUTES.cancellall });
    }

    public async getOrderBook(): Promise<any> {
        return this.executeRequest({ method: 'GET', url: ROUTES.getorders });
    }

    public async getOrderDetails(params: any): Promise<any> {
        return this.executeRequest({
            method: 'POST',
            url: ROUTES.getorderdetails,
            data: this.toUrlSearchParams(params),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    public async orderMargin(params: any): Promise<any> {
        return this.executeRequest({
            method: 'POST',
            url: ROUTES.ordermargin,
            data: params,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Portfolio Methods
    public async getNetPositions(): Promise<any> {
        return this.executeRequest({ method: 'GET', url: ROUTES.netpositions });
    }

    public async getHoldings(): Promise<any> {
        return this.executeRequest({ method: 'GET', url: ROUTES.holdings });
    }

    public async convertPosition(params: any): Promise<any> {
        return this.executeRequest({
            method: 'POST',
            url: ROUTES.positionconversion,
            data: this.toUrlSearchParams(params),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    public async getFundSummary(): Promise<any> {
        return this.executeRequest({ method: 'GET', url: ROUTES.fundsummary });
    }

    // Market Data Methods
    public async getInstruments(): Promise<any> {
        const data = await this.executeRequest({ method: 'GET', url: ROUTES.scriptmaster });
        if (typeof data === 'string') {
            const lines = data.trim().split('\n');
            const headers = lines[0].split(',').map((h: string) => h.trim());
            return lines.slice(1).map((line: string) => {
                const values = line.split(',');
                const obj: any = {};
                headers.forEach((header: string, i: number) => obj[header] = values[i]?.trim());
                return obj;
            });
        }
        return data;
    }

    public async getOHLC(symbols: string[]): Promise<any> {
        const params = new URLSearchParams();
        symbols.forEach(s => params.append('i', s));
        return this.executeRequest({ method: 'GET', url: ROUTES.ohlcdata, params });
    }

    public async getLTP(symbols: string[]): Promise<any> {
        const params = new URLSearchParams();
        symbols.forEach(s => params.append('i', s));
        return this.executeRequest({ method: 'GET', url: ROUTES.ltpdata, params });
    }

    public async getHistoricalCandleData(exchange:string,instrument_token: number, interval: string, from: string, to: string): Promise<any> {
        const route = this.buildRoute('historicalcandledata', { 
            exchange: exchange,
            instrument_token: String(instrument_token), 
            interval 
        });
        return this.executeRequest({
            method: 'GET',
            url: route,
            params: { from, to },
        });
    }

    public async getIntradayChartData(exchange: string, instrument_token: string, interval: string): Promise<any> {
        const route = this.buildRoute('intradychartdata', { exchange, instrument_token, interval });
        return this.executeRequest({ method: 'GET', url: route });
    }

    public async loserGainer(params: any): Promise<any> {
        return this.executeRequest({
            method: 'POST',
            url: ROUTES.losergainer,
            data: this.toUrlSearchParams(params),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    // Trading Methods
    public async getTradeHistory(params: any): Promise<any> {
        return this.executeRequest({
            method: 'POST',
            url: ROUTES.trades,
            data: this.toUrlSearchParams(params),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    public async getTradeBook(): Promise<any> {
        return this.executeRequest({ method: 'GET', url: ROUTES.tradebook });
    }

    // Basket Methods
    public async createBasket(params: any): Promise<any> {
        return this.executeRequest({
            method: 'POST',
            url: ROUTES.createbasket,
            data: this.toUrlSearchParams(params),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    public async renameBasket(params: any): Promise<any> {
        return this.executeRequest({
            method: 'PUT',
            url: ROUTES.renamebasket,
            data: this.toUrlSearchParams(params),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    public async deleteBasket(params: any): Promise<any> {
        return this.executeRequest({
            method: 'DELETE',
            url: ROUTES.deletebasket,
            data: this.toUrlSearchParams(params),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    public async calculateBasket(params: any): Promise<any> {
        return this.executeRequest({
            method: 'POST',
            url: ROUTES.calculatebasket,
            data: this.toUrlSearchParams(params),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    public async fetchBasket(): Promise<any> {
        return this.executeRequest({ method: 'GET', url: ROUTES.fetchbasket });
    }

    // Options Methods
    public async getOptionChainMaster(exchange: string): Promise<any> {
        const route = this.buildRoute('optionchainmaster', { exchange });
        return this.executeRequest({ method: 'GET', url: route });
    }

    public async getOptionChain(exchange: string, expiry: string, token: string): Promise<any> {
        const route = this.buildRoute('optionchain', { exchange, expiry, token });
        return this.executeRequest({ method: 'GET', url: route });
    }
}