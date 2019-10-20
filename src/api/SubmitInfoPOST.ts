import { Request, Response } from 'express';
import { readFile, unlink } from 'fs-extra';
import { promisify } from 'util';
import Route from '../structures/Route';
import User from '../models/User';
import { TOPICS, EVENTS } from '../util/logger';

const promReadFile: (path: string) => Promise<Buffer> = promisify(readFile);
const promUnlink: (path: string) => Promise<void> = promisify(unlink);

export default class SubmitInfoPOST extends Route {
	public constructor() {
		super({
			method: 'post',
			endpoint: ['/submit-info']
		});
	}

	public async exec(req: Request, res: Response): Promise<void> {
		let user: User | undefined;
		let modified = false;

		if (!(req.headers['content-type'] as string).startsWith('multipart/form-data;')) {
			res.status(400).json({ error: 'Unsupported content-type' });
			return;
		}
		if (!req.fields || !req.fields.name || !req.fields.phone /* || !req.files || !Object.keys(req.files).length */) {
			res.status(400).json({ error: 'Missing form data' });
			return;
		}

		const name = (req.fields.name as string).trim();
		const phone = (req.fields.phone as string).trim();
		const ip = req.ip || req.connection.remoteAddress!;
		let totalSize = 0;
		const userRepo = this.db.getRepository(User);

		user = await userRepo.findOne({
			where: { phone }
		});

		if (user) {
			user.name = name;
			user.ip = ip;
			modified = true;
		} else {
			user = new User(name, phone, ip);
		}

		if (req.files && Object.keys(req.files).length) {
			for (const file of Object.values(req.files)) {
				const buffer = await promReadFile(file.path);
				user.photos.push(new User.Photo(buffer));
				totalSize += file.size;
				await promUnlink(file.path);
			}
		}

		await userRepo.save(user);

		this.logger.info(`${user.id} (${(totalSize / 1024).toFixed(3)} KB)`, {
			topic: TOPICS.MONGODB,
			event: EVENTS.NEW_USER,
			name: user.name,
			photos: user.photos.length
		});

		res.status(200).json({
			user: {
				id: user.id,
				name: user.name,
				photos: user.photos.length
			},
			modified
		});
	}
}
