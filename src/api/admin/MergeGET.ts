import { Request, Response } from 'express';
import User from '../../models/User';
import Route from '../../structures/Route';

export default class MergeGET extends Route {
	public constructor() {
		super({
			method: 'get',
			endpoint: ['/admin/merge']
		});
	}

	public async exec(req: Request, res: Response): Promise<void> {
		const userRepo = this.db.getRepository(User);
		const users = (await userRepo.find())
			.sort((a: User, b: User) => a.createdAt.getTime() - b.createdAt.getTime());
		const temp: User[] = [];
		const dupe: User[] = [];

		if (!users.length) {
			res.status(404).json({ error: 'No users in the database' });
			return;
		}

		for (const user of users) {
			const dupeUser = temp.find(u => u.phone === user.phone);
			if (dupeUser) {
				dupeUser.photos.forEach(photo => {
					user.photos.push(photo);
				});
				dupe.push(user);
				await userRepo.remove(dupeUser);
			} else {
				temp.push(user);
			}
		}

		if (dupe.length) {
			await userRepo.save(dupe);
			res.status(200).json({ message: `Merged ${dupe.length} users` });
			return;
		}

		res.status(404).json({ error: 'No duplicate users' });
	}
}
