import { v4 as uuidv4 } from "uuid";
import Database, { Database as DatabaseType } from "better-sqlite3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export type User = {
	id: string;
	username: string;
	email: string;
};

export type Alarm = {
	id: string;
	date_of_occurrence: Date;
};

function handleSQLiteError(error: Error): {
	success: false;
	error: string;
} {
	if (!(error instanceof Database.SqliteError)) {
		return {
			success: false,
			error: error.message,
		};
	}

	return {
		success: false,
		error: error.code,
	};
}

export function createTables(db: DatabaseType) {
	const accountTable =
		"CREATE TABLE IF NOT EXISTS account (id TEXT NOT NULL PRIMARY KEY, username TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, CONSTRAINT email_unique UNIQUE (email)); ";

	const alarmTable =
		"CREATE TABLE IF NOT EXISTS alarm (id TEXT NOT NULL, date_of_occurrence DATE DEFAULT CURRENT_TIMESTAMP,  PRIMARY KEY (id, date_of_occurrence), FOREIGN KEY (id) REFERENCES account (id)); ";

	const accountTableSQL = db.prepare(accountTable);
	accountTableSQL.run();

	const alarmTableSQL = db.prepare(alarmTable);
	alarmTableSQL.run();
}

export function createUser(
	db: DatabaseType,
	{
		username,
		email,
		password,
	}: {
		username: string;
		email: string;
		password: string;
	}
):
	| {
			success: true;
	  }
	| ReturnType<typeof handleSQLiteError> {
	const id = uuidv4();

	const hashedPassword = hashPassword(password);

	const sql =
		"INSERT INTO account (id, username, email, password) VALUES (?, ?, ?, ?)";

	const createUserSQL = db.prepare(sql);

	try {
		createUserSQL.run(id, username, email, hashedPassword);
		return {
			success: true,
		};
	} catch (error) {
		return handleSQLiteError(error as Error);
	}
}

function hashPassword(plaintextPassword: string) {
	const hash = bcrypt.hashSync(plaintextPassword, 10);
	return hash;
}

export function createAlarm(
	db: DatabaseType,
	userId: string
):
	| {
			success: true;
	  }
	| ReturnType<typeof handleSQLiteError> {
	const sql = "INSERT INTO alarm (id) VALUES (?)";
	const createAlarmSQL = db.prepare(sql);

	try {
		createAlarmSQL.run(userId);
		return {
			success: true,
		};
	} catch (error) {
		return handleSQLiteError(error as Error);
	}
}

export function selectAllUsers(db: DatabaseType):
	| {
			success: true;
			users: User[];
	  }
	| ReturnType<typeof handleSQLiteError> {
	const sql = "SELECT id, username, email FROM account";

	const selectAllUSersSQL = db.prepare(sql);

	try {
		const users = selectAllUSersSQL.all() as User[];

		return {
			success: true,
			users,
		};
	} catch (error) {
		return handleSQLiteError(error as Error);
	}
}

export function getUserById(
	db: DatabaseType,
	userId: string
):
	| {
			success: true;
			user: User;
	  }
	| ReturnType<typeof handleSQLiteError> {
	const sql = "SELECT id, username, email FROM account WHERE id = ? ";

	const getUserInfoSQL = db.prepare(sql);

	try {
		const user = getUserInfoSQL.get(userId) as User;
		return {
			success: true,
			user,
		};
	} catch (error) {
		return handleSQLiteError(error as Error);
	}
}

export function getUserByEmail(
	db: DatabaseType,
	email: string
):
	| {
			success: true;
			user: User;
	  }
	| ReturnType<typeof handleSQLiteError> {
	const sql = "SELECT id, username, email FROM account WHERE email = ? ";

	const getUserInfoSQL = db.prepare(sql);

	try {
		const user = getUserInfoSQL.get(email) as User;
		return {
			success: true,
			user,
		};
	} catch (error) {
		return handleSQLiteError(error as Error);
	}
}

export function getAlarmsByuserId(
	db: DatabaseType,
	userId: string
):
	| {
			success: true;
			alarms: Alarm[];
	  }
	| ReturnType<typeof handleSQLiteError> {
	const sql = "SELECT id, date_of_occurrence FROM alarm WHERE id = ? ";

	const getAlarmsByuserIdSQL = db.prepare(sql);
	try {
		const alarms = getAlarmsByuserIdSQL.all(userId) as Alarm[];
		return {
			success: true,
			alarms,
		};
	} catch (error) {
		return handleSQLiteError(error as Error);
	}
}

export function getAlarmCountPerUser(db: DatabaseType):
	| {
			success: true;
			alarmCounts: { count: number; id: string; username: string }[];
	  }
	| ReturnType<typeof handleSQLiteError> {
	const sql =
		"SELECT COUNT(date_of_occurrence) as count, a.id, ac.username FROM alarm a LEFT JOIN account ac ON ac.id = a.id GROUP BY a.id ORDER BY count desc";

	const getAlarmsByuserIdSQL = db.prepare(sql);
	try {
		const alarmCounts = getAlarmsByuserIdSQL.all() as {
			count: number;
			id: string;
			username: string;
		}[];
		return {
			success: true,
			alarmCounts,
		};
	} catch (error) {
		return handleSQLiteError(error as Error);
	}
}

export function checkPasswordFromEmail(
	db: DatabaseType,
	email: string,
	plainPassword: string
) {
	const sql = "SELECT password FROM account WHERE email = ? ";
	const checkPasswordFromEmailSQL = db.prepare(sql);

	const hashedPassword = checkPasswordFromEmailSQL.get(email) as {
		password: string;
	};

	if (!hashedPassword || !hashedPassword.password) {
		return;
	}

	return comparePassword(plainPassword, hashedPassword.password);
}

function comparePassword(plainPassword: string, hashedPassword: string) {
	const result = bcrypt.compareSync(plainPassword, hashedPassword);
	return result;
}

function deleteDataAccount(db: DatabaseType):
	| {
			success: true;
	  }
	| ReturnType<typeof handleSQLiteError> {
	const sql = "DELETE FROM account";

	const deleteDataAccountSQL = db.prepare(sql);
	try {
		deleteDataAccountSQL.run();
		return {
			success: true,
		};
	} catch (error) {
		return handleSQLiteError(error as Error);
	}
}

function deleteDataAlarm(db: DatabaseType):
	| {
			success: true;
	  }
	| ReturnType<typeof handleSQLiteError> {
	const sql = "DELETE FROM alarm";

	const deleteDataAlarmSQL = db.prepare(sql);
	try {
		deleteDataAlarmSQL.run();
		return {
			success: true,
		};
	} catch (error) {
		return handleSQLiteError(error as Error);
	}
}

export function createJWTtoken(
	db: DatabaseType,
	email: string,
	plainPassword: string
):
	| {
			success: true;
			token: string;
	  }
	| ReturnType<typeof handleSQLiteError> {
	if (checkPasswordFromEmail(db, email, plainPassword)) {
		const user = getUserByEmail(db, email);
		if (!user.success) {
			return {
				success: false,
				error: "USER_NOT_FOUND",
			};
		}

		const token = jwt.sign(
			{ id: user.user.id },
			process.env.JWT_SECRET_KEY!,
			{
				expiresIn: "12h",
			}
		);

		return {
			success: true,
			token,
		};
	} else {
		return {
			success: false,
			error: "CREDENTIALS_INVALID",
		};
	}
}

export function validateJWTtoken(token: string) {
	try {
		return jwt.verify(token, process.env.JWT_SECRET_KEY!, {
			maxAge: "12h",
		}) as {
			id: string;
		};
	} catch (err) {
		return null;
	}
}
