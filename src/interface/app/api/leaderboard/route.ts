import { getAlarmCountPerUser } from "@/db";
import { Database as DatabaseType } from "better-sqlite3";
import { NextRequest, NextResponse } from "next/server";
import getDB from "../_getDB";

let db: DatabaseType | undefined;

export async function GET(request: NextRequest) {
	if (!db) {
		db = getDB();
	}

	const leaderboard = getAlarmCountPerUser(db);
	return NextResponse.json(leaderboard, {
		status: leaderboard.success ? 200 : 500,
	});
}