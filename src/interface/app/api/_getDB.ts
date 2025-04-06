import { createTables } from "@/db";
import Database from "better-sqlite3";

export default function getDB() {
	const db = new Database(process.env.TEST_DB ?? "./sqlite.db");
	createTables(db);
	return db;
}
