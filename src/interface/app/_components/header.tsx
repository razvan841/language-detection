import React, { PropsWithChildren } from "react";

export default function Header({ children }: PropsWithChildren<{}>) {
	return (
		<div className="h-[60vh] z-50 sm:h-[54vh] overflow-visible w-full absolute -translate-y-full">
			{children}
		</div>
	);
}
