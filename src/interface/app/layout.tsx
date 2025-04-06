import Image from "next/image";
import "./globals.css";
import type { Metadata } from "next";
import Back from "./_components/back";

// This is where you define what text you want next to your app, so what you want in the browser to appear
export const metadata: Metadata = {
	title: "English PLEASE!",
	description:
		"English, Please! is a device that monitors the conversations in the room. Based on these conversations it will determine whether the spoken language is English. When another language is detected various attention grabbing gadgets will be used to notify the user.",
};

//This is where we define the HTML structure for all the children that will be made
export default function RootLayout({
	children,
}: {
	//This lines specifies that children prop is excpected to be of the type React
	children: React.ReactNode;
}) {
	//We then can set the HTML for all the pages that will be a general layout
	return (
		<html lang="en">
			<head>
				<link
					rel="shortcut icon"
					href="/favicon.ico"
					type="image/x-icon"
				/>
			</head>
			<body className="bg-[#62381A] overflow-x-hidden">
				<main>
					<div className="h-[90vh] bg-primary w-full sm:py-6">
						<Back />
					</div>
					{/* this is a special div for the mountains */}

					<div className="relative z-10">
						<div className="absolute top-0 h-[60vh] overflow-visible w-full -translate-y-[99%]">
							<Image
								src="/static/images/landscape.svg"
								alt="d"
								className="object-center object-cover"
								layout="fill"
							/>
						</div>
						{children}
					</div>
				</main>
			</body>
		</html>
	);
}
