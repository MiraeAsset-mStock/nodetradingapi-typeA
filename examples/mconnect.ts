/**
 * MConnect REST API Client Example
 * 
 * This example demonstrates how to use the MConnect class for trading operations
 * including authentication, order management, portfolio tracking, and market data.
 */

import { MConnect } from '../lib';
import { Logger } from '../lib/logger';
import { 
  PlaceOrderParams, 
  ModifyOrderParams, 
  TradeHistoryReq
} from '../types';


// API Key and User Credentials
// Replace with your actual API key and credentials
// Note: The access token is generated after login and should be securely stored.

const api_key= "Add_Your_Actual_API_Key_Here";
const username = "Your_Username"; // Replace with your MConnect username
const password = "Your_Password"; // Replace with your MConnect password

// Initialize MConnect client (automatically loads saved token)
const mconnect = new MConnect({ 
  api_key,
  debug: false
});

/**
 * Authentication Flow
 */
async function authenticateUser() {
  try {
    // Step 1: Login (triggers OTP)
    Logger.log('Starting login process');
    const loginResponse = await mconnect.login({ username, password });
    Logger.log('Login successful, OTP sent', loginResponse);
    
    // Step 2: Get OTP from user
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const otp = await new Promise<string>((resolve) => {
      rl.question('Enter OTP: ', (answer: string) => {
        rl.close();
        resolve(answer);
      });
    });
    
    // Step 3: Generate session with OTP
    Logger.log('Generating session with OTP');
    const sessionData = await mconnect.generateSession({
      api_key,
      request_token: otp,
      checksum: 'W'
    });
    
    Logger.log('Session generated successfully', {
      access_token: sessionData.access_token.substring(0, 50) + '...'
    });
    
    return sessionData.access_token;
    
  } catch (error: any) {
    Logger.error('Authentication failed', error.message);
    throw error;
  }
}

/**
 * User Profile and Account Information
 */
async function getUserInfo() {
  try {
    // Get fund summary
    const fundSummary = await mconnect.getFundSummary();
    Logger.log('Fund Summary Response', fundSummary);
    
    // Get positions
    const positions = await mconnect.getNetPositions();
    Logger.log('Positions Response', positions);
    
    // Get holdings
    const holdings = await mconnect.getHoldings();
    Logger.log('Holdings Response', holdings);
    
  } catch (error: any) {
    Logger.error('User Info Error', error.message);
  }
}

/**
 * Order Management Examples
 */
async function orderManagement() {
  try {
    // Place a regular order (matching Postman request)
    const orderParams: PlaceOrderParams = {
      exchange: "NSE",
      tradingsymbol: "IDEA",
      transaction_type: "BUY",
      quantity: 1,
      product: "CNC",
      order_type: "LIMIT",
      price: 100,
      validity: "DAY",
      trigger_price: 0,
      disclosed_quantity: 0,
      variety: "regular"
    };
    
    const orderResponse = await mconnect.placeOrder(orderParams);
    Logger.log('Order Response', orderResponse);
    
    const orderId = orderResponse.order_id;
    
    // Modify the order
    const modifyParams: ModifyOrderParams = {
      order_id: orderId,
      variety: "regular",
      quantity: 2,
      price: 2500,
      order_type: "LIMIT"
    };
    
    const modifyResponse = await mconnect.modifyOrder(modifyParams);
    console.log('Modify Order Response:', JSON.stringify(modifyResponse, null, 2));
    
    // Get order book
    const orderBook = await mconnect.getOrderBook();
    console.log('Order Book Response:', JSON.stringify(orderBook, null, 2));
    
    // Cancel order (if needed)
    // await mconnect.cancelOrder(orderId);
    
  } catch (error: any) {
    Logger.error('Place order failed', error.message);
  }
}

/**
 * Basket Management Example
 */
async function basketManagement() {
  try {
    // Create a basket
    const createBasketParams = {
      BaskName: "My Trading Basket",
      BaskDesc: "Sample basket for demo"
    };
    
    const basketResponse = await mconnect.createBasket(createBasketParams);
    console.log('Basket created:', basketResponse);
    
    // Fetch baskets
    const baskets = await mconnect.fetchBasket();
    console.log('Available baskets:', baskets);
    
  } catch (error: any) {
    console.error('Basket Management Error:', JSON.stringify(error.response?.data || error.message || error, null, 2));
  }
}

/**
 * Trading History Example
 */
async function tradingHistory() {
  try {
    // Get trade book
    const tradeBook = await mconnect.getTradeBook();
    console.log('Trade Book:', tradeBook);
    
    // Get trade history for date range
    const tradeHistoryParams: TradeHistoryReq = {
      fromdate: "2024-01-01",
      todate: "2024-01-31"
    };
    
    const tradeHistory = await mconnect.getTradeHistory(tradeHistoryParams);
    console.log('Trade History:', tradeHistory);
    
  } catch (error: any) {
    console.error(' Trading History Error:', JSON.stringify(error.response?.data || error.message || error, null, 2));
  }
}

/**
 * Market Data Examples
 */
async function marketData() {
  try {
    // Get instruments list
    try {
      const instruments = await mconnect.getInstruments();
      Logger.log('Instruments count', instruments.data?.length || 'No data');
    } catch (error: any) {
      Logger.error('Instruments Error', error.message);
    }
    
    // Get OHLC data
    try {
      const ohlc = await mconnect.getOHLC(["NSE:RELIANCE"]);
      Logger.log('OHLC Data', ohlc);
    } catch (error: any) {
      Logger.error('OHLC Error', error.message);
    }
    
    // Get LTP (Last Traded Price)
    try {
      const ltp = await mconnect.getLTP(["NSE:RELIANCE"]);
      Logger.log('LTP', ltp);
    } catch (error: any) {
      Logger.error('LTP Error', error.message);
    }
    
    // Get historical candle data
    try {
      const historicalData = await mconnect.getHistoricalCandleData(
        26000, 
        "day",
        "2025-06-04+09%3A15%3A00",
        "2025-06-04+09%3A20%3A00"
      );
      console.log('Historical Data:', JSON.stringify(historicalData, null, 2));
    } catch (error: any) {
      console.error('Historical Data Error:', error.message);
    }
    
    // Get intraday chart data
    try {
      const intradayData = await mconnect.getIntradayChartData("4", "SENSEX", "5minute");
      console.log('Intraday Data:', JSON.stringify(intradayData, null, 2));
    } catch (error: any) {
      console.error('Intraday Data Error:', error.message);
    }
    
  } catch (error: any) {
    console.error(' Market Data Error:', JSON.stringify(error.response?.data || error.message || error, null, 2));
  }
}

/**
 * Portfolio Analysis
 */
async function portfolioAnalysis() {
  try {
    // Get portfolio holdings
    const holdings = await mconnect.getHoldings();
    
    // Calculate total portfolio value
    const totalValue = holdings.reduce((sum: number, holding: any) => {
      return sum + (holding.last_price * holding.quantity);
    }, 0);
    
    console.log('Total Portfolio Value:', totalValue);
    
    // Get day's P&L from positions
    const positions = await mconnect.getNetPositions();
    const dayPnL = positions.Net?.reduce((sum: number, position: any) => {
      return sum + position.PNL;
    }, 0) || 0;
    
    console.log('Day P&L:', dayPnL);
    
  } catch (error: any) {
    console.error(' Portfolio Analysis Error:', JSON.stringify(error.response?.data || error.message || error, null, 2));
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log('=== MConnect SDK Example ===\n');
    
    // Step 1: Authenticate and get access token
    const accessToken = await authenticateUser();
    mconnect.setAccessToken(accessToken);
    
    // Step 2: Get user information
    await getUserInfo();
    
    // Step 3: Demonstrate order management
    await orderManagement();
    
    // Step 4: Demonstrate basket management
    await basketManagement();
    
    // Step 5: Demonstrate trading history
    await tradingHistory();
    
    // Step 6: Get market data
    await marketData();
    
    // Step 7: Portfolio analysis
    await portfolioAnalysis();
    
    console.log('\n=== Example completed successfully ===');
    
  } catch (error: any) {
    console.error(' Example Execution Failed:', JSON.stringify(error.response?.data || error.message || error, null, 2));
  }
}

// Error handling for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Run the example
if (require.main === module) {
  main();
}

export { main };