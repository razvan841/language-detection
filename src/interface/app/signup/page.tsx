import React from "react";
import Header from "../_components/header";
import SignupForum from "./_components/signup_form";

const page = () => {
	return (
		<Header>
			<div className="flex items-center flex-col gap-5 w-full px-10 pb-20">
				<SignupForum />
			</div>
		</Header>
	);
};

export default page;
