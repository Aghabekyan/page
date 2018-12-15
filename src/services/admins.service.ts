/**
 * Dom sanitizing requires
 */
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

import { getRepository, getManager } from "typeorm";
import { Messages } from "../entity/Messages";
import { Admin } from "../entity/Admin";
import bcrypt from 'bcrypt';



export class AdminsService {

    public async retrieveAll(except?: number) {
        try {
            let user = except ? DOMPurify.sanitize(except) : false;

            const repository = getRepository(Admin);
            let admins;
            if (user) {
                admins = await repository.query(`SELECT id, username, data, description FROM admin WHERE id != ${except}`);
            }
            else {
                admins = await repository.query(`SELECT id, username, data, description FROM admin`);
            }
            return admins;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    public async addAdmin(data: any) {

        let password = await bcrypt.hash(DOMPurify.sanitize(data.password), 12);
        let role = 'intern';

        if (Object.keys(data.role).length) {
            for (let key in data.role) {
                if (data.role[key]) {
                    role = key;
                    break;
                }
            }
        }

        let userData = {
            username: DOMPurify.sanitize(data.username) || '',
            password: password,
            data: {
                name: DOMPurify.sanitize(data.name) || '',
                gender: data.name == 0 ? 'male' : 'female',
                role: role,
                image: "",
            }
        }
        try {
            // check the username
            let checkUsername = await getRepository(Admin).find({ select: ["username"], where: { username: userData.username } });

            if (checkUsername.length) throw new Error("Username already exists");
            let createAdmin = await getRepository(Admin).insert({
                username: userData.username,
                password: userData.password,
                refreshToken: '',
                data: userData.data
            });

            return createAdmin;

            // Always return error message if logging in didn't complete successfully
            throw new Error(`Something went wrong!!!`);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    public async deleteAdmin(id: number) {

        /**
         * check if the ID is equal to 1 or less it means thant or it is incorect id or
         * it is the main admin, so we can not delete that admin and should return error code back to client.
         */

        let adminID = DOMPurify.sanitize(id) || 1;

        if (adminID <= 1) {
            throw new Error('Can\'t delete the root admin!');
        }

        try {

            // Retrieve all admins from db
            let deleteAdmin = await getRepository(Admin).delete(adminID);
            return deleteAdmin;

            // Always return error message if logging in didn't complete successfully

            throw new Error(`Admin with ID - ${id} wasn\'t deleted!`);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }


    public async retrieveAdminDetails(id: number) {

        let adminID = DOMPurify.sanitize(id) || '';

        if (isNaN(adminID)) throw new Error(`Wrong id is passed!!!`);

        try {

            let admin: any = await getRepository(Admin).findOne({ select: ["id", "username", "data", "description"], where: { id: adminID } });
            return admin;

            // Always return error message if logging in didn't complete successfully
            throw new Error(`Wrong id is passed!!!`);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    public async updateAdmin(data: any) {

        let role = 'intern';

        if (Object.keys(data.role).length) {
            for (let key in data.role) {
                if (data.role[key]) {
                    role = key;
                    break;
                }
            }
        }

        try {

            console.log(data)
            let admin: any = await getRepository(Admin).findOne({ select: ["id", "username", "password", "data"], where: { id: data.id } });
            admin.data.role = role;
            admin.data.name = data.name;
            admin.data.gender = data.gender == 0 ? 'male' : 'female';
            admin.username = data.username;

            if (data.password && data.password.length) {
                admin.password = await bcrypt.hash(DOMPurify.sanitize(data.password), 12);
            }

            let update = await getRepository(Admin).update({ id: admin.id }, { username: admin.username, password: admin.password, data: admin.data });

            if (admin.id) return admin;

            // Always return error message if logging in didn't complete successfully
            throw new Error(`Something went wrong!`);
        }
        catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    public async updateAdminProfile(data: any) {

        try {

            // If there is password then update passowrd row too else only info.

            let update;

            let admin: any = await getRepository(Admin).findOne({ select: ["id", "username", "data"], where: { username: data.username } });

            admin.data.name = data.name;
            admin.data.gender = data.gender == 0 ? 'male' : 'female';
            admin.data.image = data.image;

            if (data.password.length) {
                let password = await bcrypt.hash(DOMPurify.sanitize(data.password), 12);
                update = await getRepository(Admin).update({ id: data.id }, { username: data.username, password: password, data: admin.data, description: data.description });
                return admin;
            }
            else {
                let update = await getRepository(Admin).update({ id: data.id }, { username: data.username, data: admin.data, description: data.description });
                return admin;
            }

        }
        catch (error) {
            throw new Error(error.message);
        }
    }

}

// data - {"name":"Gevorg Ghazaryan","gender":"female","role":"intern","image":"disk/original/10-22-18/64689061172988.jpg"}
// pass - $2b$12$CBJ3PsQdywi4K/151pffTe/x7xE3lXLfaZYOd37HJXqMwJY0w5E4W
// // description - {"en":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing.","ru":"Lorem Ipsum - это текст-\"рыба\", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной \"рыбой\" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн.","am":"Lorem Ipsum-ը տպագրության և տպագրական արդյունաբերության համար նախատեսված մոդելային տեքստ է: Սկսած 1500-ականներից` Lorem Ipsum-ը հանդիսացել է տպագրական արդյունաբերության ստանդարտ մոդելային տեքստ, ինչը մի անհայտ տպագրիչի կողմից տարբեր տառատեսակների օրինակների գիրք ստեղծելու ջանքերի արդյունք է: Այս տեքստը ոչ միայն կարողացել է գոյատևել հինգ դարաշրջան, այլև ներառվել է էլեկտրոնային տպագրության մեջ` մնալով էապես անփոփոխ: "}
// INSERT INTO public.admin
// (username, "password", "data", description)
// VALUES('gevorghazaryan@gmail.com', '$2b$12$CBJ3PsQdywi4K/151pffTe/x7xE3lXLfaZYOd37HJXqMwJY0w5E4W', '{"name":"Gevorg Ghazaryan","gender":"female","role":"intern","image":"disk/original/10-22-18/64689061172988.jpg"}', '{"en":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing.","ru":"Lorem Ipsum - это текст-\"рыба\", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной \"рыбой\" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн.","am":"Lorem Ipsum-ը տպագրության և տպագրական արդյունաբերության համար նախատեսված մոդելային տեքստ է: Սկսած 1500-ականներից` Lorem Ipsum-ը հանդիսացել է տպագրական արդյունաբերության ստանդարտ մոդելային տեքստ, ինչը մի անհայտ տպագրիչի կողմից տարբեր տառատեսակների օրինակների գիրք ստեղծելու ջանքերի արդյունք է: Այս տեքստը ոչ միայն կարողացել է գոյատևել հինգ դարաշրջան, այլև ներառվել է էլեկտրոնային տպագրության մեջ` մնալով էապես անփոփոխ: "}');