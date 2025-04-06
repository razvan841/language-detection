import Database, { Database as DatabaseType } from "better-sqlite3";
import * as fs from "fs";
import { NextRequest } from "next/server";
import { MockServer } from "jest-mock-server";

import {
	POST as signupPOST
} from "../app/api/signup/route";
import {
	POST as logInPOST
} from "../app/api/login/route";
import {
	POST as disablePOST
} from "../app/api/disable/route";
import {
	POST as verifyPOST
} from "../app/api/verify/route";
import {
	GET as leaderboardGET
} from "../app/api/leaderboard/route";
import { createAlarm, validateJWTtoken } from "@/db";

const dummyPassword = "Test1234!@#";
async function createDummyUser(email: string) {
	const reqSignup = new NextRequest("http://localhost", {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({
			email,
			username: "dummy-" + email,
			pwd: dummyPassword,
		}),
	});

	await signupPOST(reqSignup);
}

async function loginDummyUser(email: string) {
	const reqLogin = new NextRequest("http://localhost", {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({
			email,
			pwd: dummyPassword,
		}),
	});

	const resLogin = await logInPOST(reqLogin);
	return (await resLogin.json()).token as string;
}

let db: DatabaseType;
beforeAll(() => {
	process.env.TEST_DB = "./api-test.db";
	fs.writeFileSync(process.env.TEST_DB!, "");
	db = new Database(process.env.TEST_DB!);
});

describe("signup", () => {
	test("signup_successful", async () => {
		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				email: "test@test.test",
				username: "test",
				pwd: "Test123!@#",
			}),
		});

		const res = await signupPOST(req);
		const json = (await res.json()) as {
			success: boolean;
		};

		expect(json.success).toBe(true);
		expect(res.status).toBe(200);
	});

	test("signup_already_taken_email", async () => {
		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				email: "test@test.test",
				username: "test2",
				pwd: "Test123!@#",
			}),
		});

		const res = await signupPOST(req);
		const json = (await res.json()) as {
			success: boolean;
		};

		expect(json.success).toBe(false);
		expect(res.status).toBe(409);
	});

	test("signup_invalid_email_no_at", async () => {
		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				email: "test/test.test",
				username: "wrongEmail1",
				pwd: "Test123!@#",
			}),
		});

		const res = await signupPOST(req);
		const json = (await res.json()) as {
			success: boolean;
		};

		expect(json.success).toBe(false);
		expect(res.status).toBe(422);
	});

	test("signup_invalid_email_domain_too_short", async () => {
		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				email: "test@test.w",
				username: "wrongEmail2",
				pwd: "Test123!@#",
			}),
		});

		const res = await signupPOST(req);
		const json = (await res.json()) as {
			success: boolean;
		};

		expect(json.success).toBe(false);
		expect(res.status).toBe(422);
	});

	test("singup_invalid_password_no_number_and_special", async () => {
		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				email: "test1@test.test",
				username: "wrongPassword1",
				pwd: "test",
			}),
		});

		const res = await signupPOST(req);
		const json = (await res.json()) as {
			success: boolean;
		};

		expect(json.success).toBe(false);
		expect(res.status).toBe(422);
	});

	test("signup_invalid_password_no_capital", async () => {
		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				email: "test2@test.test",
				username: "wrongPassword2",
				pwd: "test123!@#",
			}),
		});

		const res = await signupPOST(req);
		const json = (await res.json()) as {
			success: boolean;
		};

		expect(json.success).toBe(false);
		expect(res.status).toBe(422);
	});

	test("signup_invalid_no_username", async () => {
		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				email: "test3@test.test",
				username: "",
				pwd: "Test123!@#",
			}),
		});

		const res = await signupPOST(req);
		const json = (await res.json()) as {
			success: boolean;
		};

		expect(json.success).toBe(false);
		expect(res.status).toBe(422);
	});

	test("signup_invalid_no_email", async () => {
		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				email: "",
				username: "randomUsername",
				pwd: "Test123!@#",
			}),
		});

		const res = await signupPOST(req);
		const json = (await res.json()) as {
			success: boolean;
		};

		expect(json.success).toBe(false);
		expect(res.status).toBe(422);
	});

	test("signup_invalid_no_password", async () => {
		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				email: "test4@test.test",
				username: "randomUsername",
				pwd: "",
			}),
		});

		const res = await signupPOST(req);
		const json = (await res.json()) as {
			success: boolean;
		};

		expect(json.success).toBe(false);
		expect(res.status).toBe(422);
	});
});

describe("log_in", () => {
	const email = "account@test.test";

	beforeAll(async () => {
		await createDummyUser(email);
	});

	test("log_in_success", async () => {
		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				email,
				pwd: dummyPassword,
			}),
		});

		const res = await logInPOST(req);
		const json = (await res.json()) as {
			success: boolean;
		};

		expect(json.success).toBe(true);
		expect(res.status).toBe(200);
	});

	test("log_in_invalid_wrong_password", async () => {
		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				email,
				pwd: "wrongPassword",
			}),
		});

		const res = await logInPOST(req);
		const json = (await res.json()) as {
			success: boolean;
		};

		expect(json.success).toBe(false);
		expect(res.status).toBe(401);
	});

	test("log_in_invalid_account_doesnt_exist", async () => {
		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				email: "doesnt@exist.test",
				pwd: "randomPassword",
			}),
		});

		const res = await logInPOST(req);
		const json = (await res.json()) as {
			success: boolean;
		};

		expect(json.success).toBe(false);
		expect(res.status).toBe(401);
	});

	test("log_in_invalid_no_email", async () => {
		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				email: "",
				pwd: "Test123!@#",
			}),
		});

		const res = await logInPOST(req);
		const json = (await res.json()) as {
			success: boolean;
		};

		expect(json.success).toBe(false);
		expect(res.status).toBe(422);
	});

	test("log_in_invalid_no_pwd", async () => {
		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				email,
				pwd: "",
			}),
		});

		const res = await logInPOST(req);
		const json = (await res.json()) as {
			success: boolean;
		};

		expect(json.success).toBe(false);
		expect(res.status).toBe(422);
	});
});

describe("disable", () => {
	const server = new MockServer();
	const email = "alarm@test.test";
	let token: string | undefined;

	beforeAll(async () => {
		await server.start();
		process.env.ALARM_API = server.getURL().toString().slice(0, -1);

		await createDummyUser(email);
		token = await loginDummyUser(email);
	});
	afterAll(() => server.stop());
	beforeEach(() => {
		server.reset();
	});

	test("disable", async () => {
		// disable
		const route = server.get("/status").mockImplementationOnce((ctx) => {
			ctx.status = 200;
			ctx.body = JSON.stringify({
				status: true,
			});
		});

		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
				"x-english-token": token!,
			},
			method: "POST",
		});

		const res = await disablePOST(req);
		expect(res.status).toBe(200);
		expect((await res.json()).success).toBe(true);

		expect(route).toBeCalledTimes(1);
	});

	test("disable_alarm_false", async () => {
		const route = server.get("/status").mockImplementationOnce((ctx) => {
			ctx.status = 200;
			ctx.body = JSON.stringify({
				status: false,
			});
		});

		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
		});

		const res = await disablePOST(req);
		expect(res.status).toBe(208);
		expect((await res.json()).success).toBe(true);

		expect(route).toHaveBeenCalledTimes(1);
	});

	test("disable_alarm_no_token", async () => {
		const route = server.get("/status").mockImplementationOnce((ctx) => {
			ctx.status = 200;
			ctx.body = JSON.stringify({
				status: true,
			});
		});

		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
		});

		const res = await disablePOST(req);
		expect(res.status).toBe(401);
		expect((await res.json()).success).toBe(false);

		expect(route).toHaveBeenCalledTimes(1);
	});

	test("disable_alarm_invalid_token", async () => {
		const route = server.get("/status").mockImplementationOnce((ctx) => {
			ctx.status = 200;
			ctx.body = JSON.stringify({
				status: true,
			});
		});

		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
				"x-english-token": "randominvalidtoken",
			},
			method: "POST",
		});

		const res = await disablePOST(req);
		expect(res.status).toBe(401);
		expect((await res.json()).success).toBe(false);

		expect(route).toHaveBeenCalledTimes(1);
	});
});

describe("verify", () => {
	const email = "verify@test.test";
	let token: string | undefined;

	beforeAll(async () => {
		await createDummyUser(email);
		token = await loginDummyUser(email);
	});

	test("verify_with_token", async () => {
		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
				"x-english-token": token!,
			},
			method: "POST",
		});

		const res = await verifyPOST(req);
		expect(res.status).toBe(200);
		expect((await res.json()).success).toBe(true);
	});

	test("verify_with_invalid_token", async () => {
		const req = new NextRequest("http://localhost", {
			headers: {
				"Content-Type": "application/json",
				"x-english-token": "randominvalidtoken",
			},
			method: "POST",
		});

		const res = await verifyPOST(req);
		expect(res.status).toBe(401);
		expect((await res.json()).success).toBe(false);
	});
});

describe("leaderboard", () => {
	const users = [
		{ email: "leaderboard1@test.test", token: "" },
		{ email: "leaderboard2@test.test", token: "" },
		{ email: "leaderboard3@test.test", token: "" },
		{ email: "leaderboard4@test.test", token: "" },
	];

	beforeAll(async () => {
		for (const user of users) {
			await createDummyUser(user.email);
			user.token = await loginDummyUser(user.email);
		}
	});

	async function getLeaderBoard() {
		const req = new NextRequest("http://localhost");
		const res = await leaderboardGET(req);

		const leaderboard = (await res.json()) as
			| {
					success: false;
					error: string;
			  }
			| {
					success: true;
					alarmCounts: {
						count: number;
						id: string;
						username: string;
					}[];
			  };

		return leaderboard;
	}

	test("leaderboard_with_one_user", async () => {
		const valid = validateJWTtoken(users[0].token);
		createAlarm(db, valid!.id);

		let leaderboard = await getLeaderBoard();
		expect(leaderboard.success).toBe(true);
		if (!leaderboard.success) return;

		expect(
			leaderboard.alarmCounts.find((x) => x.id === valid?.id)?.count
		).toBe(1);

		await new Promise((r) => setTimeout(r, 1000));
		createAlarm(db, valid!.id);
		await new Promise((r) => setTimeout(r, 1000));
		createAlarm(db, valid!.id);

		leaderboard = await getLeaderBoard();
		expect(leaderboard.success).toBe(true);
		if (!leaderboard.success) return;

		expect(
			leaderboard.alarmCounts.find((x) => x.id === valid?.id)?.count
		).toBe(3);
	}, 7000);

	test(
		"leaderboard_with_multiple_users",
		async () => {
			// Create alarms
			const ids = [];
			for (let i = 1; i < users.length; i++) {
				const valid = validateJWTtoken(users[i].token);
				ids.push(valid!.id);

				for (let j = 0; j < i; j++) {
					await new Promise((r) => setTimeout(r, 1000));
					createAlarm(db, valid!.id);
				}
			}

			// Check alarms
			let leaderboard = await getLeaderBoard();
			expect(leaderboard.success).toBe(true);
			if (!leaderboard.success) return;

			for (let i = 0; i < ids.length; i++) {
				const id = ids[i];
				expect(
					leaderboard.alarmCounts.find((x) => x.id === id)?.count
				).toBe(i + 1);
			}
		},
		users.length * users.length * 1000
	);
});

afterAll(() => {
	db.close();
});
