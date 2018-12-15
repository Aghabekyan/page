import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Articles } from "./Articles";

@Entity()
export class CatRel {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    subdomain!: number;

    @Column()
    catid!: number;

    @ManyToOne(type => Articles, article => article.catrel, { onDelete: 'CASCADE' })
    article!: Articles;
}