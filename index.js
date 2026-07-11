/**
 * @file index.js
 * CommonJS (CJS) entry point wrapper for alwayscodex-api
 */
const client = require('./src/client.js');
client.codex = client;
module.exports = client;
