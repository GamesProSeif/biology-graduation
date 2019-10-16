import { Entity, Column, CreateDateColumn, ObjectIdColumn } from 'typeorm';

@Entity()
export default class User {
	@ObjectIdColumn()
	public id!: string;

	@Column()
	public name!: string;

	@Column()
	public photos!: Buffer[];

	@Column()
	public downloaded!: boolean;

	@CreateDateColumn()
	public createdAt!: Date;

	public constructor(name = '', photos: Buffer[] = [], downloaded = false) {
		this.name = name;
		this.photos = photos;
		this.downloaded = downloaded;
	}
}
