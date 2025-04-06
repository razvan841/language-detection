import { Database as DatabaseType } from "better-sqlite3";
import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/db";
import getDB from "../_getDB";

let db: DatabaseType | undefined;

//stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
const validateEmail = (email: string) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};

// Minimum eight characters, at least one lower, one upper, one number and one special character:
const passwordRegex =
	/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&])[0-9a-zA-Z@$!%*#?&]{8,}$/g;

export type SignupReturn = {
	success: boolean;
};

export async function POST(request: NextRequest) {
	if (
		!request.headers.has("Content-Type") ||
		request.headers.get("Content-Type") !== "application/json"
	) {
		return NextResponse.json(
			{ success: false },
			{
				status: 415,
			}
		);
	}

	const data = (await request.json()) as {
		email?: string;
		username?: string;
		pwd?: string;
	};
	if (
		!data.email ||
		!validateEmail(data.email) ||
		!data.username ||
		!data.pwd ||
		!data.pwd.match(passwordRegex)
	) {
		return NextResponse.json(
			{ success: false },
			{
				status: 422,
			}
		);
	}

	if (!db) {
		db = getDB();
	}

	const status = createUser(db, {
		email: data.email,
		password: data.pwd,
		username: data.username,
	});

	return NextResponse.json(status, {
		status: status.success
			? 200
			: status.error === "SQLITE_CONSTRAINT_UNIQUE"
			? 409
			: 500,
	});
}