/**
 * Dom sanitizing requires
 */
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

import { getRepository, PromiseUtils } from "typeorm";
import { Seo } from "../entity/Seo";
import bcrypt from 'bcrypt';

export class SeoService {
    
    public async retrieveAll() {

        try {
            // Retrieve all seo data from db
            let data = await getRepository(Seo).findOne({ select: ["home", "tv", "military", "lifestyle"], where: { id: 1 } });
            
            if (typeof data == "undefined") {

                let emptyStructure = {
                    meta: { am: '', ru: '', en: '' },
                    description: { am: '', ru: '', en: '' },
                } 

                let insert = await getRepository(Seo).insert({
                    home: emptyStructure,
                    tv: emptyStructure,
                    military: emptyStructure,
                    lifestyle: emptyStructure,
                });

                return {
                    home: emptyStructure,
                    tv: emptyStructure,
                    military: emptyStructure,
                    lifestyle: emptyStructure,
                };
            }

            return data;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    public async update(data: any) {

        try {
            let update = await getRepository(Seo).update({ id: 1 },{ [data.domain]: data.data });
            return update; 
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}