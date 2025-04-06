import Database, { Database as DatabaseType } from "better-sqlite3";
import {
	createAlarm,
	createJWTtoken,
	createTables,
	createUser,
	getAlarmCountPerUser,
	getUserByEmail,
	validateJWTtoken,
} from "../db";
import * as fs from "fs";

let db: DatabaseType;
beforeAll(() => {
	process.env.TEST_DB = "./db-test.db";
	fs.writeFileSync(process.env.TEST_DB!, "");
	db = new Database(process.env.TEST_DB!);
});

test("create_tables", () => {
	createTables(db);
	const sql =
		"SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'";

	const createSQL = db.prepare(sql);
	const result = createSQL.get() as {
		count: number;
	};

	expect(result.count).toBe(2);
});

describe("user", () => {
	const userEmail = "user@test.test";

	beforeAll(() => {
		createUser(db, {
			username: "test",
			email: userEmail,
			password: "Test123!@#",
		});
	});

	test("create_user", () => {
		const sql = "SELECT COUNT(*) as count FROM account WHERE username=?";

		const createSQL = db.prepare(sql);
		const result = createSQL.get("test") as {
			count: number;
		};

		expect(result.count).toBe(1);
	});

	test("create_user_unique_email", () => {
		const result = createUser(db, {
			username: "wrongEmail",
			email: userEmail,
			password: "Test123!@#",
		});

		expect(result.success).toBe(false);
	});
});

describe("alarm", () => {
	const userEmail = "alarm@test.test";

	beforeAll(() => {
		createUser(db, {
			username: "test",
			email: userEmail,
			password: "Test123!@#",
		});
	});

	test("create_alarm", () => {
		const testId = getUserByEmail(db, userEmail);

		expect(testId.success).toBe(true);

		if (!testId.success) {
			return;
		}
		createAlarm(db, testId.user.id);

		const sql = "SELECT COUNT(*) as count FROM alarm ";

		const createSQL = db.prepare(sql);
		const result = createSQL.get() as {
			count: number;
		};

		expect(result.count).toBe(1);
	});

	test("check JWT token", () => {
		const token = createJWTtoken(db, userEmail, "Test123!@#");

		expect(token.success).toBe(true);
		if (!token.success) {
			return;
		}

		expect(validateJWTtoken(token.token)).not.toBeNull();
	});

	test("count alarm", () => {
		const testId = getUserByEmail(db, userEmail);

		expect(testId.success).toBe(true);

		if (!testId.success) {
			return;
		}

		const result = getAlarmCountPerUser(db);

		if (!result.success) {
			return;
		}

		expect(
			result.alarmCounts.find((x) => x.id === testId.user.id)?.count
		).toBe(1);
	});
});

afterAll(() => {
	db.close();
	fs.unlinkSync(process.env.TEST_DB!);
});
