import { Request, Response } from 'express';
import User from '../../models/User';
import Route from '../../structures/Route';

export default class UserGET extends Route {
	public constructor() {
		super({
			method: 'get',
			endpoint: ['/admin/user/:id']
		});
	}

	public async exec(req: Request, res: Response) {
		const userRepo = this.db.getRepository(User);
		const user = await userRepo.findOne(req.params.id);

		if (!user) {
			res.status(400).json({ error: 'User does not exist' });
			return;
		}

		let totalSize = 0;

		user.photos.forEach(photo => {
			totalSize += photo.buffer.buffer.byteLength;
		});

		(user.photos as unknown) = user.photos.length;
		res.status(200).json({ user, totalSize });
	}
}
