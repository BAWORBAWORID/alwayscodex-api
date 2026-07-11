/**
 * @file index.mjs
 * ES Module (ESM) entry point wrapper for alwayscodex-api
 */
import client, { AlwaysCodex, AlwaysCodexError } from './src/client.js';

export { AlwaysCodex, AlwaysCodexError };
export default client;
