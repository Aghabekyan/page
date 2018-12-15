// import { Router, Request, Response, NextFunction } from 'express';
// import { CategoriesService } from "../services/categories.service";
//
// const categoriesService = new CategoriesService();
//
// export class CategoriesRouter {
//
//     public router: Router
//     public items: any;
//
//     constructor() {
//         this.router = Router();
//         this.init();
//     }
//
//     public retrieveAll(req: Request, res: Response, next: NextFunction) {
//         let data = categoriesService.retrieveAll();
//
//         data.then(response => res.status(200).send(response))
//             .catch(error => res.status(500).send({ message: error.message }))
//     }
//
//     public add(req: Request, res: Response, next: NextFunction) {
//         let data = categoriesService.add(req.body.translation, req.body.parentId || null, req.body.sortIndex, req.body.icon);
//
//         data.then(response => res.status(200).send(response))
//             .catch(error => res.status(500).send({ message: error.message }))
//     }
//
//     public update(req: Request, res: Response, next: NextFunction) {
//         let update = categoriesService.update(req.body);
//
//         update.then(response => res.status(200).send(response))
//             .catch(error => res.status(500).send({ message: error.message }))
//     }
//
//     public delete(req: Request, res: Response, next: NextFunction) {
//         let deleteCat = categoriesService.delete(req.params.id);
//
//         deleteCat.then(response => res.status(200).send(response))
//             .catch(error => res.status(500).send({ message: error.message }))
//     }
//
//     // Take each handler, and attach to one of the Express.Router's endpoints.
//
//     init() {
//         this.router.get('/all', this.retrieveAll);
//         this.router.post('/add/', this.add);
//         this.router.put('/update/', this.update);
//         this.router.delete('/delete/:id', this.delete);
//     }
//
// }
//
// // Create the CategoriesRouter, and export its configured Express.Router
// const categoriesRouter = new CategoriesRouter();
// categoriesRouter.init();
//
// export default categoriesRouter.router;
//
// //{"admins":[{"id":1,"username":"gevorghazaryan@gmail.com","data":{"role":"admin","name":"Gevorg Ghazaryan","gender":"male","image":""}}]}