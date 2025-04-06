import React from "react";
import Header from "./_components/header";
import Link from "next/link";
import Button from "./_components/button";

const page = () => {
	return (
		<>
			<Header>
				<div className="flex items-center flex-col gap-5 w-full px-10">
					<Button href={"/login"}>Login</Button>
					<Button href={"/signup"}>Sign Up</Button>
				</div>
			</Header>
			<div className="flex flex-col sm:flex-row sm:justify-between text-lg px-10 pb-10 gap-10 text-white">
				<div>
					<h1 className="text-xl font-black">Why?</h1>
					<p>
						It can be used for the purpose of inclusivity and
						integration. People are often left out when a foreign
						language is used to communicate. When you want to stop
						the device from making a noise, you must make a puzzle.
					</p>
				</div>
				<div>
					<h1 className="text-xl font-black">About</h1>
					<p>
						English, Please! is a device that monitors the
						conversations in the room. Based on these conversations
						it will determine whether the spoken language is
						English. When another language is detected various
						attention grabbing gadgets will be used to notify the
						user.
					</p>
				</div>
			</div>
		</>
	);
};

export default page;
