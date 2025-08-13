import { MTicker } from '../lib';
import * as fs from 'fs';
import * as path from 'path';

const apiKey = "Add_Your_Actual_API_Key_Here";
const accessToken = "Add_Your_Access_Token_Here"; // Generated from MConnect authentication

async function startWebSocketStream() {
  try {
    console.log('Using access token from config...');

    console.log('Starting WebSocket stream with saved token...');
    
    const mTicker = new MTicker({
      api_key: apiKey,
      access_token: accessToken
    });
    
    // Create feeds file
    const feedsFile = path.join(__dirname, 'market_feeds.log');
    
    // Set up WebSocket callbacks
    mTicker.onConnect = () => {
      console.log('WebSocket connected successfully!');
      mTicker.sendLoginAfterConnect();
      mTicker.subscribe([22]);
      mTicker.setMode('full', [22]);
      console.log('Subscribed to token 5633 in full mode');
    };
    
    mTicker.onBroadcastReceived = (tick) => {
      const now = new Date();
      const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')},${String(now.getMilliseconds()).padStart(3, '0')}`;
      
      const logEntry = `${timestamp} Ticks: [${JSON.stringify(tick)}]\n`;
      
      // Append to file
      fs.appendFileSync(feedsFile, logEntry);
      
      console.log('Market data saved:', {
        token: tick.InstrumentToken,
        price: tick.LastPrice,
        mode: tick.Mode
      });
    };
    
    mTicker.onOrderTradeReceived = (order) => {
      console.log('Order update:', order);
    };
    
    mTicker.onError = (error) => {
      console.error('WebSocket error:', error);
    };
    
    mTicker.onClose = () => {
      console.log('WebSocket disconnected');
      process.exit(0);
    };
    
    // Connect WebSocket
    mTicker.connect();
    
    console.log('Feeds will be saved to:', feedsFile);
    console.log('Press Ctrl+C to stop and disconnect...');
    
    // Handle manual interruption
    process.on('SIGINT', () => {
      console.log('\nManual interruption received, disconnecting...');
      mTicker.disconnect();
    });
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

startWebSocketStream();