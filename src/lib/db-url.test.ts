import { describe, expect, it } from 'vitest';

import { parseMysqlDatabaseUrl } from '@/lib/db-url';

describe('parseMysqlDatabaseUrl', () => {
	it('parses a standard mysql URL', () => {
		expect(parseMysqlDatabaseUrl('mysql://trimnexa:secret@127.0.0.1:3308/trimnexa')).toEqual({
			host: '127.0.0.1',
			port: 3308,
			user: 'trimnexa',
			password: 'secret',
			database: 'trimnexa',
			connectionLimit: 10,
		});
	});

	it('defaults port 3306 and decodes credentials', () => {
		expect(parseMysqlDatabaseUrl('mysql://user%40mail:p%40ss@localhost/app_db')).toEqual({
			host: 'localhost',
			port: 3306,
			user: 'user@mail',
			password: 'p@ss',
			database: 'app_db',
			connectionLimit: 10,
		});
	});

	it('rejects non-mysql schemes', () => {
		expect(() => parseMysqlDatabaseUrl('postgresql://u:p@localhost:5432/db')).toThrow(/mysql/);
	});
});
