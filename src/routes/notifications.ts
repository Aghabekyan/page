import { Router, Request, Response, NextFunction } from 'express';
import { NotificationsService } from '../services/notifications.service';
import auth from '../helpers/auth.guard';

const notifications = new NotificationsService();

export class NotificationsRouter {

    public router: Router
    public items: any;
    // Initialize the AuthenticateRouter
    constructor() {
        this.router = Router();
        this.init();
    }

    public unseenNotifications(req: Request, res: Response, next: NextFunction) {
        let data = notifications.unseenNotificationsCount(req.params.owner);
        let dataToSend: any = {
            count: 0,
            notification: '',
        };

        data.then(response =>  {
            dataToSend.count = response;
            return notifications.lastNotification(req.params.owner)
        })
        .then(response => {
            dataToSend.notification = response;
            return res.status(200).send(dataToSend);
        })
        .catch(error => res.status(500).send({ message: error.message }))

    }

    public closeNotifications(req: Request, res: Response, next: NextFunction) {
        let data = notifications.closeNotification(req.params);
        let dataToSend: any = {
            count: 0,
            notification: '',
        };

        data.then(response =>  {
            dataToSend.notification = response;
            return notifications.unseenNotificationsCount(req.params.owner)
        })
        .then(response => {
            dataToSend.count = response;
            return res.status(200).send(dataToSend);
        })
        .catch(error => res.status(500).send({ message: error.message }))
    }

    init() {
        this.router.get('/all/card/:owner', auth, this.unseenNotifications);
        this.router.get('/close/card/:owner/:id', auth, this.closeNotifications);
    }

}

// Create the AdminsRouter, and export its configured Express.Router
const notificationsRouter = new NotificationsRouter();
notificationsRouter.init();

export default notificationsRouter.router;
