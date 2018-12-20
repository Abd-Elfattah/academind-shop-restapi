const http = require('http');
const app = require('./app');

// Port Number
const port = process.env.port || 3000;

// Create Server
const server = http.createServer(app);


// Listen to Requests
server.listen(port);