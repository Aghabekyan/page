/**
 * Dom sanitizing requires
 */
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

import { getRepository, In, getManager } from "typeorm";
import { Articles } from "../entity/Articles";
import { Categories } from "../entity/Categories";

export class AnalyticsService {

    public async todaysAnalytics(params: any) {

        let categories: string = DOMPurify.sanitize(Object.keys(params.cats)) || '';
        let yesterdayState: boolean = params.yesterday || false;

        try {

            // retrieve and modify categories

            let getCategories: any = {};
            await this.getCategories(categories).then(
                result => getCategories = result,
                error => {
                    throw new Error(error.message)
                }
            )

            const repository = getRepository(Articles);
            const today = await repository.query(`
                    SELECT SUM(viewsCount.views), viewsCount.subdomain from (
                    SELECT articles.id, articles."views", articles.published, cat.subdomain subdomain
                    FROM articles
                    LEFT JOIN cat_rel cat
                    ON cat."articleId" = articles.id
                    WHERE articles.published > timestamp 'today'
                    AND cat.subdomain IN (${categories})
                    group BY(cat.subdomain, articles.id)
                ) as viewsCount group by(viewsCount.subdomain)
            `);

            let yesterday = null;

            if (yesterdayState) {
                yesterday = await repository.query(`
                    SELECT SUM(viewsCount.views), viewsCount.subdomain from (
                    SELECT articles.id, articles."views", articles.published, cat.subdomain subdomain
                    FROM articles
                    LEFT JOIN cat_rel cat
                    ON cat."articleId" = articles.id
                    WHERE articles.published > current_date - 1
                    AND articles.published < timestamp 'today'
                    AND cat.subdomain IN (${categories})
                    group BY(cat.subdomain, articles.id)
                ) as viewsCount group by(viewsCount.subdomain)`);
            }

            return Promise.all([today, yesterday]).then(response => {
                let finalData: any = {
                    today: {},
                    yesterday: {}
                }

                const today = response[0];
                const yesterday = response[1];
                let index = 0;
                for (let cat in params.cats) {

                    let todayCurrent: any = today[index] || {};
                    let yesterdayCurrent: any = yesterday[index] || {};
                    finalData.today[cat] = {
                        id: todayCurrent.subdomain || cat,
                        views: todayCurrent.sum ? parseInt(todayCurrent.sum) : 0,
                        title: todayCurrent.subdomain ? getCategories[todayCurrent.subdomain].translation : getCategories[cat].translation,
                        icon: todayCurrent.subdomain ? getCategories[todayCurrent.subdomain].icon : getCategories[cat].icon,
                    };

                    finalData.yesterday[cat] = {
                        id: yesterdayCurrent.subdomain || cat,
                        views: yesterdayCurrent.sum ? parseInt(yesterdayCurrent.sum) : 0,
                        title: yesterdayCurrent.subdomain ? getCategories[yesterdayCurrent.subdomain].translation : getCategories[cat].translation,
                        icon: yesterdayCurrent.subdomain ? getCategories[yesterdayCurrent.subdomain].icon : getCategories[cat].icon,
                    }
                    index++;
                }

                return finalData;
            })
            .catch(error => {
                throw new Error(error.message);
            })
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    public async getCategories(categories: any) {
        let cats = categories.split(',') || [];

        try {
            const connection = await getManager();
            const loadedCategories = await connection.getRepository(Categories).find({
                id: In(cats)
            });

            let filteredCates: any = {};

            loadedCategories.map(result => {
                filteredCates[result.id] = {
                    name: result.name,
                    translation: result.translation,
                    icon: result.icon
                }
            })
            return filteredCates;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}