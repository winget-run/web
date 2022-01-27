import { LOCALES } from "$lib/utils/constants";
import type { GetSession, Handle } from "@sveltejs/kit";
import { parse } from "cookie";

export const getSession: GetSession = ({ headers, query, path }) => {
	let acceptedLanguage = headers["accept-language"] && headers["accept-language"].split(",")[0];
	let isValidQueryLang = Object.keys(LOCALES).includes(query.get("lang"));

	let storedLocale =
		(isValidQueryLang && query.get("lang")) || parse(headers.cookie || "")["locale"];
	return { acceptedLanguage, storedLocale };
};

export const handle: Handle = async ({ request, resolve }) => {
	const response = await resolve(request);

	return {
		...response,
		headers: {
			"X-Frame-Options": "DENY",
			"X-PoweredBy": "https://www.youtube.com/watch?v=6n3pFFPSlW4",
			"Cache-Control": "public, max-age=604800, immutable",
		},
	};
};
