'use strict';
const http = require('http');
const app = require('./src');

/**
 * Starting application
 */
http.createServer(app).listen(process.env.PORT || 3000, () => {
  console.log('%s - Server starting...', new Date());
});