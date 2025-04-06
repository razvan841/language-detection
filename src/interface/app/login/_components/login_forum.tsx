"use client";

import ButtonStyle from "@/app/_components/button_style";
import { LoginReturn } from "@/app/api/login/route";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginForum() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [emailValid, setEmailValid] = useState<Boolean>(true);
	const [passwordValid, setPasswordValid] = useState<Boolean>(true);

	async function handleSubmit() {
		const loginResponse = await fetch("/api/login", {
			method: "POST",
			body: JSON.stringify({
				email: email,
				pwd: password,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (loginResponse.status !== 200) {
			setEmailValid(false);
			setPasswordValid(false);
			return;
		}

		const login = (await loginResponse.json()) as LoginReturn;
		if (!login.success) {
			setEmailValid(false);
			setPasswordValid(false);
			return;
		}

		router.push("/dashboard");
	}

	return (
		<>
			<ButtonStyle onClick={handleSubmit}>Login</ButtonStyle>
			{/* Username button */}
			<div className="w-full sm:w-2/5 sm:max-w-md flex flex-col gap-10">
				<div className="flex flex-col">
					<label
						className="block text-input text-xl font-black text-input-label"
						htmlFor="username"
					>
						Email
					</label>
					<input
						className={`p-2 outline-none ${
							!emailValid ? "bg-alarm" : "bg-white"
						} rounded border-4 border-white focus:border-secondary h-12 w-full`}
						type="text"
						required
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setEmailValid(true);
							setPasswordValid(true);
						}}
					/>
				</div>

				{/* Email and Password button */}
				<div className="flex flex-col">
					<label
						className="block text-input text-xl font-black text-input-label"
						htmlFor="password"
					>
						Password
					</label>
					<input
						className={`p-2 outline-none ${
							!passwordValid ? "bg-alarm" : "bg-white"
						} rounded border-4 border-white focus:border-secondary h-12 w-full`}
						type="password"
						required
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
							setEmailValid(true);
							setPasswordValid(true);
						}}
					/>
				</div>
			</div>
		</>
	);
}
