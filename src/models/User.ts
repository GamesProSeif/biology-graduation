import { Entity, Column, CreateDateColumn, ObjectIdColumn } from 'typeorm';

class Photo {
	@Column()
	public buffer!: Buffer;

	@Column()
	public size!: number;

	@Column()
	public downloaded!: boolean;

	public constructor(buffer: Buffer) {
		this.buffer = buffer;
		this.size = buffer.length;
		this.downloaded = false;
	}
}

@Entity()
export default class User {
	@ObjectIdColumn()
	public id!: string;

	@Column()
	public ip!: string;

	@Column()
	public name!: string;

	@Column()
	public phone!: string;

	@Column()
	public photos!: Photo[];

	@CreateDateColumn()
	public createdAt!: Date;

	public constructor(name = '', phone = '', ip = '', photos: Photo[] = []) {
		this.name = name;
		this.phone = phone;
		this.ip = ip;
		this.photos = photos;
	}

	public static Photo = Photo;
}
