
// Simple utility for debug logging with timestamps
export const debugLog = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${new Date().toISOString()}]`, ...args);
  }
};

export default debugLog;
