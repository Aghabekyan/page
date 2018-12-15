import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import redis from 'redis';
const config = require('../config/config.json');

let client = redis.createClient();


function auth(req: Request, res: Response, next: NextFunction) {
    let token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret.API, function (err: any, decoded: any) {

        /**
         * If error occurs it means that the user didn't pass the authentication so we are returning error with status 401.
         **/

        if (err) return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
        // if everything good, save to request for use in other routes
        req.app.set('user', {
            id: decoded.id
        })
        next();
    });
}


function checkAuthToken(token: string) {
    if (!token) return false;

    return jwt.verify(token, config.secret.API, function (err: any, decoded: any) {
        if (err) return false;
        return true;
    });
}

function parseToken(token: string) {
    if (!token) return false;

    return jwt.verify(token, config.secret.API, (err: any, decoded: any) => {
        if (err) return null;
        return decoded;
    })

}

function keepSocketSessions(socket: any) {
    let decoded: any = jwt.decode(socket.handshake.query.token);

    let socket_id = decoded.id

    client.get('sockets', (error, data) => {
        let sockets = JSON.parse(data) || {};
        sockets[socket_id] = socket.id;
        client.set('sockets', JSON.stringify(sockets))
        console.log('|-------------- Socket connection is started ---------------- >>>');
    })
}

function deleteSocketSessions(socket: any) {
    client.get('sockets', (error, data) => {
        if (error) console.log('ERROR WHILE DELETING USER FROM SOCKETS LIST');
        let sockets = JSON.parse(data);

        if (!!sockets) {
            let userToDelete: any = Object.keys(sockets).find(key => sockets[key] === socket.id) || '';
            delete sockets[userToDelete];
            client.set('sockets', JSON.stringify(sockets));
            console.log('|-------------- Socket connection is finished ---------------- >>>');
        }
    })
}

export default auth;
export { checkAuthToken, keepSocketSessions, deleteSocketSessions, parseToken };