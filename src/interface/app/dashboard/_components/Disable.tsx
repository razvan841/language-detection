"use client";
import ButtonStyle from "@/app/_components/button_style";
import Quiz from "@/app/_components/quizGame";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Disable() {
	const router = useRouter();
	const [showQuiz, setShowQuiz] = useState(false);

	async function handleDisable() {
		const loginResponse = await fetch("/api/disable", {
			method: "POST",
		});

		if (loginResponse.status !== 200 && loginResponse.status !== 208) {
			console.log(loginResponse.statusText);
			alert("Could not disable alarm, internal error");
			return;
		}

		router.refresh();
	}

	return (
		<>
			{showQuiz ? (
				<Quiz doneQuiz={handleDisable} />
			) : (
				<div className="flex items-center flex-col gap-5 w-full px-10 pb-20">
					<ButtonStyle
						onClick={() => setShowQuiz(true)}
						className="bg-alarm"
					>
						Disable
					</ButtonStyle>
				</div>
			)}
		</>
	);
}
