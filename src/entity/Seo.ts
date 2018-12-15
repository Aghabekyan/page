import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

interface languages {
    am: string;
    ru: string;
    en: string;
}

interface main {
    meta: languages,
    description: languages;
}

@Entity()
export class Seo {
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column('json')
    home!: main;

    @Column('json')
    tv!: main;

    @Column('json')
    military!: main;

    @Column('json')
    lifestyle!: main;
}