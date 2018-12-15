import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Messages {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    from!: number;

    @Column()
    to!: number;

    @Column({type: 'text', default: '', nullable: true})
    message!: string;

    @Column({type: 'json', nullable: true})
    media!: string;

    @Column({ default: false })
    status!: boolean;

    @CreateDateColumn({type: "timestamp"})
    createdAt!: Date;
}