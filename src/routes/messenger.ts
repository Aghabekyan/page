import { Router, Request, Response, NextFunction } from 'express';
import { MessengerService } from "../services/messenger.service";
import auth from '../helpers/auth.guard';

import redis from 'redis';
const client = redis.createClient();

const messengerService = new MessengerService();

export class MessengerRouter {

    public router: Router
    public items: any;

    // Initialize the AuthenticateRouter
    constructor() {
        this.router = Router();
        this.init();
    }

    public getConversation(req: Request, res: Response, next: NextFunction) {

        let messages = messengerService.getConversation(req.params.first, req.params.second, req.params.postion);

        messages.then(response => res.status(200).send(response))
                .catch(error => res.status(500).send({ message: error.message }))
    }

    public retrieveLastMessages(req: Request, res: Response, next: NextFunction) {
        let user = req.app.get('user');
        let messages = messengerService.retrieveLastMessages(user.id);

        messages.then(response => res.status(200).send(response))
                .catch(error => res.status(500).send({ message: error.message }))
    }

    public unreadMessagesCount(req: Request, res: Response, next: NextFunction) {

        let messages = messengerService.unreadMessagesCount(req.params.id);
        console.log("----------------------------*********************************----------------------------------------------------")
        console.log(messages)
        messages.then(response => {
            let count = response[0] && response[0].count ? response[0].count : 0;
            res.status(200).send({ message: count })
        })
        .catch(error => res.status(500).send({ message: error.message }))
    }

    public markAsRead(req: Request, res: Response, next: NextFunction) {

        let messages = messengerService.markAsRead(req.params.from, req.params.to);

        messages.then(response => res.status(200).send(response))
                .catch(error => res.status(500).send({ message: error.message }))
    }

    // Take each handler, and attach to one of the Express.Router's endpoints.

    init() {
        this.router.get('/conversation/:first/:second/:postion', auth, this.getConversation);
        this.router.get('/unread-messages-count/:id', auth, this.unreadMessagesCount);
        this.router.get('/last-messages', auth, this.retrieveLastMessages);
        this.router.get('/mark-as-read/:from/:to', auth, this.markAsRead);
    }
}

// Create the AdminsRouter, and export its configured Express.Router
const messengerRouter = new MessengerRouter();
messengerRouter.init();

export default messengerRouter.router;
