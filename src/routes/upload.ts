import { Router, Request, Response, NextFunction } from 'express';
import multer  from 'multer';
import fs from 'fs';
import moment from 'moment';
import auth from '../helpers/auth.guard';

const NOW = moment(new Date()).format("MM-DD-YY");


if (!fs.existsSync(`./src/disk/original/${NOW}`)){
    fs.mkdirSync(`./src/disk/original/${NOW}`);
}


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./src/disk/original/${NOW}`)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() * (Math.floor(Math.random() * 89) + 10) + '.jpg')
    }
})

let fileUpload = multer({
    storage: storage,
})

export class UploadRouter {

    router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    single(req: Request, res: Response, next: NextFunction) {
        res.json(`disk/original/${NOW}/${req.file.filename}`);
    }

    multiple(req: Request, res: Response, next: NextFunction) {
        let files: any = req.files;
        files.map((data: any) => {
            res.json(`disk/original/${NOW}/${data.filename}`);
        })
    }

    init() {
        this.router.post('/', auth, fileUpload.single('file'),  this.single);
        this.router.post('/multiple', auth, fileUpload.array('photos', 20),  this.multiple);
    }

}

// Create the CategoriesRouter, and export its configured Express.Router
const uploadRouter = new UploadRouter();
uploadRouter.init();

export default uploadRouter.router;