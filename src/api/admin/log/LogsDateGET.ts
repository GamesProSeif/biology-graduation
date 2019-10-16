import { Request, Response } from 'express';
import { readFile } from 'fs-extra';
import { join } from 'path';
import { promisify } from 'util';
import Route from '../../../structures/Route';

const promReadFile: (path: string, encoding: string) => Promise<string> = promisify(readFile);

export default class LogsDateGET extends Route {
	public constructor() {
		super({
			method: 'get',
			endpoint: ['/admin/logs/:date']
		});
	}

	public async exec(req: Request, res: Response): Promise<void> {
		const file = await promReadFile(
			join(
				process.cwd(),
				'logs',
				`${req.params.date.replace(/(\/|\\|\.)/, '')}.log`
			),
			'utf8'
		);
		const logs = file
			.split(/\r\n/)
			.filter(l => l)
			.map(line => JSON.parse(line));

		res.status(200).json({ logs });
	}
}
