/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Express, json, urlencoded, RequestHandler } from 'express';
import * as formidable from 'express-formidable';
import { join, resolve } from 'path';
import { Connection } from 'typeorm';
import { Logger } from 'winston';
import Database from './Database';
import Route from './Route';
import { readdirRecursive, parseRouteEndpoints } from '../util';
import { logger, TOPICS, EVENTS } from '../util/logger';

// Import and Set Nuxt.js options
const { Nuxt, Builder } = require('nuxt');
const config = require('../../nuxt.config.js');
config.dev = process.env.NODE_ENV !== 'production';

export default class Server {
	public server: Express;
	public logger: Logger;
	public db!: Connection;
	public nuxt: any;
	public path: string;
	public host: string;
	public port: string;
	public readonly API_METHODS = resolve(join(__dirname, '..', 'api'));
	public readonly DEV = process.env.NODE_ENV === 'development';
	public methods: { [key: string]: Route } = {};
	public endpoints: { [key: string]: string } = {};

	public constructor(server: Express, path: string) {
		this.server = server;
		this.path = path;
		this.logger = logger;

		// Init Nuxt.js
		this.nuxt = new Nuxt(config);

		const { host, port } = this.nuxt.options.server;
		this.host = host;
		this.port = port;
	}

	private setMiddlewares() {
		// Body Parser Middleware
		this.server.use(json());
		this.logger.info('Loaded json middleware', { topic: TOPICS.EXPRESS, event: EVENTS.INIT });
		this.server.use(urlencoded({ extended: false }));
		this.logger.info('Loaded urlencoded middleware', { topic: TOPICS.EXPRESS, event: EVENTS.INIT });
		this.server.use(formidable());
		this.logger.info('Loaded formidable middleware', { topic: TOPICS.EXPRESS, event: EVENTS.INIT });
	}

	public async init() {
		process.on('unhandledRejection', error => {
			this.logger.error((error as string), {
				topic: TOPICS.UNHANDLED_REJECTION,
				event: EVENTS.ERROR
			});
		});

		this.db = Database;
		await this.db.connect();
		this.logger.info('Connected to DB', { topic: TOPICS.MONGODB, event: EVENTS.INIT });

		// Build only in dev mode
		if (config.dev) {
			this.logger.info('Running Nuxt builder in dev mode', { topic: TOPICS.NUXT, event: EVENTS.INIT });
			const builder = new Builder(this.nuxt);
			await builder.build();
			this.logger.info('Finished building Nuxt in dev mode', { topic: TOPICS.NUXT, event: EVENTS.INIT });
		} else {
			this.logger.info('Running Nuxt in production mode', { topic: TOPICS.NUXT, event: EVENTS.INIT });
			await this.nuxt.ready();
			this.logger.info('Nuxt ready', { topic: TOPICS.NUXT, event: EVENTS.INIT });
		}

		this.setMiddlewares();

		await this.loadAll();

		this.logger.info(
			`Loaded ${Object.values(this.methods).length} routes with ${
				Object.values(this.endpoints).length
			} endpoints`,
			{
				topic: TOPICS.EXPRESS,
				event: EVENTS.INIT
			}
		);

		this.server.use(this.nuxt.render);
		this.logger.info('Loaded Nuxt renderer', { topic: TOPICS.EXPRESS, event: EVENTS.INIT });

		// Listen the server
		this.server.listen(this.port);
		this.logger.info(`Server listening on http://${this.host}:${this.port}`, {
			topic: TOPICS.EXPRESS,
			event: EVENTS.READY
		});
	}

	public register(file: Route): Route {
		if (Object.keys(this.methods).includes(file.id)) {
			throw new Error(`Already loaded route ${file.id}`);
		}

		parseRouteEndpoints(file, this.path, this.endpoints);
		this.methods[file.id] = file;

		return file;
	}

	public async load(file: Route): Promise<Route> {
		const handler: RequestHandler = async (req, res, next): Promise<void> => {
			try {
				await file.exec(req, res, next);
			} catch (error) {
				this.logger.error(error, { topic: TOPICS.EXPRESS_HANDLER });
				res
					.status(500)
					.json({ error: error.message || 'Something went wrong' });
			}
		};

		if (file.middlewares) {
			// @ts-ignore
			this.server[file.method!](file.endpoint!, ...file.middlewares, handler);
		} else {
			// @ts-ignore
			this.server[file.method!](file.endpoint!, handler);
		}

		if (this.DEV) {
			this.logger.info(`Loaded route: ${file.id}`, {
				topic: TOPICS.EXPRESS,
				event: EVENTS.INIT
			});
		}

		return file;
	}

	public async loadAll() {
		const methodFiles = readdirRecursive(this.API_METHODS);

		for (const method of methodFiles) {
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			const file: Route = new (require(method)).default();

			file.init({ logger: this.logger, db: this.db });

			this.register(file);
		}

		const files = Object.values(this.methods);
		files
			.sort((a, b) => a.order! - b.order!)
			.forEach(async file => {
				await this.load(file);
			});

		return this;
	}
}

