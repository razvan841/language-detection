import React from "react";
import Image from "next/image";
import Header from "../_components/header";
import Button from "../_components/button";
import LoginForum from "./_components/login_forum";

const page = () => {
	return (
		<Header>
			<div className="flex items-center flex-col gap-16 w-full px-10 pb-20">
				<LoginForum />
			</div>
		</Header>
	);
};

export default page;
