//
// /** Dom sanitizing requires */
//
// const createDOMPurify = require('dompurify');
// const { JSDOM } = require('jsdom');
// const window = (new JSDOM('')).window;
// const DOMPurify = createDOMPurify(window);
//
// /** Import typeorm entities and helpers */
//
// import { getRepository, PromiseUtils, getTreeRepository, getManager } from "typeorm";
// import { Categories } from "../entity/Categories";
//
// /** Import models */
//
//
// /** Other imports */
//
// import bcrypt from 'bcrypt';
// import categories from "../routes/categories";
//
// export class CategoriesService {
//
//     public async retrieveAll() {
//         try {
//             const manager = getManager();
//             return await manager.getTreeRepository(Categories).findTrees();
//         }
//         catch (error) {
//             throw new Error(error.message);
//         }
//     }
//
//     // public async add(translation: 'aaa', parentId: number | null, sortIndex: number, icon: string) {
//     //
//     //     const manager = getManager();
//     //     const category = new Categories();
//     //     category.sortIndex = sortIndex || 0;
//     //     category.icon = icon || '';
//     //
//     //     try {
//     //
//     //         if (parentId) {
//     //             let parent = new Categories()
//     //             parent.id = parentId;
//     //
//     //             category.name = "c" + parentId;
//     //             category.parent = parent;
//     //         }
//     //         else {
//     //             category.name = "root";
//     //         }
//     //         return await manager.save(category);
//     //     }
//     //     catch (error) {
//     //         throw new Error(error.message);
//     //     }
//     // }
//     //
//     // public async update(data: any) {
//     //
//     //     try {
//     //         return await getRepository(Categories).update({ id: data.id }, { translation: data.translation, sortIndex: data.sortIndex || 0, icon: data.icon || ''});
//     //     }
//     //     catch (error) {
//     //         throw new Error(error.message);
//     //     }
//     // }
//     //
//     // public async delete(id: number) {
//     //
//     //     try {
//     //
//     //         let currentCat: any = await getRepository(Categories).findOne(id);
//     //
//     //         /** If the ID is parent then delete cascad else delete current element */
//     //         if (currentCat.name == 'root') {
//     //             return await getRepository(Categories)
//     //             .createQueryBuilder()
//     //             .delete()
//     //             .from(Categories)
//     //             .where("mpath LIKE :path", { path: `${ currentCat.id }.%` })
//     //             .execute();
//     //         }
//     //         else {
//     //             return await getRepository(Categories)
//     //             .createQueryBuilder()
//     //             .delete()
//     //             .from(Categories)
//     //             .where("mpath LIKE :path", { path: `%.${ currentCat.id }.%` })
//     //             .execute();
//     //             // return await getRepository(Categories).delete(id);
//     //         }
//     //
//     //         // Always return error message if logging in didn't complete successfully
//     //         throw new Error(`Category with ID - ${id} wasn\'t deleted!`);
//     //     }
//     //     catch (error) {
//     //         throw new Error(error.message);
//     //     }
//     // }
// }