import { Router, Request, Response, NextFunction } from 'express';
import { CustomizeService } from '../services/customize.service';
import auth from '../helpers/auth.guard';

const customize = new CustomizeService();

export class CustomizeRouter {

    public router: Router
    public items: any;
    // Initialize the AuthenticateRouter
    constructor() {
        this.router = Router();
        this.init();
    }

    public setState(req: Request, res: Response, next: NextFunction) {
        let data = customize.setState(req.body.args);
        data.then(response => res.status(200).send(response))
            .catch(error => res.status(500).send({ message: error.message }))
    }

    public getState(req: Request, res: Response, next: NextFunction) {
        let data = customize.getState();
        data.then(response => res.status(200).send(response))
            .catch(error => res.status(500).send({ message: error.message }))
    }

    init() {
        this.router.post('/set-state', auth, this.setState);
        this.router.get('/get-state/', auth, this.getState);
    }

}

// Create the AdminsRouter, and export its configured Express.Router
const customizeRouter = new CustomizeRouter();
customizeRouter.init();

export default customizeRouter.router;
