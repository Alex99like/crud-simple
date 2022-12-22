import http from 'http'
import net from 'node:net';
import { URL } from 'node:url';

// Create an HTTP tunneling proxy
// const proxy = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end('okay');
// });
// proxy.on('connect', (req, clientSocket, head) => {
//   // Connect to an origin server
//   const { port, hostname } = new URL(`http://${req.url}`);
//   const serverSocket = net.connect(+port || 80, hostname, () => {
//     clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
//                     'Proxy-agent: Node.js-Proxy\r\n' +
//                     '\r\n');
//     serverSocket.write(head);
//     serverSocket.pipe(clientSocket);
//     clientSocket.pipe(serverSocket);
//   });
// });

// // Now that proxy is running
// proxy.listen(1337, '127.0.0.1', () => {

//   // Make a request to a tunneling proxy
//   const options = {
//     port: 1337,
//     host: '127.0.0.1',
//     method: 'CONNECT',
//     path: 'www.google.com:80'
//   };

//   const req = http.request(options);
//   req.end();

//   req.on('connect', (res, socket, head) => {
//     console.log('got connected!');

//     // Make a request over an HTTP tunnel
//     socket.write('GET / HTTP/1.1\r\n' +
//                  'Host: www.google.com:80\r\n' +
//                  'Connection: close\r\n' +
//                  '\r\n');
//     socket.on('data', (chunk) => {
//       console.log(chunk.toString());
//     });
//     socket.on('end', () => {
//       proxy.close();
//     });
//   });
// });


// const server = http.createServer((req, res) => {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('okay');
//   });
//   server.on('upgrade', (req, socket, head) => {
//     socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
//                  'Upgrade: WebSocket\r\n' +
//                  'Connection: Upgrade\r\n' +
//                  '\r\n');
  
//     socket.pipe(socket); // echo back
//   });
  
//   // Now that server is running
//   server.listen(1337, '127.0.0.1', () => {
  
//     // make a request
//     const options = {
//       port: 1337,
//       host: '127.0.0.1',
//       headers: {
//         'Connection': 'Upgrade',
//         'Upgrade': 'websocket'
//       }
//     };
  
//     const req = http.request(options);
//     req.end();
  
//     req.on('upgrade', (res, socket, upgradeHead) => {
//       console.log('got upgraded!');
//       socket.end();
//       process.exit(0);
//     });
//   });
  
// http.request({

// })
// http.get({
//   hostname: 'localhost',
//   port: 80,
//   path: '/',
//   agent: false  // Create a new agent just for this one request
// }, (res) => {
//   // Do stuff
// }).on('socket', (socket) => {
//   socket.emit('agentRemove');
// });