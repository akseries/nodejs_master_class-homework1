/*
 * Primary file for the APi 
 *
 */

 // Dependencies
 const http = require('http');
 const https = require('https');
 const url = require('url');
 const StringDecoder = require('string_decoder').StringDecoder;
 const config = require('./config');
 const fs = require('fs');

 // Instantiating the http server
 let httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
 });

 // Start the server, and have it to listern on port 3000
 httpServer.listen(config.httpPort, () => {
     console.log(`The server listening on the port ${config.httpPort}`);
 });

 // Instantiating the https server
 let httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem'),
 };
 let httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res);
 });

 // Start the server, and have it to listern on port 3000
 httpsServer.listen(config.httpsPort, () => {
     console.log(`The server listening on the port ${config.httpsPort}`);
 });

 // All the server logic for both http and https server
 let unifiedServer = (req, res) => {
     // Get the URL and parse it
     let parseUrl = url.parse(req.url, true);            // true means parse queryStringObject

     // Get the path
     let path = parseUrl.pathname;                       // pathname is the property of the full url path minus queryString 
     let trimmedPath = path.replace(/^\/+|\/+$/g, '');

     // Get query string as object
     let queryStringObject = parseUrl.query;             // query is the property

     // Get the Http request method
     let method = req.method.toLowerCase();

     // Get the header as object
     let headers = req.headers;

     // Get the payload if any
     let decoder = new StringDecoder('utf-8');
     let buffer = '';
     req.on('data', (data) => {
         buffer += decoder.write(data);
     });
     req.on('end', () => {
         buffer += decoder.end();

         // Choose the handler the request should go through, if not is found use not found handler        
         let chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

         // construct the data object to send
         let data = {
             'greet': `Hello world from ${trimmedPath} directory!`,
         };

         // Route the request to the handler specified in the router
         chosenHandler(data, (statusCode, payload) => {
             // use the statuscode define by the handler, or default to 200
             statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
             // use the payload define by the handler, or default empty object
             payload = typeof (payload) == 'object' ? payload : {};

             // Convert payload to string
             let payloadString = JSON.stringify(payload);

             // Return the response
             res.setHeader('content-Type', 'application/json')
             res.writeHead(statusCode);
             res.end(payloadString);

             // Log the resquest path
             console.log(`Returning this response :`, statusCode, payloadString);
         });
     });
 };
 // Define the handlers
 let handlers = {};

 // ping handler
 handlers.ping = (data, callback) => {
    // callback a http status code 200 : Success
    callback(200);  
 };

 // hello handler
 handlers.hello = (data, callback) => {
    // callback a http status code 200 : Success, and json payload
    callback(200, data);  
 };

 // Not found handler
 handlers.notFound = (data, callback) => {
    // callback a http status code 404 : Not Found
    callback(404);
 };
 // Define a request router
 let router = {
    'ping': handlers.ping,
    'hello': handlers.hello,
 };