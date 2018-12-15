import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class TaskManager {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    userId!: number;

    @Column()
    title!: string;

    @Column("int", { array: true, nullable: true })
    owners!: number[];

    @Column()
    priority!: number;

    @Column({ default: false })
    state!: boolean;

    @Column({ type: 'jsonb', nullable: true })
    tasks!: any;

    @CreateDateColumn({type: "timestamp"})
    createdAt!: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt!: Date;
}