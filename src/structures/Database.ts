import { ConnectionManager } from 'typeorm';
import User from '../models/User';

const manager = new ConnectionManager();
const connection = manager.create({
	type: 'mongodb',
	url: process.env.DB_URI,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	entities: [User],
	database: process.env.NODE_ENV === 'development' ? 'dev' : 'test'
});

export default connection;
