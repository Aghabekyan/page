import { Entity, Tree, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent, CreateDateColumn, UpdateDateColumn, TreeLevelColumn } from "typeorm";

interface languages {
    am: string;
    ru: string;
    en: string;
}

@Entity()
@Tree("materialized-path")
export class Categories {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column('json')
    translation!: languages;

    @TreeChildren()
    children!: Categories[];

    @TreeParent()
    parent!: Categories;

    @Column()
    sortIndex!: number;

    @Column({ default: '' })
    icon!: string;

    @CreateDateColumn({type: "timestamp"})
    createdAt!: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt!: Date;
}