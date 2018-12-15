import { Router, Request, Response, NextFunction } from 'express';
import { AdminsService } from "../services/admins.service";
import auth from '../helpers/auth.guard';

const adminsService = new AdminsService();


export class AdminsRouter {

    public router: Router
    public items: any;
    // Initialize the AuthenticateRouter
    constructor() {
        this.router = Router();
        this.init();
    }

    /* Retrieve admins list from database */

    public retrieveAll(req: Request, res: Response, next: NextFunction) {
        let admins = adminsService.retrieveAll(req.params.except);

        admins.then(response => res.status(200).send(response))
            .catch(error => res.status(500).send({ message: error.message }))
    }

    /* Create new admin */

    public addAdmin(req: Request, res: Response, next: NextFunction) {

        let newAdmin = adminsService.addAdmin(req.body.data);

        newAdmin.then(response => res.status(200).send(response))
            .catch(error => res.status(500).send({ message: error.message }))
    }

    /* Delete the admin with specified ID */

    public deleteAdmin(req: Request, res: Response, next: NextFunction) {

        let deleteAdmin = adminsService.deleteAdmin(req.params.id);

        deleteAdmin.then(response => res.status(200).send(response))
            .catch(error => res.status(500).send({ message: error.message }))

    }

    /* Retrieve admin's details with specified ID */

    public retrieveAdminDetails(req: Request, res: Response, next: NextFunction) {

        let adminDetails = adminsService.retrieveAdminDetails(req.params.id);

        adminDetails.then(response => res.status(200).send(response))
            .catch(error => res.status(500).send({ message: error.message }))
    }

    /* Update admin with specified ID */

    public updateAdmin(req: Request, res: Response, next: NextFunction) {
        let updateAdmin = adminsService.updateAdmin(req.body.data);

        updateAdmin.then(response => res.status(200).send(response))
            .catch(error => res.status(500).send({ message: error.message }))
    }

    /* Update admin prifile with specified ID */

    public updateAdminProfile(req: Request, res: Response, next: NextFunction) {

        let updateAdminProfile = adminsService.updateAdminProfile(req.body.data);

        updateAdminProfile.then(response => res.status(200).send(response))
            .catch(error => res.status(500).send({ message: error.message }))
    }

    // Take each handler, and attach to one of the Express.Router's endpoints.

    init() {
        this.router.get('/all/:except?', auth, this.retrieveAll);
        this.router.post('/new-admin', auth, this.addAdmin);
        this.router.delete('/delete-admin/:id', auth, this.deleteAdmin);
        this.router.get('/retrieve-admin-details/:id', auth, this.retrieveAdminDetails);
        this.router.put('/update-admin/', auth, this.updateAdmin);
        this.router.put('/update-admin-profile/', auth, this.updateAdminProfile);
    }

}

// Create the AdminsRouter, and export its configured Express.Router
const AdminRouter = new AdminsRouter();
AdminRouter.init();

export default AdminRouter.router;
