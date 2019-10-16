import { RequestHandler } from 'express';
import { Connection } from 'typeorm';
import { Logger } from 'winston';

export declare type requestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'all';

export interface IRouteOptions {
	method?: requestMethod;
	endpoint?: string | string[] | RegExp;
	root?: boolean;
	order?: number;
	middlewares?: RequestHandler[];
}

export interface IRouteInitData {
	db: Connection;
	logger: Logger;
}

export interface IAuthDecoded {
	pw: string;
	ip: string;
	t: number;
	iat: number;
	exp: number;
}
