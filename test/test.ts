/**
 * MConnect Testing Script
 * Test individual methods in isolation before public release
 */

import { MConnect } from '../lib';
import { PlaceOrderParams, ModifyOrderParams, TradeHistoryReq } from '../types';
import * as fs from 'fs';
import * as path from 'path';

// API Key and User Credentials
// Replace with your actual API key and credentials
// Note: The access token is generated after login and should be securely stored.

const api_key= "Add_Your_Actual_API_Key_Here"; // Replace with your actual API key
const username = "Add_Your_Actual_User_Name"; // Replace with your actual username
const password = "Add_Your_Actual_Password"; // Replace with your actual password
// Create MConnect client (automatically loads saved token)
const mconnect = new MConnect({ 
  api_key,
  debug: false
});

// Global variable to store access token
let accessToken: string | null = null;

// Logging functionality
class TestLogger {
  private logsDir: string;
  private sessionLogFile: string;
  private operationsLogFile: string;
  private errorsLogFile: string;

  constructor() {
    this.logsDir = path.join(__dirname, 'logs');
    const today = new Date().toISOString().split('T')[0];
    this.sessionLogFile = path.join(this.logsDir, `test-session-${today}.log`);
    this.operationsLogFile = path.join(this.logsDir, `operations-${today}.log`);
    this.errorsLogFile = path.join(this.logsDir, `errors-${today}.log`);
    
    this.ensureLogsDir();
    this.logSessionStart();
  }

  private ensureLogsDir() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private logSessionStart() {
    const logEntry = `\n=== SESSION STARTED ===\nTimestamp: ${this.getTimestamp()}\nUser: ${username}\n========================\n`;
    fs.appendFileSync(this.sessionLogFile, logEntry);
  }

  logOperation(operation: string, params?: any, result?: any, status: 'SUCCESS' | 'FAILED' = 'SUCCESS') {
    // Extract only the essential data from API responses
    let cleanResult = result;
    if (result && typeof result === 'object') {
      if (result.data !== undefined) {
        cleanResult = result.data; // Only log the actual API response data
      } else if (result.status && result.message) {
        cleanResult = { status: result.status, message: result.message };
      }
    }

    // Simple one-line format: timestamp - operation - response
    const logLine = `${this.getTimestamp()} - ${operation} Response: ${JSON.stringify(cleanResult)}\n`;
    
    fs.appendFileSync(this.operationsLogFile, logLine);
    
    // Also log to session file
    const sessionLog = `[${this.getTimestamp()}] ${operation} - ${status}\n`;
    fs.appendFileSync(this.sessionLogFile, sessionLog);
  }

  logError(operation: string, error: any, params?: any) {
    const errorLog = `${this.getTimestamp()} - ERROR - ${operation} failed: ${error.message || error}\n`;
    
    fs.appendFileSync(this.operationsLogFile, errorLog);
    fs.appendFileSync(this.errorsLogFile, errorLog);
    
    // Also log to session file
    const sessionLog = `[${this.getTimestamp()}] ${operation} - FAILED\n`;
    fs.appendFileSync(this.sessionLogFile, sessionLog);
  }

  logUserChoice(choice: string, description: string) {
    const choiceLog = `[${this.getTimestamp()}] User selected: ${choice} - ${description}\n`;
    fs.appendFileSync(this.sessionLogFile, choiceLog);
  }

  logSessionEnd() {
    const logEntry = `\n=== SESSION ENDED ===\nTimestamp: ${this.getTimestamp()}\n=====================\n\n`;
    fs.appendFileSync(this.sessionLogFile, logEntry);
  }
}

// Global logger instance
const logger = new TestLogger();

// Wrapper function to add logging to any test function
function withLogging<T extends any[], R>(operationName: string, fn: (...args: T) => Promise<R>) {
  return async (...args: T): Promise<R> => {
    try {
      const result = await fn(...args);
      if (typeof result === 'boolean' && result) {
        logger.logOperation(operationName, args.length > 0 ? args : {}, 'Operation completed', 'SUCCESS');
      } else if (typeof result === 'boolean' && !result) {
        logger.logOperation(operationName, args.length > 0 ? args : {}, 'Operation failed', 'FAILED');
      } else {
        logger.logOperation(operationName, args.length > 0 ? args : {}, result, 'SUCCESS');
      }
      return result;
    } catch (error) {
      logger.logError(operationName, error, args.length > 0 ? args : {});
      throw error;
    }
  };
}

// Test login method (triggers OTP)
async function testLogin() {
  console.log('\n=== Testing Login (Triggers OTP) ===');
  const params = { username, password: '***HIDDEN***' };
  
  try {
    const loginResponse = await mconnect.login({
      username,
      password
    });
    
    const logLine = `${new Date().toISOString()} - Login successful, OTP sent: ${JSON.stringify(loginResponse)}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs', `operations-${new Date().toISOString().split('T')[0]}.log`), logLine);
    console.log('Login successful - OTP sent to mobile');
    console.log('Response:', loginResponse);
    return true;
  } catch (error) {
    logger.logError('LOGIN', error, params);
    console.error('Login failed:', error);
    return false;
  }
}

// Test session generation with OTP
async function testGenerateSession(rl?: any, question?: (prompt: string) => Promise<string>) {
  if (!rl || !question) {
    const readline = require('readline');
    const localRl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const localQuestion = (prompt: string): Promise<string> => {
      return new Promise((resolve) => {
        localRl.question(prompt, resolve);
      });
    };

    console.log('\n=== Testing Generate Session ===');
    try {
      const otp = await localQuestion('Enter OTP received on mobile: ');
      localRl.close();
      
      const sessionData = await mconnect.generateSession({
        api_key,
        request_token: otp,
        checksum: 'W'
      });
      
      accessToken = sessionData.data?.access_token || sessionData.access_token;
      console.log('Session generated successfully');
      console.log('Access Token:', accessToken);
      return true;
    } catch (error) {
      console.error('Session generation failed:', error);
      return false;
    }
  }

  console.log('\n=== Testing Generate Session ===');
  let otp = '';
  try {
    otp = await question('Enter OTP received on mobile: ');
    const params = { api_key: '***HIDDEN***', request_token: otp, checksum: 'W' };
    
    const sessionData = await mconnect.generateSession({
      api_key,
      request_token: otp,
      checksum: 'W'
    });
    
    accessToken = sessionData.data?.access_token || sessionData.access_token;
    const logLine = `${new Date().toISOString()} - Session generated successfully: ${JSON.stringify({access_token: sessionData.data?.access_token || sessionData.access_token})}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs', `operations-${new Date().toISOString().split('T')[0]}.log`), logLine);
    console.log('Session generated successfully');
    console.log('Access Token:', accessToken);
    return true;
  } catch (error) {
    logger.logError('GENERATE_SESSION', error, { api_key: '***HIDDEN***', request_token: otp, checksum: 'W' });
    console.error('Session generation failed:', error);
    return false;
  }
}

// Combined authentication flow
async function testFullAuthFlow() {
  console.log('\n=== Testing Full Authentication Flow ===');
  
  // Step 1: Login (triggers OTP)
  const loginSuccess = await testLogin();
  if (!loginSuccess) {
    return false;
  }
  
  // Step 2: Generate session with OTP
  const sessionSuccess = await testGenerateSession();
  return sessionSuccess;
}

async function testFundSummary() {
  console.log('\n=== Testing Fund Summary ===');
  
  if (!accessToken) {
    console.error('No access token available. Please authenticate first.');
    logger.logError('FUND_SUMMARY', new Error('No access token available'), {});
    return false;
  }
  
  try {
    const fundSummary = await mconnect.getFundSummary();
    const logLine = `${new Date().toISOString()} - Fund Summary Response: ${JSON.stringify(fundSummary.data || fundSummary)}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs', `operations-${new Date().toISOString().split('T')[0]}.log`), logLine);
    console.log('Fund Summary:', fundSummary.data || fundSummary);
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorLine = `${new Date().toISOString()} - ERROR - Fund Summary failed: ${errorMessage}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs', `operations-${new Date().toISOString().split('T')[0]}.log`), errorLine);
    console.error('Fund Summary failed:', error);
    return false;
  }
}

async function testPositions() {
  console.log('\n=== Testing Positions ===');
  try {
    const positions = await mconnect.getNetPositions();
    const logLine = `${new Date().toISOString()} - Positions Response: ${JSON.stringify(positions.data || positions)}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs', `operations-${new Date().toISOString().split('T')[0]}.log`), logLine);
    console.log('Positions:', positions.data || positions);
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorLine = `${new Date().toISOString()} - ERROR - Positions failed: ${errorMessage}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs', `operations-${new Date().toISOString().split('T')[0]}.log`), errorLine);
    console.error('Positions failed:', error);
    return false;
  }
}

async function testHoldings() {
  console.log('\n=== Testing Holdings ===');
  try {
    const holdings = await mconnect.getHoldings();
    const logLine = `${new Date().toISOString()} - Holdings Response: ${JSON.stringify(holdings.data || holdings)}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs', `operations-${new Date().toISOString().split('T')[0]}.log`), logLine);
    console.log('Holdings:', holdings.data || holdings);
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorLine = `${new Date().toISOString()} - ERROR - Holdings failed: ${errorMessage}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs', `operations-${new Date().toISOString().split('T')[0]}.log`), errorLine);
    console.error('Holdings failed:', error);
    return false;
  }
}

async function testInstruments() {
  console.log('\n=== Testing Instruments ===');
  try {
    const instruments = await mconnect.getInstruments();
    const logLine = `${new Date().toISOString()} - Instruments count: ${JSON.stringify(instruments.length || instruments)}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs', `operations-${new Date().toISOString().split('T')[0]}.log`), logLine);
    console.log('Instruments count:', instruments.length);
    return true;
  } catch (error) {
    console.error('Instruments failed:', error);
    return false;
  }
}

async function testOHLC() {
  console.log('\n=== Testing OHLC ===');
  try {
    const ohlc = await mconnect.getOHLC(["NSE:RELIANCE","NSE:SBIN","BSE:SENSEX"]);
    const logLine = `${new Date().toISOString()} - OHLC Data: ${JSON.stringify(ohlc)}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs', `operations-${new Date().toISOString().split('T')[0]}.log`), logLine);
    console.log('OHLC:', JSON.stringify(ohlc, null, 2));
    return true;
  } catch (error) {
    console.error('OHLC failed:', error);
    return false;
  }
}

async function testLTP() {
  console.log('\n=== Testing LTP ===');
  try {
    const ltp = await mconnect.getLTP(["NSE:RELIANCE"]);
    const logLine = `${new Date().toISOString()} - LTP: ${JSON.stringify(ltp)}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs', `operations-${new Date().toISOString().split('T')[0]}.log`), logLine);
    console.log('LTP:', ltp);
    return true;
  } catch (error) {
    console.error('LTP failed:', error);
    return false;
  }
}

async function testOrderBook() {
  console.log('\n=== Testing Order Book ===');
  try {
    const orderBook = await mconnect.getOrderBook();
    logger.logOperation('GET_ORDER_BOOK', {}, orderBook, 'SUCCESS');
    console.log('Order Book:', orderBook.data || orderBook);
    return true;
  } catch (error) {
    logger.logError('GET_ORDER_BOOK', error, {});
    console.error('Order Book failed:', error);
    return false;
  }
}

async function testTradeBook() {
  console.log('\n=== Testing Trade Book ===');
  try {
    const tradeBook = await mconnect.getTradeBook();
    console.log('Trade Book:', tradeBook);
    return true;
  } catch (error) {
    console.error('Trade Book failed:', error);
    return false;
  }
}

async function testVerifyTOTP(rl?: any, question?: (prompt: string) => Promise<string>) {
  if (!rl || !question) {
    const readline = require('readline');
    const localRl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const localQuestion = (prompt: string): Promise<string> => {
      return new Promise((resolve) => {
        localRl.question(prompt, resolve);
      });
    };

    console.log('\n=== Testing Verify TOTP ===');
    try {
      const totp = await localQuestion('Enter TOTP: ');
      localRl.close();
      
      const response = await mconnect.verifyTOTP({
        api_key,
        totp: totp
      });
      
      console.log('TOTP verified:', response);
      return true;
    } catch (error) {
      console.error('TOTP verification failed:', error);
      return false;
    }
  }

  console.log('\n=== Testing Verify TOTP ===');
  try {
    const totp = await question('Enter TOTP: ');
    
    const response = await mconnect.verifyTOTP({
      api_key,
      totp: totp
    });
    
    console.log('TOTP verified:', response);
    return true;
  } catch (error) {
    console.error('TOTP verification failed:', error);
    return false;
  }
}

async function testPlaceOrder() {
  console.log('\n=== Testing Place Order ===');
  const orderParams: PlaceOrderParams = {
    exchange: "NSE",
    tradingsymbol: "IDEA",
    transaction_type: "BUY",
    quantity: 1,
    product: "CNC",
    order_type: "MARKET",
    price:0,
    trigger_price: 0,
    variety: "regular",
    tag: "my_order_001"
  };
  
  try {
    const response = await mconnect.placeOrder(orderParams);
    logger.logOperation('PLACE_ORDER', orderParams, response, 'SUCCESS');
    console.log('Order placed:', response.data || response);
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorLine = `${new Date().toISOString()} - ERROR - Place order failed: ${errorMessage}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs', `operations-${new Date().toISOString().split('T')[0]}.log`), errorLine);
    console.error('Place order failed:', error);
    return false;
  }
}

async function testModifyOrder(rl?: any, question?: (prompt: string) => Promise<string>) {
  if (!rl || !question) {
    const readline = require('readline');
    const localRl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const localQuestion = (prompt: string): Promise<string> => {
      return new Promise((resolve) => {
        localRl.question(prompt, resolve);
      });
    };

    console.log('\n=== Testing Modify Order ===');
    try {
      const orderId = await localQuestion('Enter Order ID to modify: ');
      localRl.close();
      
      const modifyParams: ModifyOrderParams = {
        order_id: orderId,
        variety: "regular",
        quantity:1,
        disclosed_quantity: 0,
        price: 6.15,
        order_type: "LIMIT",
        validity: "DAY"
      };
      
      const response = await mconnect.modifyOrder(modifyParams);
      console.log('Order modified:', response);
      return true;
    } catch (error) {
      console.error('Modify order failed:', error);
      return false;
    }
  }

  console.log('\n=== Testing Modify Order ===');
  try {
    const orderId = await question('Enter Order ID to modify: ');
    
    const modifyParams: ModifyOrderParams = {
      order_id: orderId,
      variety: "regular",
      quantity:1,
      disclosed_quantity: 0,
      price: 6.15,
      order_type: "LIMIT",
      validity: "DAY"
    };
    
    const response = await mconnect.modifyOrder(modifyParams);
    console.log('Order modified:', response);
    return true;
  } catch (error) {
    console.error('Modify order failed:', error);
    return false;
  }
}

async function testCancelOrder(rl?: any, question?: (prompt: string) => Promise<string>) {
  if (!rl || !question) {
    const readline = require('readline');
    const localRl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const localQuestion = (prompt: string): Promise<string> => {
      return new Promise((resolve) => {
        localRl.question(prompt, resolve);
      });
    };

    console.log('\n=== Testing Cancel Order ===');
    try {
      const orderId = await localQuestion('Enter Order ID to cancel: ');
      localRl.close();
      
      const response = await mconnect.cancelOrder(orderId);
      console.log('Order cancelled:', response);
      return true;
    } catch (error) {
      console.error('Cancel order failed:', error);
      return false;
    }
  }

  console.log('\n=== Testing Cancel Order ===');
  try {
    const orderId = await question('Enter Order ID to cancel: ');
    
    const response = await mconnect.cancelOrder(orderId);
    console.log('Order cancelled:', response);
    return true;
  } catch (error) {
    console.error('Cancel order failed:', error);
    return false;
  }
}

async function testCancelAllOrders() {
  console.log('\n=== Testing Cancel All Orders ===');
  try {
    const response = await mconnect.cancelAllOrders();
    console.log('All orders cancelled:', response);
    return true;
  } catch (error) {
    console.error('Cancel all orders failed:', error);
    return false;
  }
}

async function testOrderDetails(rl?: any, question?: (prompt: string) => Promise<string>) {
  if (!rl || !question) {
    const readline = require('readline');
    const localRl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const localQuestion = (prompt: string): Promise<string> => {
      return new Promise((resolve) => {
        localRl.question(prompt, resolve);
      });
    };

    console.log('\n=== Testing Order Details ===');
    try {
      const orderNo = await localQuestion('Enter Order Number: ');
      localRl.close();
      
      const response = await mconnect.getOrderDetails({
        order_no: orderNo,
      });
      
      console.log('Order details:', response);
      return true;
    } catch (error) {
      console.error('Order details failed:', error);
      return false;
    }
  }

  console.log('\n=== Testing Order Details ===');
  try {
    const orderNo = await question('Enter Order Number: ');
    const response = await mconnect.getOrderDetails({
      order_no: orderNo,
    });
    
    console.log('Order details:', response);
    return true;
  } catch (error) {
    console.error('Order details failed:', error);
    return false;
  }
}

async function testOrderMargin() {
  console.log('\n=== Testing Order Margin ===');
  try {
    const marginParams = {
      exchange: "NSE",
      tradingsymbol: "RELIANCE",
      transaction_type: "BUY",
      variety: "regular",
      product: "CNC",
      order_type: "MARKET",
      quantity: 1,
      price: 2500,
      trigger_price: 0
    };
    
    const response = await mconnect.orderMargin(marginParams);
    console.log('Order margin:', response);
    return true;
  } catch (error) {
    console.error('Order margin failed:', error);
    return false;
  }
}

async function testLoserGainer() {
  console.log('\n=== Testing Loser Gainer ===');
  try {
    const params = {
      Exchange: 1,
      SecurityIdCode: 1,
      segment: 1,
      TypeFlag: "G"  // G for Gainer, L for Loser
    };
    
    const response = await mconnect.loserGainer(params);
    console.log('Loser Gainer:', response);
    return true;
  } catch (error) {
    console.error('Loser Gainer failed:', error);
    return false;
  }
}

async function testHistoricalData() {
  console.log('\n=== Testing Historical Data ===');
  try {
    const response = await mconnect.getHistoricalCandleData(
      "BFO",
      875891, 
      "minute",
      "2025-11-10",
      "2025-11-13"
    );
    
    const logLine = `${new Date().toISOString()} - Historical Data Response: ${JSON.stringify(response)}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs', `operations-${new Date().toISOString().split('T')[0]}.log`), logLine);
    console.log('Historical data:', JSON.stringify(response, null, 2));
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorLine = `${new Date().toISOString()} - ERROR - Historical data failed: ${errorMessage}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs', `operations-${new Date().toISOString().split('T')[0]}.log`), errorLine);
    console.error('Historical data failed:', error);
    return false;
  }
}

async function testIntradayData() {
  console.log('\n=== Testing Intraday Data ===');
  try {
    const response = await mconnect.getIntradayChartData("5", "51", "5minute");
    console.log('Intraday data:', JSON.stringify(response, null, 2));
    return true;
  } catch (error) {
    console.error('Intraday data failed:', error);
    return false;
  }
}

async function testPositionConversion() {
  console.log('\n=== Testing Position Conversion ===');
  try {
    const params = {
      tradingsymbol: "RELIANCE",
      exchange: "NSE",
      transaction_type: "BUY" as const,
      position_type: "day" as const,
      quantity: 1,
      old_product: "MIS",
      new_product: "CNC"
    };
    
    const response = await mconnect.convertPosition(params);
    console.log('Position converted:', response);
    return true;
  } catch (error) {
    console.error('Position conversion failed:', error);
    return false;
  }
}

async function testTradeHistory() {
  console.log('\n=== Testing Trade History ===');
  try {
    const params: TradeHistoryReq = {
      fromdate: "2024-01-01",
      todate: "2024-01-31"
    };
    
    const response = await mconnect.getTradeHistory(params);
    console.log('Trade history:', response);
    return true;
  } catch (error) {
    console.error('Trade history failed:', error);
    return false;
  }
}

async function testLogout() {
  console.log('\n=== Testing Logout ===');
  try {
    const response = await mconnect.logout();
    logger.logOperation('LOGOUT', {}, response, 'SUCCESS');
    console.log('Logout successful:', response);
    return true;
  } catch (error) {
    logger.logError('LOGOUT', error, {});
    console.error('Logout failed:', error);
    return false;
  }
}

async function testCreateBasket() {
  console.log('\n=== Testing Create Basket ===');
  try {
    const params = {
      BaskName: "Test Basket",
      BaskDesc: "Test basket description"
    };
    
    const response = await mconnect.createBasket(params);
    console.log('Basket created:', response);
    return true;
  } catch (error) {
    console.error('Create basket failed:', error);
    return false;
  }
}

async function testFetchBasket() {
  console.log('\n=== Testing Fetch Basket ===');
  try {
    const response = await mconnect.fetchBasket();
    console.log('Baskets fetched:', response);
    return true;
  } catch (error) {
    console.error('Fetch basket failed:', error);
    return false;
  }
}

async function testRenameBasket(rl?: any, question?: (prompt: string) => Promise<string>) {
  if (!rl || !question) {
    const readline = require('readline');
    const localRl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const localQuestion = (prompt: string): Promise<string> => {
      return new Promise((resolve) => {
        localRl.question(prompt, resolve);
      });
    };

    console.log('\n=== Testing Rename Basket ===');
    try {
      const basketId = await localQuestion('Enter Basket ID: ');
      const basketName = await localQuestion('Enter New Basket Name: ');
      localRl.close();
      
      const response = await mconnect.renameBasket({
        BasketId: basketId,
        basketName: basketName
      });
      
      console.log('Basket renamed:', response);
      return true;
    } catch (error) {
      console.error('Rename basket failed:', error);
      return false;
    }
  }

  console.log('\n=== Testing Rename Basket ===');
  try {
    const basketId = await question('Enter Basket ID: ');
    const basketName = await question('Enter New Basket Name: ');
    
    const response = await mconnect.renameBasket({
      BasketId: basketId,
      basketName: basketName
    });
    
    console.log('Basket renamed:', response);
    return true;
  } catch (error) {
    console.error('Rename basket failed:', error);
    return false;
  }
}

async function testDeleteBasket(rl?: any, question?: (prompt: string) => Promise<string>) {
  if (!rl || !question) {
    const readline = require('readline');
    const localRl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const localQuestion = (prompt: string): Promise<string> => {
      return new Promise((resolve) => {
        localRl.question(prompt, resolve);
      });
    };

    console.log('\n=== Testing Delete Basket ===');
    try {
      const basketId = await localQuestion('Enter Basket ID to delete: ');
      localRl.close();
      
      const response = await mconnect.deleteBasket({
        BasketId: basketId
      });
      
      console.log('Basket deleted:', response);
      return true;
    } catch (error) {
      console.error('Delete basket failed:', error);
      return false;
    }
  }

  console.log('\n=== Testing Delete Basket ===');
  try {
    const basketId = await question('Enter Basket ID to delete: ');
    
    const response = await mconnect.deleteBasket({
      BasketId: basketId
    });
    
    console.log('Basket deleted:', response);
    return true;
  } catch (error) {
    console.error('Delete basket failed:', error);
    return false;
  }
}

async function testCalculateBasket() {
  console.log('\n=== Testing Calculate Basket ===');
  try {
    const params = {
      include_exist_pos: "N",
      ord_product: "CNC",
      disc_qty: "0",
      segment: "E",
      trigger_price: "0",
      scriptcode: "22",
      ord_type: "MARKET",
      basket_name: "Test Basket",
      operation: "BUY",
      order_validity: "DAY",
      order_qty: "1",
      script_stat: "A",
      buy_sell_indi: "B",
      basket_priority: "1",
      order_price: "0",
      basket_id: "1",
      exch_id: "NSE"
    };
    
    const response = await mconnect.calculateBasket(params);
    console.log('Basket calculated:', response);
    return true;
  } catch (error) {
    console.error('Calculate basket failed:', error);
    return false;
  }
}

async function testOptionChainMaster() {
  console.log('\n=== Testing Option Chain Master ===');
  try {
    const response = await mconnect.getOptionChainMaster("2");
    console.log('Option chain master:', response);
    return true;
  } catch (error) {
    console.error('Option chain master failed:', error);
    return false;
  }
}

async function testOptionChain() {
  console.log('\n=== Testing Option Chain ===');
  try {
    const response = await mconnect.getOptionChain("1", "1440858600", "26009");
    console.log('Option chain:', response);
    return true;
  } catch (error) {
    console.error('Option chain failed:', error);
    return false;
  }
}

// Interactive testing menu
async function runInteractiveTest() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, resolve);
    });
  };

  console.log('\n MConnect Interactive Testing');
  console.log('================================');
  console.log('Authentication:');
  console.log('1. Test Login (Triggers OTP)');
  console.log('2. Test Generate Session (Enter OTP)');
  console.log('3. Test Verify TOTP');
  console.log('4. Test Full Auth Flow');
  console.log('\nPortfolio & Account:');
  console.log('5. Test Fund Summary');
  console.log('6. Test Positions');
  console.log('7. Test Holdings');
  console.log('8. Test Position Conversion');
  console.log('\nMarket Data:');
  console.log('9. Test Instruments');
  console.log('10. Test OHLC');
  console.log('11. Test LTP');
  console.log('12. Test Historical Data');
  console.log('13. Test Intraday Data');
  console.log('14. Test Loser Gainer');
  console.log('\nOrders:');
  console.log('15. Test Place Order');
  console.log('16. Test Modify Order');
  console.log('17. Test Cancel Order');
  console.log('18. Test Cancel All Orders');
  console.log('19. Test Order Book');
  console.log('20. Test Order Details');
  console.log('21. Test Order Margin');
  console.log('\nTrades:');
  console.log('22. Test Trade Book');
  console.log('23. Test Trade History');
  console.log('\nBaskets:');
  console.log('24. Test Create Basket'); // we dont have execution of basket code 
  console.log('25. Test Fetch Basket');
  console.log('26. Test Rename Basket');
  console.log('27. Test Delete Basket');
  console.log('28. Test Calculate Basket');
  console.log('\nOptions:');
  console.log('29. Test Option Chain Master');
  console.log('30. Test Option Chain');
  console.log('\nOther:');
  console.log('31. Test Logout');
  console.log('32. Run All Tests');
  console.log('0. Exit');

  while (true) {
    const choice = await question('\nEnter your choice (0-32): ');
    
    // Log user choice
    const menuOptions: { [key: string]: string } = {
      '1': 'Test Login (Triggers OTP)',
      '2': 'Test Generate Session (Enter OTP)',
      '3': 'Test Verify TOTP',
      '4': 'Test Full Auth Flow',
      '5': 'Test Fund Summary',
      '6': 'Test Positions',
      '7': 'Test Holdings',
      '8': 'Test Position Conversion',
      '9': 'Test Instruments',
      '10': 'Test OHLC',
      '11': 'Test LTP',
      '12': 'Test Historical Data',
      '13': 'Test Intraday Data',
      '14': 'Test Loser Gainer',
      '15': 'Test Place Order',
      '16': 'Test Modify Order',
      '17': 'Test Cancel Order',
      '18': 'Test Cancel All Orders',
      '19': 'Test Order Book',
      '20': 'Test Order Details',
      '21': 'Test Order Margin',
      '22': 'Test Trade Book',
      '23': 'Test Trade History',
      '24': 'Test Create Basket',
      '25': 'Test Fetch Basket',
      '26': 'Test Rename Basket',
      '27': 'Test Delete Basket',
      '28': 'Test Calculate Basket',
      '29': 'Test Option Chain Master',
      '30': 'Test Option Chain',
      '31': 'Test Logout',
      '32': 'Run All Tests',
      '0': 'Exit'
    };
    
    if (menuOptions[choice]) {
      logger.logUserChoice(choice, menuOptions[choice]);
    }
    
    switch (choice) {
      case '1': await testLogin(); break;
      case '2': await testGenerateSession(rl, question); break;
      case '3': await testVerifyTOTP(rl, question); break;
      case '4': await testFullAuthFlow(); break;
      case '5': await testFundSummary(); break;
      case '6': await testPositions(); break;
      case '7': await testHoldings(); break;
      case '8': await testPositionConversion(); break;
      case '9': await testInstruments(); break;
      case '10': await testOHLC(); break;
      case '11': await testLTP(); break;
      case '12': await testHistoricalData(); break;
      case '13': await testIntradayData(); break;
      case '14': await testLoserGainer(); break;
      case '15': await testPlaceOrder(); break;
      case '16': await testModifyOrder(rl, question); break;
      case '17': await testCancelOrder(rl, question); break;
      case '18': await testCancelAllOrders(); break;
      case '19': await testOrderBook(); break;
      case '20': await testOrderDetails(rl, question); break;
      case '21': await testOrderMargin(); break;
      case '22': await testTradeBook(); break;
      case '23': await testTradeHistory(); break;
      case '24': await testCreateBasket(); break;
      case '25': await testFetchBasket(); break;
      case '26': await testRenameBasket(rl, question); break;
      case '27': await testDeleteBasket(rl, question); break;
      case '28': await testCalculateBasket(); break;
      case '29': await testOptionChainMaster(); break;
      case '30': await testOptionChain(); break;
      case '31': await testLogout(); break;
      case '32': await runAllTests(); break;
      case '0':
        console.log('👋 Goodbye!');
        logger.logSessionEnd();
        rl.close();
        return;
      default:
        console.log('Invalid choice. Please try again.');
    }
  }
}

// Run all tests sequentially
async function runAllTests() {
  console.log('\n Running All Tests...');
  
  // First authenticate
  console.log('Starting with authentication...');
  const authSuccess = await testFullAuthFlow();
  if (!authSuccess) {
    console.log('Authentication failed. Cannot proceed with other tests.');
    return;
  }
  
  const tests = [
    // Portfolio & Account
    { name: 'Fund Summary', fn: testFundSummary },
    { name: 'Positions', fn: testPositions },
    { name: 'Holdings', fn: testHoldings },
    // Market Data
    { name: 'Instruments', fn: testInstruments },
    { name: 'OHLC', fn: testOHLC },
    { name: 'LTP', fn: testLTP },
    { name: 'Historical Data', fn: testHistoricalData },
    { name: 'Intraday Data', fn: testIntradayData },
    { name: 'Loser Gainer', fn: testLoserGainer },
    // Orders (read-only tests)
    { name: 'Order Book', fn: testOrderBook },
    { name: 'Order Margin', fn: testOrderMargin },
    // Trades
    { name: 'Trade Book', fn: testTradeBook },
    { name: 'Trade History', fn: testTradeHistory },
    // Baskets (read-only tests)
    { name: 'Fetch Basket', fn: testFetchBasket },
    // Options
    { name: 'Option Chain Master', fn: testOptionChainMaster }
  ];

  const results: { name: string; passed: boolean }[] = [];
  
  for (const test of tests) {
    const result = await test.fn();
    results.push({ name: test.name, passed: result });
  }

  console.log('\n Test Results Summary:');
  console.log('========================');
  results.forEach(result => {
    const status = result.passed ? 'PASS' : 'FAIL';
    console.log(`${status} - ${result.name}`);
  });

  const passedCount = results.filter(r => r.passed).length;
  console.log(`\n ${passedCount}/${results.length} tests passed`);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    await runInteractiveTest();
  } else {
    const testName = args[0].toLowerCase();
    
    switch (testName) {
      case 'login':
        await testLogin();
        break;
      case 'session':
        await testGenerateSession();
        break;
      case 'auth':
        await testFullAuthFlow();
        break;
      case 'funds':
        await testFundSummary();
        break;
      case 'positions':
        await testPositions();
        break;
      case 'holdings':
        await testHoldings();
        break;
      case 'instruments':
        await testInstruments();
        break;
      case 'ohlc':
        await testOHLC();
        break;
      case 'ltp':
        await testLTP();
        break;
      case 'totp':
        await testVerifyTOTP();
        break;
      case 'placeorder':
        await testPlaceOrder();
        break;
      case 'modifyorder':
        await testModifyOrder();
        break;
      case 'cancelorder':
        await testCancelOrder();
        break;
      case 'cancelall':
        await testCancelAllOrders();
        break;
      case 'orderdetails':
        await testOrderDetails();
        break;
      case 'ordermargin':
        await testOrderMargin();
        break;
      case 'losergainer':
        await testLoserGainer();
        break;
      case 'historical':
        await testHistoricalData();
        break;
      case 'intraday':
        await testIntradayData();
        break;
      case 'conversion':
        await testPositionConversion();
        break;
      case 'tradehistory':
        await testTradeHistory();
        break;
      case 'logout':
        await testLogout();
        break;
      case 'createbasket':
        await testCreateBasket();
        break;
      case 'fetchbasket':
        await testFetchBasket();
        break;
      case 'renamebasket':
        await testRenameBasket();
        break;
      case 'deletebasket':
        await testDeleteBasket();
        break;
      case 'calculatebasket':
        await testCalculateBasket();
        break;
      case 'optionmaster':
        await testOptionChainMaster();
        break;
      case 'optionchain':
        await testOptionChain();
        break;
      case 'all':
        await runAllTests();
        break;
      default:
        console.log('Unknown test:', testName);
        console.log('Available tests: login, session, totp, auth, funds, positions, holdings, instruments, ohlc, ltp, historical, intraday, placeorder, modifyorder, cancelorder, cancelall, orderdetails, ordermargin, losergainer, conversion, trades, tradehistory, logout, createbasket, fetchbasket, renamebasket, deletebasket, calculatebasket, optionmaster, optionchain, all');
    }
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { main };
