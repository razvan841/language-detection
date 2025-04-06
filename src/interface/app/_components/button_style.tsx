import { classNames } from "@/classnames";
import React, { PropsWithChildren, ComponentPropsWithoutRef } from "react";

export default function ButtonStyle({
	children,
	className,
	...props
}: PropsWithChildren<ComponentPropsWithoutRef<"div">>) {
	return (
		<div
			className={classNames(
				"text-3xl cursor-pointer text-center text-text w-full max-w-[250px] py-5 px-10 rounded-3xl drop-shadow-[0_4px_3px_rgba(0,0,0,0.25)]",
				className,
				!className?.includes("bg-") && "bg-button"
			)}
			{...props}
		>
			{children}
		</div>
	);
}
