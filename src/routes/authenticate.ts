import { Router, Request, Response, NextFunction } from 'express';
import { AuthenticateService } from '../services/authenticate.service'

/**
 * Dom sanitizing requires
 */
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);
const authenticateService = new AuthenticateService();


export class AuthenticateRouter {
    public router: Router

    // Initialize the AuthenticateRouter

    constructor() {
        this.router = Router();
        this.init();
    }

    // Log in the user if credentials are correct

    public async login(req: Request, res: Response, next: NextFunction) {

        let username = DOMPurify.sanitize(req.body.username) || '';
        let password = DOMPurify.sanitize(req.body.password) || '';

        if (!username || !password) {
            res.statusCode = 500;
            return res.json({
                message: 'Please fill in all fields',
            });
        }
        const data = authenticateService.login(username, password, req.body);
        data.then(response => {
            return res.status(200).send(response);
        })
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }

    public refreshAccessToken(req: Request, res: Response, next: NextFunction) {

        const data = authenticateService.refreshAccessToken(req.body.refresh_token);
        data.then(response => {
            return res.status(200).json(response);
        })
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }

    public removeToken(req: Request, res: Response, next: NextFunction) {
        res.send({
            data: 'main route is working!!!'
        });
    }

    public async logOut(req: Request, res: Response, next: NextFunction) {

        let username = DOMPurify.sanitize(req.body.username) || false;

        const data = authenticateService.logOut(username);
        data.then(response => {
            return res.status(200).send(response);
        })
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }


    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.post('/', this.login);
        this.router.post('/refresh-access-token', this.refreshAccessToken);
        this.router.get('/remove_token', this.removeToken);
        this.router.post('/logout', this.logOut);
    }

}

// Create the AuthenticateRouter, and export its configured Express.Router
const authenticateRouter = new AuthenticateRouter();
authenticateRouter.init();

export default authenticateRouter.router;


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiR2V2b3JnIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTMzNzMyNzU0LCJleHAiOjE1NDIzNzI3NTR9.MjmmT_uy1qw0GVNW8zpVaJQ26wcP04_GlUr9iPm-o74
// $2b$14$JCIJO8CjmHaphRlKvlweuuW0NDLrnOJDUuG6i3ZC3D0Y7RiMAH34K
// '{"name":"Gevorg Ghazaryan", "role":"admin","gender":"male"}'