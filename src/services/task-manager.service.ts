
/** Dom sanitizing requires */

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

/** Require entities */

import { getRepository, getManager, getConnection } from "typeorm";
import { Admin } from '../entity/Admin';
import { TaskManager } from "../entity/TaskManager";
import { Notifications } from '../entity/Notifications';
import { NotificationsService } from './notifications.service';



import redis from 'redis';
const client = redis.createClient();
const notificationsService = new NotificationsService();

export class TaskManagerService {

    public async retrieveAll(page: number) {

        const tasks = getRepository(TaskManager);

        try {

            let skip = typeof page == 'undefined' ? 0 : page * 30;
            let cards = await getManager()
                .createQueryBuilder(TaskManager, "cards")
                .orderBy('cards.priority', 'DESC');

            // Get count for pagination
            let count = await cards.getCount();

            cards.skip(skip)
            cards.take(30)

            let result = await cards.getMany();

            return {
                items: result,
                count: count
            };
        }
        catch (error) {
            throw new Error(error.message);
        }

    }

    public async retriveByPriority(priority: number, count: number) {
        try {
            let adminNames: any = {};
            let admins = await getManager()
                .createQueryBuilder(Admin, "admin")
                .getMany();

            admins.map(data => {
                adminNames[data.id] = data.data.name;
            })

            let data = await getManager()
                .createQueryBuilder(TaskManager, "cards")
                .where("cards.priority = :priority", { priority: priority })
                .orderBy('cards.id', 'DESC')
                .take(count)
                .getMany();


            let dataToSend = [];

            for (let i in data) {
                let owners: Array<string> = [];

                if (data[i].owners) {
                    data[i].owners.map(data => {
                        owners.push(adminNames[data])
                    })
                }

                dataToSend.push({
                    id: data[i].id,
                    title: data[i].title,
                    owners: owners
                })
            }

            return dataToSend;
        }
        catch (error) {
            console.log(error)
            throw new Error(error.message);
        }

    }

    public async newCard(params: any, io: any) {

        const manager = getManager();
        const connection = manager.connection;
        let owners = params.data.owners || [];

        try {
            const card = new TaskManager();
            card.userId = params.user;
            card.title = params.data.title;
            card.owners = params.data.owners;
            card.priority = params.data.priority;

            // Add a notification about new task to notifications table
            owners.map((to: number) => {
                const notification = new Notifications();
                notification.type = 'card',
                notification.from = params.user,
                notification.to = to,
                notification.description = params.data.title
                connection.manager.save(notification);
            })

            await connection.manager.save(card)

            // Get count of unseen notifications
            client.get('sockets', (err, data) => {
                if (err) console.log(err + 'error inside socket on message!')
                let socketlist = JSON.parse(data);
                let notificationData:any  = {};
                owners.map((to: number) => {
                    if (socketlist[to]) {
                        notificationsService.unseenNotificationsCount(to)
                        .then(data => {
                            notificationData.count = data;
                            return notificationsService.lastNotification(to)
                        })
                        .then(response => {
                            notificationData.notification = response;
                            io.to(socketlist[to]).emit('notification', {
                                type: 'new_card',
                                data: notificationData
                            });
                        })
                        .catch(error => console.log(error))
                    }
                })
            })
            return true;
        }
        catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    public async newTask(params: any) {
        try {
            const card = await getManager()
            .createQueryBuilder(TaskManager, "task")
            .where("task.id = :id", { id: params.id })
            .andWhere("task.userId = :userId", { userId: params.userId })
            .getOne();


            let newTask = {
                title: params.title,
                date: params.date,
                done: 0
            }
            if (!card) throw new Error('No user found');

            if (card.tasks == null) {
                card.tasks = [newTask]
            }
            else {
                card.tasks.push(newTask)
            }

            await getConnection()
                .createQueryBuilder()
                .update(TaskManager)
                .set({
                    tasks: card.tasks,
                })
                .where("id = :id", { id: params.id })
                .andWhere("userId = :userId", { userId: params.userId })
                .execute();
            return newTask;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    public async updateCard(result: any) {
        try {
            await getConnection()
                .createQueryBuilder()
                .update(TaskManager)
                .set({
                    userId: result.user,
                    title: result.data.title,
                    owners: result.data.owners,
                    priority: result.data.priority,
                })
                .where("id = :id", { id: result.id })
                .andWhere("userId = :user", { user: result.user })
                .execute();
        }
        catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    public async deleteCard(id: any) {
        const manager = getManager();
        const connection = manager.connection;
        try {
            const tasks = getRepository(TaskManager);
            return await tasks.delete(id);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    public async deleteTask(params: any) {

        try {
            const card = await getManager()
            .createQueryBuilder(TaskManager, "task")
            .where("task.id = :id", { id: params.element.id })
            .andWhere("task.userId = :userId", { userId: params.currentUser })
            .getOne();

            if (!card) throw new Error('No user found');

            card.tasks.splice(params.index, 1);

            let result = await getConnection()
                .createQueryBuilder()
                .update(TaskManager)
                .set({
                    tasks: card.tasks,
                })
                .where("id = :id", { id: params.element.id })
                .andWhere("userId = :userId", { userId: params.currentUser })
                .execute();

            return result;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    public async markAsDone(params: any) {

        try {
            const card = await getManager()
            .createQueryBuilder(TaskManager, "task")
            .where("task.id = :id", { id: params.element.id })
            .andWhere("task.userId = :userId", { userId: params.currentUser })
            .getOne();

            if (!card) throw new Error('No user found');

            card.tasks[params.index].done = card.tasks[params.index].done == 1 ? 0 : 1;

            let pendingStatus = true;

            card.tasks.forEach((value: any, key: number) => {
                if (!value.done) {
                    pendingStatus = false;
                }
            })
            let result = await getConnection()
                .createQueryBuilder()
                .update(TaskManager)
                .set({
                    tasks: card.tasks,
                    state: pendingStatus
                })
                .where("id = :id", { id: params.element.id })
                .andWhere("userId = :userId", { userId: params.currentUser })
                .execute();

            return pendingStatus;
        }
        catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }


}