import { Request, Response } from 'express';
import { readFile, unlink } from 'fs-extra';
import { promisify } from 'util';
import Route from '../structures/Route';
import User from '../models/User';
import { TOPICS, EVENTS } from '../util/logger';

const promReadFile: (path: string) => Promise<Buffer> = promisify(readFile);
const promUnlink: (path: string) => Promise<void> = promisify(unlink);

export default class SubmitPhotosPOST extends Route {
	public constructor() {
		super({
			method: 'post',
			endpoint: ['/submit-photos']
		});
	}

	public async exec(req: Request, res: Response): Promise<void> {
		if (!(req.headers['content-type'] as string).startsWith('multipart/form-data;')) {
			res.status(400).json({ error: 'Unsupported content-type' });
			return;
		}
		if (!req.fields || !req.fields.name || !req.files || !Object.keys(req.files).length) {
			res.status(400).json({ error: 'Missing form data' });
			return;
		}

		const buffers: Buffer[] = [];
		let totalSize = 0;

		for (const file of Object.values(req.files)) {
			const buffer = await promReadFile(file.path);
			buffers.push(buffer);
			totalSize += file.size;
			await promUnlink(file.path);
		}

		const userRepo = this.db.getRepository(User);
		const user = new User(req.fields.name as string, buffers);

		await userRepo.save(user);

		this.logger.info(`${user.id} (${(totalSize / 1024).toFixed(3)} KB)`, {
			topic: TOPICS.MONGODB,
			event: EVENTS.NEW_USER
		});
		res.status(200).json({
			user: {
				id: user.id,
				name: user.name
			}
		});
	}
}
