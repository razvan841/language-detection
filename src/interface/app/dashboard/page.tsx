import React, { useState } from "react";
import Database, { Database as DatabaseType } from "better-sqlite3";
import { createTables, getAlarmCountPerUser } from "@/db";
import PieChart from "./_components/chart";
import LeaderBoard from "./_components/leaderboard";
import Disable from "./_components/Disable";
import Header from "../_components/header";
import Image from "next/image";
import getAlarmStatus from "../_components/getAlarmStatus";
import Quiz from "../_components/quizGame";
import BrickGame from "../_components/brickGame";
import ClickGame from "../_components/clickGame";

let db: DatabaseType;
async function page() {
	if (!db) {
		db = new Database("./sqlite.db");
		createTables(db);
	}

	//This returns an array whith the people in the leaderboard
	const leaderboard = getAlarmCountPerUser(db);
	const alarmStatus = await getAlarmStatus();
	let hasUserData = false;
	if (leaderboard.success) {
		for (let i = 0; i < leaderboard.alarmCounts.length; i++) {
			if (leaderboard.alarmCounts[i].count > 0) {
				hasUserData = true;
				break;
			}
		}
	}

	return (
		<div>
			<Header>{alarmStatus && <Disable />}</Header>
			<div className="absolute -top-20 -translate-y-full w-full flex justify-center">
				<Image
					width={100}
					height={100}
					className="max-h-[16vh]"
					src="static/images/drillMachine.svg"
					alt="drilling rig"
				/>
			</div>

			{/* TODO make quiz appear when disable button is pressed */}
			{/*<Quiz />*/}
			<div className="flex justify-center align-middle">
				<ClickGame />
			</div>

			{hasUserData ? (
				<div className="flex flex-col gap-10 md:gap-0 md:flex-row text-lg">
					<div className="flex flex-col w-full">
						<div className="text-4xl text-center font-bold text-white">
							Leaderboard
						</div>
						<div className="">
							<PieChart
								charData={
									leaderboard.success
										? leaderboard.alarmCounts
										: []
								}
							/>
						</div>
					</div>
					<div className="flex flex-col items-center w-full">
						<h1 className="text-2xl text-center font-bold text-white">
							Who is the least ENGLISH!
						</h1>
						<LeaderBoard
							charData={
								leaderboard.success
									? leaderboard.alarmCounts
									: []
							}
						/>
					</div>
				</div>
			) : (
				<div className="pb-20">
					<h1 className="text-4xl text-center font-bold text-white">
						No offenders yet! Good job, lets keep it that way!
					</h1>
				</div>
			)}

			<BrickGame />
		</div>
	);
}

export default page;
