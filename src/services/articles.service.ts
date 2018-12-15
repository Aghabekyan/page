
/** Dom sanitizing requires */

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

/** Require entities */


import { getRepository, getManager, getConnection } from "typeorm";

import { CatRel } from "../entity/CatRel";
import { Articles } from "../entity/Articles";
import { Categories } from "../entity/Categories";
import { Helpers } from "../helpers/shared";

const helpers = new Helpers();

export class ArticlesService {

    public async retrieveAll(params: any) {

        const articles = getRepository(Articles);
        const categories = getRepository(Categories);

        try {

            // Process query params here
            let take = !params.size.length ? 30 : params.size; // size 30 per page
            let skip = (params.page - 1) * take;
            let sort = !params.sort.length ? 'id' : params.sort;
            let order: any = params.order == 'asc' ? 'ASC' : 'DESC'; // ASC | DESC



            let articles = await getManager()
                .createQueryBuilder(Articles, "articles")
                .leftJoinAndSelect("articles.catrel", "cat")
                .where("articles.language = :language", { language: params.language || 'am' });

            /**
             * Here is all filters connected to filtering data on "Show all articles page" */
            // Select an author.
            if (params.author) articles.andWhere("articles.author = :author", { author: params.author })

            // Select date start position.
            if (params.dateFrom) articles.andWhere("articles.published >= :dateFrom", { dateFrom: params.dateFrom })

            // Select date end position.
            if (params.dateTo) articles.andWhere("articles.published < :dateTo", { dateTo: params.dateTo })

            // Check does article belong to main slider.
            if (typeof params.slider != 'undefined') articles.andWhere("articles.slider = :slider", { slider: params.slider == 'Yes' ? true : false })

            // Check does article in most viewed column or not.
            if (typeof params.viewed != 'undefined') articles.andWhere("articles.most_viewed = :viewed", { viewed: params.viewed == 'Yes' ? true : false })

            // Check is article published or not.
            if (typeof params.state != 'undefined') articles.andWhere("articles.state = :state", { state: params.state == 'Yes' ? true : false })

            // Check does article belong to editor column (If yes it means that this article is form "From editor's column").
            if (typeof params.editor != 'undefined') articles.andWhere("articles.show_editor = :editor", { editor: params.editor == 'Yes' ? true : false })

            // Check does article belong to important column.
            if (typeof params.important != 'undefined') articles.andWhere("articles.important = :important", { important: params.important == 'Yes' ? true : false })

            // Check does article belong to ticker column.
            if (typeof params.ticker != 'undefined') articles.andWhere("articles.ticker = :ticker", { ticker: params.ticker == 'Yes' ? true : false })

            // Check does article belong to timeline column.
            if (typeof params.timeline != 'undefined') articles.andWhere("articles.timeline = :timeline", { timeline: params.timeline == 'Yes' ? true : false })

            // Select root category of this article
            if (typeof params.subdomain != 'undefined') articles.andWhere("cat.subdomain = :subdomain", { subdomain: params.subdomain })

            // select nested category of this article.
            if (typeof params.category != 'undefined') articles.andWhere("cat.catid = :category", { category: params.category })

            // Get count for pagination
            let count = await articles.getCount();

            articles.skip(skip)
            articles.take(take)
            articles.orderBy(`articles.${sort}`, order)

            let result = await articles.getMany();


            return {
                items: result,
                total_count: count
            };
        }
        catch (error) {
            console.log(error.message)
            throw new Error(error.message);
        }

    }

    public async newArticle(data: any) {
        const manager = getManager();
        const connection = manager.connection;

        try {

            let media: any = [];
            let description: string = '';
            if (Array.isArray(data.media)) {
                data.media.map((data: any) => {
                    media.push({
                        yt: data.youtube,
                        fb: data.facebook,
                        emb: data.embed,
                    });

                    /**
                     * here we are adding div with d-divider class, this class we will use in the situations
                     * when we need to split whole text to several pieces and then manipulate them.
                     *  */
                    description += data.text + '<div class="g-divider"></div>'
                })
            }

            const articles = new Articles();

            articles.description = description.slice(0, -29);
            articles.images = data.images;
            articles.media = media;
            articles.suggestions = data.suggestions;
            articles.metadata = data.metadata;
            /** State inputs  */
            articles.slider = data.slider;
            articles.most_viewed = data.mostViewed;
            articles.show_editor = data.showEditor;
            articles.timeline = data.timeline;
            articles.ticker = data.ticker;
            articles.important = data.important;
            articles.state = data.state;
            articles.author = data.author;
            articles.language = data.language;
            /** --------------------------------- */
            articles.published = data.published ? data.published : new Date();

            await connection.manager.save(articles);

            Object.keys(data.categories).map(async catid => {
                let catRel = new CatRel();
                let parentId = data.categories[catid]

                catRel.subdomain = parentId;
                catRel.catid = parseInt(catid);
                catRel.article = articles;

                await connection.manager.save(catRel);
            })
        }
        catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    public async updateArticle(id: number, data: any) {

        try {
            let media: any = [];
            let description: string = '';
            if (Array.isArray(data.media)) {
                data.media.map((data: any) => {
                    media.push({
                        yt: data.youtube,
                        fb: data.facebook,
                        emb: data.embed,
                    });

                    /**
                     * here we are adding div with d-divider class, this class we will use in the situations
                     * when we need to split whole text to several pieces and then manipulate them.
                     *  */
                    description += data.text + '<div class="g-divider"></div>'
                })
            }

            const articles = new Articles();

            articles.description = description.slice(0, -29);
            articles.images = data.images;
            articles.media = media;
            articles.suggestions = data.suggestions;
            articles.metadata = data.metadata;
            /** State inputs  */
            articles.slider = data.slider;
            articles.most_viewed = data.mostViewed;
            articles.show_editor = data.showEditor;
            articles.timeline = data.timeline;
            articles.ticker = data.ticker;
            articles.important = data.important;
            articles.state = data.state;
            articles.author = data.author;
            articles.language = data.language;

            /** --------------------------------- */

            await getConnection()
                .createQueryBuilder()
                .update(Articles)
                .set({
                    description: articles.description,
                    images: articles.images,
                    media: articles.media,
                    suggestions: articles.suggestions,
                    metadata: articles.metadata,
                    slider: articles.slider,
                    most_viewed: articles.most_viewed,
                    show_editor: articles.show_editor,
                    timeline: articles.timeline,
                    ticker: articles.ticker,
                    important: articles.important,
                    state: articles.state,
                    author: articles.author,
                    language: articles.language,
                })
                .where("id = :id", { id: id })
                .execute();



            /**
             * Update categories, first delete existing then add new
             */

            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(CatRel)
                .where("article = :id", { id: id })
                .execute();

            let updateCategories = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(CatRel)

            let resolveCats: any = [];
            Object.keys(data.categories).map((catid) => {
                resolveCats.push({
                    subdomain: data.categories[catid],
                    catid: catid,
                    article: id
                });
            });
            updateCategories.values(resolveCats).execute();

        }
        catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }


    public async getOneById(id: number) {
        try {
            const getOne = await getManager()
                .createQueryBuilder(Articles, "articles")
                .leftJoinAndSelect("articles.catrel", "cat")
                .where("cat.article = :id", { id: id })

            return getOne.getOne().then(
                (data: any) => {
                    data.description = data.description.split('<div class="g-divider"></div>');
                    return data;
                },
                error => {
                    throw new Error(error.message);
                }
            )

        }
        catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    public async perPeriod(count: number, language: string, days: number) {
        try {

            const categories = await getManager()
                .createQueryBuilder(Categories, "categories")
                .select(["categories.id", "categories.translation"])
                .getMany();

            const filteredCategories: any = {};

            categories.map((cat: any) => {
                filteredCategories[cat.id] = cat.translation[language];
            })

            const articles = await getManager()
                .createQueryBuilder(Articles, "articles")
                .leftJoin("articles.catrel", "cat")
                .select(["articles.id", "articles.description", "articles.views"])
                .addSelect(["cat.id", "cat.catid"])
                .where("cat.article = articles.id")
                .andWhere("articles.published > CURRENT_DATE - interval '7' day")
                .orderBy("articles.views", "DESC")
                .take(count)
                .getMany();

            let filteredArticles: Array<object> = [];
            articles.map((data: any) => {
                let description = data.description.split('<div class="g-divider"></div>')

                filteredArticles.push({
                    id: data.id,
                    views: data.views,
                    description: helpers.striptags(description[0]),
                    category: filteredCategories[data.catrel[0].catid] || '',
                });
            })
            return filteredArticles;
        }
        catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }


    public async deleteArticle(id: number) {

        try {
            return await getConnection()
                .createQueryBuilder()
                .delete()
                .from(Articles)
                .where("id = :id", { id: id })
                .execute();
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}