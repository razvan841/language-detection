import Link from "next/link";
import React, { PropsWithChildren } from "react";

export default function Button({
	href,
	children,
}: PropsWithChildren<{ href: string }>) {
	return (
		<Link
			href={href}
			className="text-3xl cursor-pointer text-center text-text w-full max-w-[250px] py-5 px-10 bg-button rounded-3xl drop-shadow-[0_4px_3px_rgba(0,0,0,0.25)]"
		>
			{children}
		</Link>
	);
}
