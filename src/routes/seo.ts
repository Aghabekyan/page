import { Router, Request, Response, NextFunction } from 'express';
import { SeoService } from "../services/seo.service";
import auth from '../helpers/auth.guard';

const seoService = new SeoService();

export class SeoRouter {

    public router: Router
    public items: any;

    // Initialize the Seo Router
    constructor() {
        this.router = Router();
        this.init();
    }

    /* Retrieve metakeys list from database */

    public retrieveAll(req: Request, res: Response, next: NextFunction) {

        let data = seoService.retrieveAll();
        data.then(response => {
            return res.status(200).send(response);
        })
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }


    /* Update metatags with specified ID - 1 */

    public update(req: Request, res: Response, next: NextFunction) {

        let update = seoService.update(req.body.data);

        update.then(response => {
            return res.status(200).send(response);
        })
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }


    // Take each handler, and attach to one of the Express.Router's endpoints.

    init() {
        this.router.get('/all', this.retrieveAll);
        this.router.put('/update/', auth, this.update);
    }

}

// Create the SeoRouter, and export its configured Express.Router
const seoRouter = new SeoRouter();
seoRouter.init();

export default seoRouter.router;
