
/** Dom sanitizing requires */

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

/** Require entities */

import { getRepository, getManager, getConnection } from "typeorm";
import { BugReport } from '../entity/BugReport';
import { Admin } from '../entity/Admin';
import { Helpers } from '../helpers/shared';


import redis from 'redis';
const helpers = new Helpers();

export class BugReportService {

    public async retrieveAll(page: number) {

        try {

            let adminNames: any = {};
            let admins = await getManager()
                .createQueryBuilder(Admin, "admin")
                .getMany();

            admins.map(data => {
                adminNames[data.id] = data.data.name;
            })


            let skip = typeof page == 'undefined' ? 0 : page * 30;
            let reports = await getManager()
                .createQueryBuilder(BugReport, "report")
                .orderBy('report.id', 'DESC');

            // Get count for pagination
            let count = await reports.getCount();

            reports.skip(skip)
            reports.take(30)

            let result = await reports.getMany();

            let finalResult: Array<object> = [];

            result.map(data => {
                finalResult.push({
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    from: adminNames[data.from],
                    date: helpers.date(data.createdAt)
                })
            })


            return {
                items: finalResult,
                count: count
            };

        }
        catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }


    public async newReport(title: string, description: string, from: number) {
        try {

            let adminNames: any = {};
            let admins = await getManager()
                .createQueryBuilder(Admin, "admin")
                .getMany();

            admins.map(data => {
                adminNames[data.id] = data.data.name;
            })

            const manager = getManager();
            const report = await manager.insert(BugReport, {
                title: title,
                description: description,
                from: from
            });

            if (report.identifiers[0] && report.identifiers[0].id) {
                return {
                    id: report.identifiers[0].id,
                    title: title,
                    description: description,
                    from: adminNames[from],
                    date: helpers.date(new Date())
                }
            }
            return false;

        }
        catch (error) {
            throw new Error(error.message);
        }
    }


    public async deleteReport(id: any) {
        const manager = getManager();
        const connection = manager.connection;
        try {
            const tasks = getRepository(BugReport);
            return await tasks.delete(id);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}