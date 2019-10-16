import { join } from 'path';
import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export enum TOPICS {
	UNHANDLED_REJECTION = 'UNHANDLED_REJECTION',
	EXPRESS = 'EXPRESS',
	EXPRESS_HANDLER = 'EXPRESS_HANDLER',
	MONGODB = 'MONGODB',
	NUXT = 'NUXT'
}

export enum EVENTS {
	INIT = 'INIT',
	ERROR = 'ERROR',
	READY = 'READY',
	NEW_USER = 'NEW_USER',
	ENDPOINT_HIT = 'ENDPOINT_HIT'
}

export const logger = createLogger({
	format: format.combine(
		format.errors({ stack: true }),
		format.label({ label: 'API' }),
		format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
		format.printf((info: any) => {
			const { timestamp, label, level, message, topic, event, ...rest } = info;
			return `[${timestamp}][${label}][${level.toUpperCase()}][${topic}]${event ? `[${event}]` : ''}: ${message}${Object.keys(rest).length ? `\n${JSON.stringify(rest, null, 2)}` : ''}`;
		})
	),
	transports: [
		new transports.Console({
			format: format.colorize({ level: true }),
			level: 'info'
		}),
		new DailyRotateFile({
			format: format.combine(format.timestamp(), format.json()),
			level: 'debug',
			filename: '%DATE%.log',
			maxFiles: '14d',
			dirname: join(process.cwd(), 'logs')
		})
	]
});
