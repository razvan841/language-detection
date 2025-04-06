export default async function getAlarmStatus() {
	try {
		const alarmResponse = await fetch(process.env.ALARM_API! + "/status", {
			cache: "no-store",
		});
		if (alarmResponse.status === 200) {
			const alarm = (await alarmResponse.json()) as {
				status: boolean;
			};
			return alarm.status;
		}

		return false;
	} catch (error) {
		return false;
	}
}
