import { Request, Response } from 'express';
import Route from '../../structures/Route';
import User, { Photo } from '../../models/User';
import * as _ from 'lodash';

export default class OverviewGET extends Route {
	public constructor() {
		super({
			method: 'get',
			endpoint: ['/special/overview']
		});
	}

	public async exec(req: Request, res: Response) {
		const userRepo = this.db.getRepository(User);
		// @ts-ignore
		const users = await userRepo.find({
			select: ['name', 'phone', 'photos.size', 'createdAt'],
			order: {
				createdAt: 'ASC'
			}
		});

		res.status(200).json({
			totalSize: _.sum(_.concat([], ...users
				.map((user: User) =>
					user.photos.map((photo: Photo) => photo.size)))),
			users: users.map((user: User) => {
				(user.photos as unknown) = user.photos.length;
				return user;
			})
		});
	}
}
