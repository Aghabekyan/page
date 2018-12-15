import { Router, Request, Response, NextFunction } from 'express';
import { StatisticsService } from "../services/statistics.service";
import auth from '../helpers/auth.guard';

const statisticsService = new StatisticsService();

export class StatisticsRouter {

    public router: Router
    public items: any;

    // Initialize the Seo Router
    constructor() {
        this.router = Router();
        this.init();
    }

    public retrieveAll(req: Request, res: Response, next: NextFunction) {

        let data = statisticsService.retrieveAll();
        data.then(response => {
            return res.status(200).send(response);
        })
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }



    // Take each handler, and attach to one of the Express.Router's endpoints.
    init() {
        this.router.get('/all', this.retrieveAll);
    }

}

// Create the SeoRouter, and export its configured Express.Router
const statisticsRouter = new StatisticsRouter();
statisticsRouter.init();

export default statisticsRouter.router;
