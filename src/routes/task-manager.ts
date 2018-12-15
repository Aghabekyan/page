import { Router, Request, Response, NextFunction } from 'express';
import { TaskManagerService } from "../services/task-manager.service";
import auth from '../helpers/auth.guard';

const taskManagerService = new TaskManagerService();

export class TaskManagerRouter {

    public router: Router
    public items: any;

    // Initialize the AuthenticateRouter
    constructor() {
        this.router = Router();
        this.init();
    }

    /* Retrieve all from database */

    public retrieveAll(req: Request, res: Response, next: NextFunction) {
        let cards = taskManagerService.retrieveAll(req.params.id);

        cards.then(response => {
            return res.status(200).send(response);
        })
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }

    public retriveByPriority(req: Request, res: Response, next: NextFunction) {
        let cards = taskManagerService.retriveByPriority(req.params.priority, req.params.count);

        cards.then(response => {
            return res.status(200).send(response);
        })
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }

    /* Create a new card */

    public newCard(req: Request, res: Response, next: NextFunction) {

        const io = req.app.get('io');

        let newCard = taskManagerService.newCard(req.body, io);
        newCard.then(
            response => res.status(200).send(response)
        )
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })

    }

    /* Create a new task */

    public newTask(req: Request, res: Response, next: NextFunction) {

        let newTask = taskManagerService.newTask(req.body);

        newTask.then(
            response => {
                return res.status(200).send(response);
            }
        )
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }

    public updateCard(req: Request, res: Response, next: NextFunction) {

        let updateCard = taskManagerService.updateCard(req.body);

        updateCard.then(
            response => {
                return res.status(200).send(response);
            }
        )
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }

    public deleteCard(req: Request, res: Response, next: NextFunction) {

        let deleteCard = taskManagerService.deleteCard(req.params.id);

        deleteCard.then(
            response => {
                return res.status(200).send(response);
            }
        )
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }

    public deleteTask(req: Request, res: Response, next: NextFunction) {

        let deleteTask = taskManagerService.deleteTask(req.body);

        deleteTask.then(
            response => {
                return res.status(200).send(response);
            }
        )
        .catch(error => {
            return res.status(500).send({ message: error.message });
        })
    }

    public markAsDone(req: Request, res: Response, next: NextFunction) {

        let markAsDone = taskManagerService.markAsDone(req.body);

        markAsDone.then(
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
        this.router.post('/new-card', auth, this.newCard);
        this.router.post('/new-task', auth, this.newTask);
        this.router.post('/mark-as-done', auth, this.markAsDone);
        this.router.get('/all/:id?', auth, this.retrieveAll);
        this.router.put('/update-card', auth, this.updateCard);
        this.router.delete('/delete-card/:id', auth, this.deleteCard);
        this.router.post('/delete-task/', auth, this.deleteTask);
        this.router.get('/retrieve-by-priority/:priority/:count', auth, this.retriveByPriority);
    }

}

// Create the AdminsRouter, and export its configured Express.Router
const taskManager = new TaskManagerRouter();
taskManager.init();

export default taskManager.router;
