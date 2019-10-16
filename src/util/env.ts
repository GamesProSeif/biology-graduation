import { join } from 'path';
try {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	require('dotenv').config({ path: join(__dirname, '..', '..', '.env') });
} catch {}
