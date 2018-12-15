import { Router, Request, Response, NextFunction } from 'express';
import { BugReportService } from "../services/bug-report.service";
import auth from '../helpers/auth.guard';

const bugReportService = new BugReportService();

export class BugReportRouter {

    public router: Router
    public items: any;

    // Initialize the AuthenticateRouter
    constructor() {
        this.router = Router();
        this.init();
    }

    /* Retrieve all from database */

    public retrieveAll(req: Request, res: Response, next: NextFunction) {
        let data = bugReportService.retrieveAll(req.body.page);

        data.then(response => {
            return res.status(200).send(response);
        })
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }

    /* Create a new report */

    public newReport(req: Request, res: Response, next: NextFunction) {

        let newCard = bugReportService.newReport(req.body.title, req.body.description, req.body.from);
        newCard.then(
            response => res.status(200).send(response)
        )
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }

    public deleteReport(req: Request, res: Response, next: NextFunction) {

        let data = bugReportService.deleteReport(req.params.id);
        data.then(
            response => res.status(200).send(response)
        )
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }


    // Take each handler, and attach to one of the Express.Router's endpoints.

    init() {
        this.router.post('/new-report', auth, this.newReport);
        this.router.get('/all/:page', auth, this.retrieveAll);
        this.router.delete('/delete-report/:id', auth, this.deleteReport);
    }

}

// Create the AdminsRouter, and export its configured Express.Router
const bugReportRouter = new BugReportRouter();
bugReportRouter.init();

export default bugReportRouter.router;
