import { Router, Request, Response, NextFunction } from 'express';
import auth from '../helpers/auth.guard';
import { getRepository } from "typeorm";
import { Admin } from "../entity/Admin";

class MainRouter {

    public router: Router


    /**
     * Initialize the MainRouter
     */
    constructor() {

        this.router = Router();
        this.init();
    }

    /**
     * GET all Heroes.
     */
    public getAll(req: Request, res: Response, next: NextFunction) {
        getRepository(Admin).find();
        res.send({
            data: 'main route is working!!!'
        });
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.get('/', auth, this.getAll);
    }

}

// Create the MainRouter, and export its configured Express.Router
const mainRouter = new MainRouter();
mainRouter.init();

export default mainRouter.router;