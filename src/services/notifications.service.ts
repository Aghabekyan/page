// Dom sanitizing requires
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

import { getManager } from "typeorm";
import { Notifications } from "../entity/Notifications";
import { Admin } from '../entity/Admin';
import moment from 'moment'

export class NotificationsService {

    public async unseenNotificationsCount(owner: number) {
        try {
            const notifications = await getManager()
            .createQueryBuilder(Notifications, "notification")
            .where("notification.to = :owner", { owner: owner })
            .andWhere("notification.status = false")
            .getCount();
            return notifications;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    public async lastNotification(owner: number) {
        let data = {};
        try {
            const notifications = await getManager()
            .createQueryBuilder(Notifications, "notification")
            .where("notification.to = :owner", { owner: owner })
            .andWhere("notification.status = false")
            .orderBy("id", "DESC")
            .getOne();

            if (notifications && notifications.from) {

                const adminName = await getManager()
                .createQueryBuilder(Admin, "admin")
                .where("admin.id = :id", { id: notifications.from })
                .getOne();

                data = {
                    id: notifications && notifications.id ? notifications.id : '',
                    name: adminName && adminName.data.name ? adminName.data.name : '',
                    description: notifications && notifications.description ? notifications.description : '',
                    date: notifications && notifications.createdAt ? moment(notifications.createdAt, 'DDMMMYY').format('MM-DD HH:mm') : '',
                }
            }

            return data;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    public async closeNotification(params: any) {
        let data = {};
        try {
            // Set status of notification to true.
            const manager = getManager();
            await manager.update(Notifications, { id: params.id }, { status: true });

            const notifications = await getManager()
            .createQueryBuilder(Notifications, "notification")
            .where("notification.to = :owner", { owner: params.owner })
            .andWhere("notification.status = false")
            .orderBy("id", "DESC")
            .getOne();


            if (notifications && notifications.from) {

                const adminName = await getManager()
                .createQueryBuilder(Admin, "admin")
                .where("admin.id = :id", { id: notifications.from })
                .getOne();

                data = {
                    id: notifications && notifications.id ? notifications.id : '',
                    name: adminName && adminName.data.name ? adminName.data.name : '',
                    description: notifications && notifications.description ? notifications.description : '',
                    date: notifications && notifications.createdAt ? moment(notifications.createdAt, 'DDMMMYY').format('MM-DD HH:mm') : '',
                }
            }

            return data;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

}
