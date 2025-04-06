import { Database as DatabaseType } from "better-sqlite3";
import { NextRequest, NextResponse } from "next/server";
import { createJWTtoken } from "@/db";
import getDB from "../_getDB";

let db: DatabaseType | undefined;

export type LoginReturn =
	| {
			success: true;
			token: string;
	  }
	| {
			success: false;
			error: string;
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

	const data = (await request.json()) as { email?: string; pwd?: string };
	if (!data.email || !data.pwd) {
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

	const token = createJWTtoken(db, data.email, data.pwd);
	const response = NextResponse.json(token, {
		status: token.success ? 200 : 401,
	});

	if (token.success) response.cookies.set("english-token", token.token);
	else response.cookies.delete("english-token");

	return response;
}