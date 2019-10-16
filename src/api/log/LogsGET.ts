import { Request, Response } from 'express';
import { readdir } from 'fs-extra';
import { join } from 'path';
import { promisify } from 'util';
import Route from '../../structures/Route';

const promReaddir: (path: string) => Promise<string[]> = promisify(readdir);

const parseFilename = (name: string): {
	date: Date;
	toString: () => string;
} => {
	const [, year, month, day] = /(\d+)-(\d+)-(\d+)\.log/.exec(name)!;
	const date = new Date(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10));
	return {
		date,
		toString: () => `${year}-${month}-${day}`
	};
};

export default class LogsGET extends Route {
	public constructor() {
		super({
			method: 'get',
			endpoint: ['/logs']
		});
	}

	public async exec(req: Request, res: Response): Promise<void> {
		const files = (await promReaddir(join(process.cwd(), 'logs')))
			.filter((file: string) => file.endsWith('.log'))
			.map(parseFilename)
			.sort((a, b) => b.date.getMilliseconds() - a.date.getMilliseconds());

		if (!files.length) {
			res.status(500).json({ error: 'No log files available' });
			return;
		}


		res.redirect(`/api/logs/${files[0]}`);
	}
}
