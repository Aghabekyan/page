import { Entity, Column, PrimaryGeneratedColumn, Tree, TreeChildren,
TreeParent} from "typeorm";


@Entity()
@Tree("materialized-path")
export class Categories {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;


    @TreeChildren()
    children!: Categories[];

    @TreeParent()
    parent!: Categories;

}