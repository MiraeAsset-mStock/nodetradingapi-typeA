import * as fs from 'fs';
import * as path from 'path';

export class Logger {
  private static logFile = path.join(process.cwd(), 'mconnect.log');

  static log(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = data 
      ? `${timestamp} - ${message}: ${JSON.stringify(data)}\n`
      : `${timestamp} - ${message}\n`;
    
    fs.appendFileSync(this.logFile, logEntry);
    console.log(message, data || '');
  }

  static error(message: string, error?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - ERROR - ${message}: ${error}\n`;
    
    fs.appendFileSync(this.logFile, logEntry);
    console.error(message, error || '');
  }
}