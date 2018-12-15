import {MigrationInterface, QueryRunner} from "typeorm";

export class admins1535646746339 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "admin" ADD COLUMN "description" JSON`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
