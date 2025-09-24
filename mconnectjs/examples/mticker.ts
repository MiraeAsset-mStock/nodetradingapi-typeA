/**
 * MTicker WebSocket Client Example
 * 
 * This example demonstrates how to use the MTicker class for real-time market data
 * streaming, order updates, and WebSocket connection management with auto-reconnection.
 */

import { MTicker } from '../lib';
import { FeedData, TypeAUpdate } from '../types';

// Initialize MTicker client

const apiKey = "Your_API_Key_Here"; // Replace with your actual API key
const accessToken = "Generated_Access_Token"; // Generated from MConnect authentication

const ticker = new MTicker({
  api_key: apiKey,
  access_token: accessToken
});

/**
 * Event Handlers for WebSocket Events
 */

/**
 * Handle incoming tick data
 * This is called whenever market data is received
 */
function onTicks(tick: FeedData): void {
  console.log('Market Tick Received:');
  console.log(`${tick.InstrumentToken}: LTP=${tick.LastPrice}, Mode=${tick.Mode}`);
}

/**
 * Handle successful WebSocket connection
 * Subscribe to instruments after connection is established
 */
function onConnect(): void {
  console.log('WebSocket Connected Successfully');
  
  // Subscribe to instruments (example tokens)
  const tokens = [
    2885, 
    26000,  
    22,  
    884737 
  ];
  
  console.log('📡 Subscribing to instruments:', tokens);
  ticker.subscribe(tokens);
  
  console.log('Subscription completed');
}

/**
 * Handle WebSocket disconnection
 */
function onDisconnect(): void {
  console.log(' WebSocket Disconnected');
}

/**
 * Handle WebSocket errors
 */
function onError(event: Event): void {
  console.error('WebSocket Error:', event);
}

/**
 * Handle WebSocket connection close
 */
function onClose(): void {
  console.log('WebSocket Connection Closed');
}

/**
 * Handle order updates
 * This is called when there are updates to your orders
 */
function onOrderUpdate(order: TypeAUpdate): void {
  console.log('Order Update Received:');
  console.log(`Order ID: ${order.order_id}`);
  console.log(`Status: ${order.status}`);
  console.log(`Symbol: ${order.tradingsymbol}`);
  console.log(`Quantity: ${order.quantity}`);
  console.log(`Price: ${order.price}`);
}

/**
 * Handle auto-reconnection attempts
 */
function onReconnecting(attempt: number, maxAttempts: number): void {
  console.log(`Reconnecting... Attempt: ${attempt}/${maxAttempts}`);
}

/**
 * Setup WebSocket Event Listeners
 */
function setupEventListeners(): void {
  console.log('Setting up event listeners...');
  
  // Core events
  ticker.onBroadcastReceived = onTicks;
  ticker.onConnect = onConnect;
  ticker.onClose = onClose;
  ticker.onError = onError;
  ticker.onOrderTradeReceived = onOrderUpdate;
  ticker.onReconnecting = onReconnecting;
  
  console.log('Event listeners configured');
}

/**
 * Demonstrate subscription management
 */
function demonstrateSubscriptionManagement(): void {
  console.log('\n=== Subscription Management Demo ===');
  
  setTimeout(() => {
    // Add more instruments after 10 seconds
    const additionalTokens = [177665, 225537]; // WIPRO, ONGC
    console.log('Adding more subscriptions:', additionalTokens);
    ticker.subscribe(additionalTokens);

  }, 10000);
  
  setTimeout(() => {
    // Remove some subscriptions after 20 seconds
    const tokensToRemove = [256265]; // TCS
    console.log('➖ Removing subscriptions:', tokensToRemove);
    ticker.unsubscribe(tokensToRemove);
  }, 20000);
  
  setTimeout(() => {
    // Show current subscriptions after 25 seconds
    const currentTokens = ticker.getSubscribedTokens();
    console.log('Currently subscribed tokens:', currentTokens);
  }, 25000);
}

/**
 * Demonstrate connection management
 */
function demonstrateConnectionManagement(): void {
  console.log('\n=== Connection Management Demo ===');
  
  setTimeout(() => {
    console.log('Connection Status:', ticker.isConnected() ? 'Connected' : 'Disconnected');
  }, 5000);
  
  // Demonstrate manual disconnect and reconnect
  setTimeout(() => {
    console.log('Manually disconnecting...');
    ticker.disconnect();
  }, 30000);
  
  setTimeout(() => {
    console.log('Manually reconnecting...');
    ticker.connect();
  }, 35000);
}

/**
 * Setup auto-reconnection with custom parameters
 */
function setupAutoReconnection(): void {
  console.log('Auto-reconnection is built-in with MTicker');
  console.log('Auto-reconnection enabled by default');
}

/**
 * Graceful shutdown handler
 */
function setupGracefulShutdown(): void {
  const gracefulShutdown = () => {
    console.log('\n Shutting down gracefully...');
    
    if (ticker.isConnected()) {
      ticker.disconnect();
    }
    
    setTimeout(() => {
      console.log('Goodbye!');
      process.exit(0);
    }, 1000);
  };
  
  // Handle various shutdown signals
  process.on('SIGINT', gracefulShutdown);   // Ctrl+C
  process.on('SIGTERM', gracefulShutdown);  // Termination signal
  process.on('SIGUSR2', gracefulShutdown);  // Nodemon restart
}

/**
 * Display connection statistics periodically
 */
function displayStats(): void {
  setInterval(() => {
    if (ticker.isConnected()) {
      const subscribedTokens = ticker.getSubscribedTokens();
      console.log(`Stats - Connected , Subscribed Instruments: ${subscribedTokens.length}`);
    } else {
      console.log('Stats - Connected');
    }
  }, 30000); // Every 30 seconds
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  try {
    console.log('=== MTicker WebSocket Client Example ===\n');
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup auto-reconnection
    setupAutoReconnection();
    
    // Setup graceful shutdown
    setupGracefulShutdown();
    
    // Start displaying stats
    displayStats();
    
    // Connect to WebSocket
    console.log('Starting WebSocket connection...');
    ticker.connect();
    
    // Demonstrate advanced features
    demonstrateSubscriptionManagement();
    demonstrateConnectionManagement();
    
    console.log('MTicker client is running. Press Ctrl+C to stop.\n');
    
  } catch (error) {
    console.error(' Failed to start MTicker client:', error);
    process.exit(1);
  }
}

/**
 * Advanced Usage Examples
 */

/**
 * Example: Custom tick processing with filtering
 */
function advancedTickProcessing(tick: FeedData): void {
  // Check for significant price movements
  if (tick.LastPrice && tick.Close) {
    const changePercent = ((tick.LastPrice - tick.Close) / tick.Close) * 100;
    if (Math.abs(changePercent) > 2) { // More than 2% change
      console.log('Significant price movement detected:');
      console.log(`${tick.InstrumentToken}: ${changePercent.toFixed(2)}% change`);
    }
  }
}

/**
 * Example: Order update processing with notifications
 */
function advancedOrderProcessing(order: TypeAUpdate): void {
  // Process different order statuses
  switch (order.status) {
    case 'COMPLETE':
      console.log('Order executed successfully:', order.order_id);
      break;
    case 'REJECTED':
      console.log(' Order rejected:', order.status_message);
      break;
    case 'CANCELLED':
      console.log('Order cancelled:', order.order_id);
      break;
    default:
      console.log('Order status update:', order.status);
  }
}

// Error handling for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

export { 
  main,
  advancedTickProcessing,
  advancedOrderProcessing
};
