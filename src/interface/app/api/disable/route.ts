import { Database as DatabaseType } from "better-sqlite3";
import { NextRequest, NextResponse } from "next/server";
import {
	createAlarm,
	getUserById,
	selectAllUsers,
	validateJWTtoken,
} from "@/db";
import getDB from "../_getDB";

let db: DatabaseType | undefined;

export async function POST(request: NextRequest) {
	const alarmResponse = await fetch(process.env.ALARM_API! + "/status", {
		cache: "no-store",
	});

	let alarmStatus = false;
	if (alarmResponse.status === 200) {
		const alarm = (await alarmResponse.json()) as {
			status: boolean;
		};

		alarmStatus = alarm.status;
	}

	if (!alarmStatus) {
		return NextResponse.json({ success: true }, { status: 208 });
	}

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
	if (!valid || typeof valid === "string")
		return NextResponse.json({ success: false }, { status: 401 });

	const status = createAlarm(db, valid.id);
	if (!status.success) {
		return NextResponse.json(status, { status: 500 });
	}

	await fetch(process.env.ALARM_API! + "/alarm/disable", {
		cache: "no-store",
		method: "POST",
	});

	return NextResponse.json(status);
}