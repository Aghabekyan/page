import path, { resolve } from 'path';
import express, { json } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

/** TypeORM Connection */

import { createConnection } from "typeorm";

/** TypeORM Connection */

const ENV = process.env.NODE_ENV || 'development';
const config = require('./config/config.json')['development'];

/** Here we are importing all necessary routes for our application */

import MainRouter from './routes/mainRouter';
import AuthenticateRouter from './routes/authenticate';
import AdminsRouter from './routes/admins';
import SeoRouter from './routes/seo';
import CategoriesRouter from './routes/categories';
import UploadRouter from './routes/upload';
import ArticlesRouter from './routes/articles';
import TaskManagerRouter from './routes/task-manager';
import MessengerRouter from './routes/messenger';
import NotificationsRouter from './routes/notifications';
import CustomizeRouter from './routes/customize';
import AnalyticsRouter from './routes/analytics';
import BugReportRouter from './routes/bug-report';



// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    // Configure Express middleware.
    private middleware(): void {
        this.express.use(morgan('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use('/disk', express.static(__dirname + "/disk"));
        /** Helmet can help protect app from some well-known web vulnerabilities by setting HTTP headers appropriately. */
        this.express.use(helmet());
        this.express.use(cors({
            origin: config.dir.allowed_domains,
            optionsSuccessStatus: 200
        }));
    }

    // Configure API endpoints.
    private routes(): void {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */

        let router = express.Router();

        /*
         * create connection with database
         * note that it's not active database connection
         * TypeORM creates connection pools and uses them for your requests
         *
        */
        createConnection().then(connection => {

            this.express.use('/api/authenticate', AuthenticateRouter);
            this.express.use('/api/main', MainRouter);
            this.express.use('/api/admins', AdminsRouter);
            this.express.use('/api/seo', SeoRouter);
            this.express.use('/api/categories', CategoriesRouter);
            this.express.use('/api/upload', UploadRouter);
            this.express.use('/api/article', ArticlesRouter);
            this.express.use('/api/task-manager', TaskManagerRouter);
            this.express.use('/api/messenger', MessengerRouter);
            this.express.use('/api/notifications', NotificationsRouter);
            this.express.use('/api/customize', CustomizeRouter);
            this.express.use('/api/analytics', AnalyticsRouter);
            this.express.use('/api/bug-report', BugReportRouter);

            this.express.use('*', (req, res) => {
                return res.json({
                    message: 'Welcome to Yerevannews.am API. Page not found or something went wrong.',
                    status: 401
                });
            });
        })
        .catch(error => {
            console.log("TypeORM connection error: ", error)
        })

    }
}

export default new App().express;