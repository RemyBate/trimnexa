/**
 * Parse a mysql:// DATABASE_URL for Prisma MariaDB driver adapter options.
 */
export interface MysqlConnectionOptions {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
	connectionLimit?: number;
}

export function parseMysqlDatabaseUrl(connectionString: string): MysqlConnectionOptions {
	let url: URL;

	try {
		url = new URL(connectionString);
	} catch {
		throw new Error('DATABASE_URL must be a valid mysql:// connection string.');
	}

	if (url.protocol !== 'mysql:' && url.protocol !== 'mariadb:') {
		throw new Error('DATABASE_URL must use the mysql:// or mariadb:// scheme.');
	}

	const database = decodeURIComponent(url.pathname.replace(/^\//, ''));
	if (!database) {
		throw new Error('DATABASE_URL must include a database name.');
	}

	return {
		host: url.hostname || '127.0.0.1',
		port: url.port ? Number(url.port) : 3306,
		user: decodeURIComponent(url.username || 'root'),
		password: decodeURIComponent(url.password || ''),
		database,
		connectionLimit: 10,
	};
}
