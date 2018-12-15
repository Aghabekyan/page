import { Request, Response, NextFunction } from 'express';
import * as auth from './helpers/auth.guard';
import { MessengerService } from "./services/messenger.service";
import socketIO from 'socket.io';
import http from 'http';
import App from './app';

import redis from 'redis';
const client = redis.createClient();



const port = process.env.PORT || 3000;

App.set('port', port);
const server = http.createServer(App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


/**
 *  Setup socket connection.
 */

const io: SocketIO.Server = socketIO(server);
const messengerService = new MessengerService();

App.set('io', io);

io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        let token = auth.checkAuthToken(socket.handshake.query.token);
        if (token) next();
        next(new Error('Authentication error'));
    }
    next(new Error('Authentication error'));
})

io.on('connect', (socket: any) => {

    /**
     * Add new user to redis, and if the user exists then update data.
     * If user disconnected then delete data from redis.
     */

    auth.keepSocketSessions(socket);

    /**
     * After that connection established we are doing two actions.
     * 1. Anyway we are calling service to save the message in database, because if there is not
     * active socket connection for specified user we will loose part of messages.
     *
     * 2. When client sending a message to server, we are listening on message event and after that
     * We are checking does socket id with specified username exists in socket list, if so, we are sending a message.
     */

    socket.on('message', (message: any) => {
        client.get('sockets', (err, data) => {
            if (err) console.log(err + 'error inside socket on message!')

            let socketlist = JSON.parse(data);
            let online = false;

            if (socketlist[message.to]) {
                socket.to(socketlist[message.to]).emit('message', {
                    from: message.from,
                    content: message.content,
                });

                // Emit count of unread messages...
                messengerService.newMessage(message, online).then(response => {
                    console.log('Message has added!')
                    return messengerService.unreadMessagesCount(message.to);
                })
                .then(response => {
                    let count = response[0] && response[0].count || '';
                    socket.to(socketlist[message.to]).emit('notification', {
                        type: 'unread_message_count',
                        data: {
                            count: count
                        }
                    });
                })
                .catch(error => {
                    console.log(error);
                })
            }
            else {
                messengerService.newMessage(message, online).then(response => {
                    console.log('Message has added!')
                })
                .catch(error => {
                    console.log(error);
                })
                console.log('There is no socket connection with specified username')
            }

        })
    })

    socket.on('disconnect', () => {
        auth.deleteSocketSessions(socket);
        console.log('Socket connection finished');
    })
})

/* -------------------------------------------------- */

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(): void {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
}

console.log(`# ---------- App is listening on port ${port} ---------- #`)