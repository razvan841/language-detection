import { Database as DatabaseType } from "better-sqlite3";
import { NextRequest, NextResponse } from "next/server";
import { validateJWTtoken } from "@/db";
import getDB from "../_getDB";

let db: DatabaseType | undefined;

export async function POST(request: NextRequest) {
	try {
		let token: string | null =
			request.cookies.get("english-token")?.value || null;
		if (!request.cookies.has("english-token") || !token) {
			token = request.headers.get("x-english-token");
		}

		if (!token) {
			return NextResponse.json({ success: false }, { status: 401 });
		}

		if (!db) {
			db = getDB();
		}

		const valid = validateJWTtoken(token);
		if (!valid || typeof valid === "string") {
			return NextResponse.json({ success: false }, { status: 401 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json({ success: false }, { status: 401 });
	}
}