import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import Route from '../structures/Route';
import { AUTH_PW } from '../util';

export default class AuthGET extends Route {
	public constructor() {
		super({
			method: 'get',
			endpoint: ['/auth']
		});
	}

	public exec(req: Request, res: Response) {
		const pw: string = req.query.pw;
		const t: number = parseInt(req.query.t, 10);
		const ip: string = req.ip || req.connection.remoteAddress!;
		// const redirect = req.query.redirect;

		if (!pw || (!t && t !== 0) || !ip) {
			res.status(400).json({ error: 'Missing query data' });
			return;
		}

		if (![0, 1, 2, 3].includes(t)) {
			res.status(400).json({ error: 'Invalid type' });
			return;
		}

		if (!AUTH_PW.includes(pw)) {
			res.status(400).json({ error: 'Invalid password' });
			return;
		}

		if (AUTH_PW.indexOf(pw) !== t) {
			res.status(400).json({ error: 'Type did not match password' });
			return;
		}

		const token = jwt.sign({ pw, t, ip }, process.env.SECRET!, { expiresIn: 1370 });
		res.json({ token });
	}
}
