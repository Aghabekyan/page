import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { CatRel } from "./CatRel";

@Entity()
export class Articles {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text', default: '' })
    description!: string;

    @Column({ type: 'jsonb', nullable: true })
    images: any;

    @Column({ type: 'jsonb', nullable: true })
    media: any;

    @Column({ default: '' })
    suggestions!: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: any;

    @Column({ default: false })
    slider!: boolean;

    @Column({ default: false })
    most_viewed!: boolean;

    @Column({ default: false })
    show_editor!: boolean;

    @Column({ default: false })
    timeline!: boolean;

    @Column({ default: false })
    ticker!: boolean;

    @Column({ default: false })
    important!: boolean;

    @Column({ default: true })
    state!: boolean;

    @Column({ default: 0 })
    views!: number;

    @Column({ default: 0 })
    author!: number;

    @Column({ default: '' })
    language!: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

    @Column({ type: "timestamp" })
    published!: Date;

    @OneToMany((type: any) => CatRel, (catrel: any) => catrel.article)
    catrel!: CatRel[];
}