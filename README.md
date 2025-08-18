# MConnect TypeA SDK

[![npm version](https://badge.fury.io/js/mconnecttypea.svg)](https://www.npmjs.com/package/@mstock/mconnecta)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

The official TypeScript/JavaScript client for communicating with the MConnect TypeA Trading API.

MConnect TypeA is a comprehensive trading API that provides capabilities required to build a complete investment and trading platform. Execute orders in real time, manage user portfolio, stream live market data (WebSockets), and more.

## Documentation

- [MConnect API documentation](https://tradingapi.mstock.com/)
- [Examples](./examples/)

## Requirements

- Node.js v18.0.0+

## Installation

Install via [npm](https://www.npmjs.com/package/@mstock/mconnecta)

```bash
npm install @mstock/mconnecta
```

## Getting started with API

```typescript
import { MConnect } from '@mstock/mconnecta';

const apiKey = "your_api_key";
const username = "your_username";
const password = "your_password";

const client = new MConnect({ api_key: apiKey });

async function init() {
  try {
    await authenticateUser();
    await getPortfolio();
  } catch (err) {
    console.error(err);
  }
}

async function authenticateUser() {
  try {
    // Step 1: Login (triggers OTP)
    const loginResponse = await client.login({ username, password });
    console.log('Login successful, OTP sent');
    
    // Step 2: Get OTP from user input
    const otp = "123456"; // Get from user input
    
    // Step 3: Generate session with OTP
    const sessionData = await client.generateSession({
      api_key: apiKey,
      request_token: otp,
      checksum: 'W'
    });
    
    client.setAccessToken(sessionData.access_token);
    console.log('Session generated:', sessionData);
  } catch (err) {
    console.error('Authentication failed:', err);
  }
}

async function getPortfolio() {
  try {
    const positions = await client.getNetPositions();
    const holdings = await client.getHoldings();
    const funds = await client.getFundSummary();
    
    console.log('Positions:', positions);
    console.log('Holdings:', holdings);
    console.log('Funds:', funds);
  } catch (err) {
    console.error('Error getting portfolio:', err);
  }
}

// Initialize the API calls
init();
```

## Getting started with WebSocket client

```typescript
import { MTicker } from '@mstock/mconnecta';

const apiKey = "your_api_key";
const accessToken = "generated_access_token";

const ticker = new MTicker({
  api_key: apiKey,
  access_token: accessToken
});

ticker.connect();

// Set up event handlers
ticker.onBroadcastReceived = onTicks;
ticker.onConnect = subscribe;
ticker.onClose = onDisconnect;
ticker.onError = onError;
ticker.onOrderTradeReceived = onOrderUpdate;

function onTicks(tick: any): void {
  console.log('Market data:', {
    token: tick.InstrumentToken,
    price: tick.LastPrice,
    mode: tick.Mode
  });
}

function subscribe(): void {
  ticker.sendLoginAfterConnect();
  const tokens = [5633, 2885]; // Instrument tokens
  ticker.subscribe(tokens);
  ticker.setMode('full', tokens);
}

function onDisconnect(): void {
  console.log('WebSocket disconnected');
}

function onError(error: any): void {
  console.log('WebSocket error:', error);
}

function onOrderUpdate(order: any): void {
  console.log('Order update:', order);
}
```

## Order Management

```typescript
// Place an order
const orderParams = {
  exchange: "NSE",
  tradingsymbol: "RELIANCE",
  transaction_type: "BUY",
  quantity: 1,
  product: "CNC",
  order_type: "LIMIT",
  price: 2500,
  validity: "DAY",
  variety: "regular"
};

const orderResponse = await client.placeOrder(orderParams);
console.log('Order placed:', orderResponse);

// Modify an order
const modifyParams = {
  order_id: "ORDER123",
  variety: "regular",
  quantity: 2,
  price: 2600,
  order_type: "LIMIT"
};

const modifyResponse = await client.modifyOrder(modifyParams);
console.log('Order modified:', modifyResponse);

// Cancel an order
const cancelResponse = await client.cancelOrder("ORDER123");
console.log('Order cancelled:', cancelResponse);

// Get order book
const orderBook = await client.getOrderBook();
console.log('Order book:', orderBook);
```

## API Reference

### Authentication
| Method | Description |
|--------|-------------|
| `login()` | Login with username/password |
| `generateSession()` | Generate session with OTP |
| `verifyTOTP()` | Verify TOTP |
| `logout()` | Logout |

### Orders
| Method | Description |
|--------|-------------|
| `placeOrder()` | Place new order |
| `modifyOrder()` | Modify existing order |
| `cancelOrder()` | Cancel order |
| `getOrderBook()` | Get order book |
| `orderMargin()` | Calculate order margin |

### Portfolio
| Method | Description |
|--------|-------------|
| `getFundSummary()` | Get fund summary |
| `getNetPositions()` | Get positions |
| `getHoldings()` | Get holdings |
| `convertPosition()` | Convert position |

### Market Data
| Method | Description |
|--------|-------------|
| `getInstruments()` | Get instruments master |
| `getOHLC()` | Get OHLC data |
| `getLTP()` | Get last traded price |
| `getHistoricalCandleData()` | Historical data |
| `loserGainer()` | Top gainers/losers |


## WebSocket Streaming

The SDK includes real-time WebSocket streaming capabilities for live market data and order updates.

### WebSocket Features
- Real-time market data streaming
- Live order and trade updates
- Multiple subscription modes (LTP, Quote, Full)
- Automatic reconnection handling
- Event-driven architecture

### WebSocket Dependencies
- `ws`: WebSocket client library
- `@types/ws`: TypeScript definitions for WebSocket

### Running WebSocket Tests

```bash
# Run WebSocket streaming tests
npm run websocket

# Run REST API tests
npm run test
```

### WebSocket Usage Example

```typescript
import { MTicker } from '@mstock/mconnecta';

const ticker = new MTicker({
  api_key: "your_api_key",
  access_token: "your_access_token"
});

// Connect to WebSocket
ticker.connect();

// Event handlers
ticker.onConnect = () => {
  console.log('WebSocket connected');
  ticker.sendLoginAfterConnect();
  
  // Subscribe to instruments
  const tokens = [2885, 5633]; // RELIANCE, HDFCBANK
  ticker.subscribe(tokens);
  ticker.setMode('full', tokens);
};

ticker.onBroadcastReceived = (tick) => {
  console.log('Market data:', {
    token: tick.InstrumentToken,
    ltp: tick.LastPrice,
    volume: tick.Volume
  });
};

ticker.onOrderTradeReceived = (order) => {
  console.log('Order update:', order);
};

ticker.onError = (error) => {
  console.error('WebSocket error:', error);
};

ticker.onClose = () => {
  console.log('WebSocket disconnected');
};
```

## A typical web application

In a typical web application where a new instance of views, controllers etc. are created per incoming HTTP request, you will need to initialise a new instance of MConnect client per request as well. This is because each individual instance represents a single user that's authenticated.

Hence, in your web application, typically:

- You will initialise an instance of the MConnect client
- Use the `login()` method to trigger OTP
- At the OTP verification step, obtain the OTP from user input
- Use `generateSession()` to obtain the `access_token` along with authenticated user data
- Store this response in a session and use the stored `access_token` to initialise instances of MConnect client for subsequent API calls.

## Examples

Check the test files for detailed examples:
- [REST API Usage](./examples/mconnect.ts)
- [WebSocket Streaming](./examples/mticker.ts)

## Requirements

- **Node.js** v18.0.0 or higher
- **TypeScript** 4.0+ (optional)
- **MConnect TypeA** trading account
- **API credentials** from MConnect


## License

MIT License - see [LICENSE](LICENSE) file for details.

m.Stock By Mirae Asset Capital Markets (India) Pvt. Ltd. (c) 2025. Licensed under the MIT License.


## Support
For issues, please open an issue on GitHub.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch (feature-xyz)
3. Commit your changes
4. Push the branch and create a pull request
