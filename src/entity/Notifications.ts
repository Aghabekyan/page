import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Notifications {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text', default: '' })
    from!: string;

    @Column()
    to!: number;

    @Column({ type: 'text', default: '' })
    type!: string;

    @Column({ type: 'text', default: '' })
    description!: string;

    @Column({ type: 'jsonb', nullable: true })
    additional: any;

    @Column({ default: false })
    status!: boolean;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;
}