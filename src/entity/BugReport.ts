import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class BugReport {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    from!: number;

    @Column({type: "text"})
    title!: string;

    @Column({type: "text"})
    description!: string;

    @CreateDateColumn({type: "timestamp"})
    createdAt!: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt!: Date;
}