import { Router, Request, Response, NextFunction } from 'express';
import { ArticlesService } from "../services/articles.service";
import auth from '../helpers/auth.guard';

const chalk = require('chalk');

const articlesService = new ArticlesService();

export class PostRouter {

    public router: Router
    public items: any;

    // Initialize the AuthenticateRouter
    constructor() {
        this.router = Router();
        this.init();
    }

    /* Retrieve articles list from database */

    public retrieveAll(req: Request, res: Response, next: NextFunction) {

        let common = JSON.parse(req.query.common);

        let posts = articlesService.retrieveAll(common);

        posts.then(response => {
            return res.status(200).send(response);
        })
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }

    public perPeriod(req: Request, res: Response, next: NextFunction) {
        let posts = articlesService.perPeriod(req.params.count, req.params.language, req.params.days);

        posts.then(response => {
            return res.status(200).send(response);
        })
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }

    /* Create a new article */

    public newArticle(req: Request, res: Response, next: NextFunction) {

        let newArticle = articlesService.newArticle(req.body.data);

        newArticle.then(
            response => {
                return res.status(200).send(response);
            }
        )
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }

    /* Update an article */

    public updateArticle(req: Request, res: Response, next: NextFunction) {

        let updateArticle = articlesService.updateArticle(req.body.id, req.body.data);

        updateArticle.then(
            response => {
                return res.status(200).send(response);
            }
        )
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }

    /** Get one article by ID */
    public getOneById(req: Request, res: Response, next: NextFunction) {

        let getOne = articlesService.getOneById(req.params.id);

        getOne.then(
            response => {
                return res.status(200).send(response);
            }
        )
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }

    /* Delete the article with specified ID */

    deleteArticle(req: Request, res: Response, next: NextFunction) {

        let deleteArticle = articlesService.deleteArticle(req.params.id);

        deleteArticle.then(
            response => {
                return res.status(200).send(response);
            }
        )
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })

    }

    // Take each handler, and attach to one of the Express.Router's endpoints.

    init() {
        this.router.post('/new', auth, this.newArticle);
        this.router.get('/all', auth, this.retrieveAll);
        this.router.get('/get/:id', this.getOneById);
        this.router.get('/per-periud/:count/:language/:days', this.perPeriod);
        this.router.put('/update', auth, this.updateArticle);
        this.router.delete('/delete/:id', auth, this.deleteArticle);
    }

}

// Create the AdminsRouter, and export its configured Express.Router
const postRouter = new PostRouter();
postRouter.init();

export default postRouter.router;
