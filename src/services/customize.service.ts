// Dom sanitizing requires
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

import { getManager } from "typeorm";
import { Customize } from "../entity/Customize";

export class CustomizeService {

    public async setState(args: any) {
        try {
            await this.checkDatabaseStructure();

            const allFields = await getManager().createQueryBuilder(Customize, "customize").getMany();

            allFields.filter(async (sought: any) => {
                if (sought.title == args.position) {
                    sought.options[args.category] = args.value;

                    await getManager()
                        .createQueryBuilder()
                        .update(Customize)
                        .set({ options: sought.options })
                        .where("title = :title", { title: args.position })
                        .execute();
                }
            })
            return true;
        }
        catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    public async getState() {

        try {
            await this.checkDatabaseStructure();

            const category = await getManager()
                .createQueryBuilder(Customize, "customize")
                .select(['customize.title','customize.options'])
                .getMany();

            let sortOptions: any = {};
            category.map(data => {
                sortOptions[data.title] = data.options;
            })

            return sortOptions;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    private async checkDatabaseStructure() {
        const allowedFields: string[] = ['cat_colors', 'common', 'dashboard_cats'];
        const allowedDefaultOptions: any = {
            cat_colors: {},
            dashboard_cats: {},
            common: {
                sidenav: 1,
                language: 'en',
                entry_page: ''
            }
        }
        const existingFields = await getManager()
            .createQueryBuilder(Customize, "customize")
            .select(['customize.title'])
            .getMany();

        allowedFields.map(async (field: string) => {
            let currentValue = existingFields.filter(data => (data.title === field));

            if (!currentValue[0]) {
                let manager = await getManager();
                manager.createQueryBuilder()
                    .insert()
                    .into(Customize)
                    .values([
                        { title: field, options: allowedDefaultOptions[field] }
                    ])
                    .execute();
            }
        });

    }

}
