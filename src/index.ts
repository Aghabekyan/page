import { Request, Response, NextFunction } from 'express';
import http from 'http';
import App from './app';





const port = process.env.PORT || 3000;

App.set('port', port);
const server = http.createServer(App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);



/* -------------------------------------------------- */

function onError(error: NodeJS.ErrnoException): void {
    console.log("ERRRRRRRRRRoooooooor")
}

function onListening(): void {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
}

console.log(`# ---------- App is listening on port ${port} ---------- #`)