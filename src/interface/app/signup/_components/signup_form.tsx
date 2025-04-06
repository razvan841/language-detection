"use client";

import ButtonStyle from "@/app/_components/button_style";
import { LoginReturn } from "@/app/api/login/route";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignupForum() {
	const router = useRouter();

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");

	const [usernameValid, setUsernameValid] = useState<Boolean>(true);
	const [emailValid, setEmailValid] = useState<Boolean>(true);
	const [passwordValid, setPasswordValid] = useState<Boolean>(true);
	const [passwordConfirmValid, setPasswordConfirmValid] =
		useState<Boolean>(true);

	async function handleSubmit() {
		if (password !== passwordConfirm) {
			setPasswordValid(false);
			setPasswordConfirmValid(false);
			return;
		}

		const signupResponse = await fetch("/api/signup", {
			method: "POST",
			body: JSON.stringify({
				email: email,
				pwd: password,
				username: username,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (signupResponse.status !== 200) {
			setEmailValid(false);
			setPasswordValid(false);
			setUsernameValid(false);
			setPasswordConfirmValid(false);
			return;
		}

		const login = (await signupResponse.json()) as LoginReturn;
		if (!login.success) {
			setUsernameValid(false);
			setEmailValid(false);
			setPasswordValid(false);
			setPasswordConfirmValid(false);
			return;
		}

		router.push("/dashboard");
	}

	return (
		<>
			<ButtonStyle onClick={handleSubmit}>Sign Up</ButtonStyle>
			<div className="w-full sm:w-2/5 sm:max-w-md flex flex-col gap-10">
				{/* Username button */}
				<div className="flex flex-col">
					<label
						className="block text-input text-xl font-black text-input-label"
						htmlFor="username"
					>
						Username
					</label>
					<input
						className={`p-2 outline-none ${
							!usernameValid ? "bg-alarm" : "bg-white"
						} rounded border-4 border-white focus:border-secondary h-12 w-full`}
						type="text"
						required
						value={username}
						onChange={(e) => {
							setUsername(e.target.value);
							setUsernameValid(true);
							setEmailValid(true);
							setPasswordValid(true);
							setPasswordConfirmValid(true);
						}}
					/>
				</div>

				{/* Email and Password button */}
				<div className="flex flex-col">
					<label
						className="block text-input text-xl font-black text-input-label"
						htmlFor="email"
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
							setUsernameValid(true);
							setEmailValid(true);
							setPasswordValid(true);
							setPasswordConfirmValid(true);
						}}
					/>
				</div>
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
							setUsernameValid(true);
							setEmailValid(true);
							setPasswordValid(true);
							setPasswordConfirmValid(true);
						}}
					/>
				</div>

				{/* Repeat password */}
				<div className="flex flex-col">
					<label
						className="block text-input text-xl font-black text-input-label"
						htmlFor="passwordrepeat"
					>
						Repeat Password
					</label>
					<input
						className={`p-2 outline-none ${
							!passwordConfirmValid ? "bg-alarm" : "bg-white"
						} rounded border-4 border-white focus:border-secondary h-12 w-full`}
						type="password"
						required
						value={passwordConfirm}
						onChange={(e) => {
							setPasswordConfirm(e.target.value);
							setUsernameValid(true);
							setEmailValid(true);
							setPasswordValid(true);
							setPasswordConfirmValid(true);
						}}
					/>
				</div>
			</div>
		</>
	);
}
