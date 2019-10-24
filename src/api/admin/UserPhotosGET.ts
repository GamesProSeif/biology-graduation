import { Request, Response } from 'express';
import * as fileType from 'file-type';
// @ts-ignore
import * as JSZip from 'jszip';
import * as moment from 'moment';
import { PassThrough } from 'stream';
import { stringify } from 'yaml';
import User from '../../models/User';
import Route from '../../structures/Route';


export default class UserPhotosGET extends Route {
	public constructor() {
		super({
			method: 'get',
			endpoint: ['/admin/user/:id/photos']
		});
	}

	public async exec(req: Request, res: Response) {
		const userRepo = this.db.getRepository(User);
		const user = await userRepo.findOne(req.params.id.toString());

		if (!user) {
			res.status(400).json({ error: 'User does not exist' });
			return;
		}

		const zip = new JSZip();
		const filename = `${user.name.trim().replace(/\s+/g, '_')}_${user.id}`;

		const info = stringify({
			id: user.id,
			name: user.name,
			phone: user.phone,
			createdAt: moment(user.createdAt).utc().format('ddd MMM YYYY - HH:mm')
		});

		zip.file('info.yml', info);

		user.photos.forEach((photo, i) => {
			const { ext } = fileType(photo.buffer.buffer)!;
			zip.file(`${i + 1}.${ext}`, photo.buffer.buffer);
		});

		const file = await zip.generateAsync({ type: 'nodebuffer' });
		const readStream = new PassThrough();
		readStream.end(file);

		res.set('Content-disposition', `attachment; filename=${filename}.zip`);
		res.set('Content-Type', 'application/zip');

		readStream.pipe(res);
	}
}
