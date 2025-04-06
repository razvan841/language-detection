"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function Back() {
	const router = useRouter();
	const path = usePathname();

	const logout = path === "/dashboard";
	const back = !logout && path !== "/";

	return (
		<div
			onClick={async () => {
				if (back) return router.push("/");
				if (logout) {
					await fetch("/api/logout", { method: "POST" });
					return router.push("/login");
				}
			}}
			className={`flex relative justify-center mx-5 h-1/3 ${
				(back || logout) && "cursor-pointer"
			}`}
		>
			<Image
				className="object-contain"
				src={`/static/images/floatingProfessorEnglishPlease${
					back ? "-back" : logout ? "-logout" : ""
				}.svg`}
				alt="English Please"
				layout="fill"
			/>
		</div>
	);
}
