/**
 * Dom sanitizing requires
 */
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getRepository, getManager } from "typeorm";
import { Admin } from "../entity/Admin";
import { CustomizeService } from '../services/customize.service';

/**
 * Environment requires
 */
const config = require('../config/config.json');
const customizeService = new CustomizeService();

export class AuthenticateService {

    public async login(username: string, password: string, params: any) {
        try {
            // create root user if not exists

            const root = await getManager()
                .createQueryBuilder(Admin, "admin")
                .where('username = :username', { username: 'gevorghazaryan@gmail.com' })
                .getOne();

            if (!root) {
                const manager = getManager();
                const connection = manager.connection;

                const user = new Admin();
                user.username = 'gevorghazaryan@gmail.com',
                    user.password = '$2b$14$JCIJO8CjmHaphRlKvlweuuW0NDLrnOJDUuG6i3ZC3D0Y7RiMAH34K',
                    user.refreshToken = '',
                    user.data = { name: "Gevorg Ghazaryan", gender: "male", role: "admin", image: "" },
                    user.description = { am: '', ru: '', en: '' }

                await connection.manager.save(user);
            }

            // Retrieve user's data from DB.
            let user = await getRepository(Admin).findOne({ where: { username: username } });

            // If there is no user with specified username then throw new error.
            if (typeof user == 'undefined') throw new Error('User not found!!!');

            // compare passwords
            let comparePasswords = await bcrypt.compare(password, user.password);

            // If passwords don't match each other return error messate
            if (!comparePasswords) throw new Error('Incorrect password!');

            // Create payload data for the user's tokens, and generate that tokens.

            let payload = {
                id: user.id,
                username: user.username,
                role: user.data.role
            }

            /**
             * Check did user select not safe computer or not and take an action
             *
             * 1. If user didn't select not remember neither not_safe than it is the standard case
             *    life of the token should be 30 min and refresh token's 7 days
             *
             * 2. If user selected remember me token should be 30 min and refresh token 350 days
             *
             * 3. If user selected not safe token's life should be 30 min and refresh token's 1 hour
             *
            */
            let duration = '7d';

            if (params.remember && !params.not_safe) {
                duration = '365d';
            }
            if (params.not_safe) {
                duration = '30m';
            }

            let token = jwt.sign(payload, config.secret.API, {
                expiresIn: "20s"
            });

            let refresh_token = jwt.sign(payload, config.secret.API, {
                expiresIn: duration
            });

            // update user's refresh token and return the information including token and refresh token as JSON
            let update = await getRepository(Admin).update({ username: username }, { refreshToken: refresh_token });

            if (update) {

                let data: any = {
                    id: user.id,
                    username: user.username,
                    role: user.data.role,
                    name: user.data.name,
                    image: user.data.image,
                    token: token,
                    refresh_token: refresh_token,
                    message: 'Enjoy your tokens!'
                };

                return customizeService.getState().then(result => {
                    data.customize = result;
                    return data;
                })

            }

            // Always return error message if logging in didn't complete successfully
            throw new Error('Something went wrong pleas try again!');

        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    public async refreshAccessToken(refresh_token: string) {
        try {

            let validateToken: any = jwt.verify(refresh_token, config.secret.API);

            if (!validateToken.id) throw new Error('User not found!');

            let payload = {
                id: validateToken.id,
                username: validateToken.username,
                role: validateToken.role
            }
            let token = jwt.sign(payload, config.secret.API, {
                expiresIn: "10s"
            });

            return token;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    public async logOut(username: string) {
        try {
            let update = await getRepository(Admin).update({ username: username }, { refreshToken: '' });
            return true;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}