import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Admin {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column()
    password!: string;

    @Column()
    refreshToken!: string;

    @Column({ type: 'json', nullable: true })
    data!: {
        name: string,
        gender: string,
        role: string,
        image: string
    };
    @Column({ type: 'jsonb', nullable: true })
    description: any;
}