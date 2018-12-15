import { Router, Request, Response, NextFunction } from 'express';
import { AnalyticsService } from "../services/analytics.service";
import auth from '../helpers/auth.guard';

const analyticsService = new AnalyticsService();

export class AnalyticsRouter {

    public router: Router
    public items: any;

    // Initialize the Seo Router
    constructor() {
        this.router = Router();
        this.init();
    }

    /* Retrieve metakeys list from database */

    public todaysAnalytics(req: Request, res: Response, next: NextFunction) {
        let data: any = analyticsService.todaysAnalytics(JSON.parse(req.query.params));

        data.then((response: any) => {
            return res.status(200).send(response);
        })
        .catch((error: Error) => {
            return res.status(500).send({ message: error.message });
        })
    }


    /* Update metatags with specified ID - 1 */

    public update(req: Request, res: Response, next: NextFunction) {

        let update = analyticsService.update(req.body.data);

        update.then(response => {
            return res.status(200).send(response);
        })
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }

    // Take each handler, and attach to one of the Express.Router's endpoints.

    init() {
        this.router.get('/get-by-category', auth, this.todaysAnalytics);
        this.router.put('/update/', auth, this.update);
    }

}

// Create the SeoRouter, and export its configured Express.Router
const analyticsRouter = new AnalyticsRouter();
analyticsRouter.init();

export default analyticsRouter.router;
