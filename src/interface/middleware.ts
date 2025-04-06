import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	if (
		request.nextUrl.pathname === "/" ||
		request.nextUrl.pathname === "/login"
	) {
		const token = request.cookies.get("english-token");
		if (!request.cookies.has("english-token") || !token) {
			return NextResponse.next();
		}

		const validResponse = await fetch(url(request, "/api/verify"), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-english-token":
					request.cookies.get("english-token")?.value || "",
			},
		});

		if (validResponse.status !== 200) {
			return NextResponse.next();
		}

		return redirect(request, "/dashboard");
	}

	if (request.nextUrl.pathname === "/dashboard") {
		const token = request.cookies.get("english-token");

		// Comment it out from here in order to disable the middelware to the dashboard
		////////////////////////////////////////////////////////////////////
		if (!request.cookies.has("english-token") || !token) {
			return redirect(request, "/login");
		}

		const validResponse = await fetch(url(request, "/api/verify"), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-english-token":
					request.cookies.get("english-token")?.value || "",
			},
		});

		if (validResponse.status !== 200) {
			return redirect(request, "/login");
		}

		return NextResponse.next();
	}

	//////////////////////////////////////////////////////////////////////////////////

	if (request.nextUrl.pathname === "/signup") return NextResponse.next();
	return redirect(request, "/");
}

function redirect(request: NextRequest, pathname: string) {
	return NextResponse.redirect(url(request, pathname));
}

function url(request: NextRequest, pathname: string) {
	const url = request.nextUrl.clone();
	url.pathname = pathname;
	return url;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|static).*)",
	],
};
