
/** Dom sanitizing requires */

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

/** Require entities */


import { getRepository, getManager, Any } from "typeorm";

import { Messages } from "../entity/Messages";


export class MessengerService {

    public async getConversation(first: number, second: number, position: number) {

        try {

            let manager = await getManager()

            let connection = manager.connection;
                const messages = await connection.getRepository(Messages).find({
                    where: {
                        from: Any([first, second]),
                        to: Any([first, second]),
                    },
                    order: {
                        id: "DESC"
                    },
                    skip: position,
                    take: 30
                })

            return messages;
        }
        catch (error) {
            console.log(error)
            throw new Error(error.message);
        }

    }

    public async newMessage(message: any, status: boolean) {
        const manager = getManager();

        try {
            let newMessage = await manager.insert(Messages, {
                from: message.from,
                to: message.to,
                message: message.content,
                status: status
            });
            return newMessage;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    public async retrieveLastMessages(id: number) {
        let userId = DOMPurify.sanitize(id);

        try {
            const repository = getRepository(Messages);

            const messages = await repository.query(`
                SELECT *
                FROM (
                    SELECT *, row_number() over (partition by messages.from order by messages.id DESC) as row_number FROM messages WHERE messages.from != ${userId}
                ) AS rows
                where row_number = 1
            `);
            return messages;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    public async unreadMessagesCount(id: number) {
        let userId = DOMPurify.sanitize(id);

        try {
            const repository = getRepository(Messages);
            const count = await repository.query(`SELECT COUNT(distinct messages.from)
                                                    FROM messages
                                                    WHERE messages.status = false
                                                    AND messages.to = ${userId}`);
            return count;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    public async markAsRead(from: number, to: number) {
        let fromUser = DOMPurify.sanitize(from);
        let toUser = DOMPurify.sanitize(to);

        try {
            const manager = getManager();
            await manager.update(Messages, { from: from, to: to }, { status: true });

            const repository = getRepository(Messages);
            const count = await repository.query(`SELECT COUNT(distinct messages.from)
                                                    FROM messages
                                                    WHERE messages.status = false
                                                    AND messages.to = ${to}`);
            return count;

        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}