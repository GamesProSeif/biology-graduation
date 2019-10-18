import { Request, Response } from 'express';
import * as fileType from 'file-type';
// @ts-ignore
import * as JSZip from 'jszip';
import * as moment from 'moment';
import { PassThrough } from 'stream';
import { stringify } from 'yaml';
import User from '../../../models/User';
import Route from '../../../structures/Route';

export default class PhotosDownloadGET extends Route {
	public constructor() {
		super({
			method: 'get',
			endpoint: ['/admin/photos/download']
		});
	}

	public async exec(req: Request, res: Response): Promise<void> {
		const userRepo = this.db.getRepository(User);
		const users = await userRepo.find();

		if (!users.length) {
			res.status(404).json({ error: 'No users in the database' });
			return;
		}

		const zip = new JSZip();

		users.forEach(user => {
			if (!user.photos || !user.photos.length) return;
			const name = user.name.replace(/\s+/, '_');
			const info = stringify({
				id: user.id,
				name: user.name,
				phone: user.phone,
				createdAt: moment(user.createdAt).utc().format('ddd MMM YYYY - HH:mm')
			});
			zip.folder(name);

			zip.file(`${name}/info.yml`, info);

			user.photos.forEach((photo, i) => {
				const { ext } = fileType(photo.buffer.buffer)!;
				zip.file(`${name}/${i + 1}.${ext}`, photo.buffer.buffer);
			});
		});

		const file = await zip.generateAsync({ type: 'nodebuffer' });
		const readStream = new PassThrough();
		readStream.end(file);

		res.set('Content-disposition', `attachment; filename=student_photos.zip`);
		res.set('Content-Type', 'application/zip');

		readStream.pipe(res);
	}
}
