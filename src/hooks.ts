import { LOCALES } from "$lib/utils/constants";
import type { GetSession } from "@sveltejs/kit";
import { parse } from "cookie";

export const getSession: GetSession = ({ headers, query }) => {
	let acceptedLanguage = headers["accept-language"] && headers["accept-language"].split(",")[0];
	let isValidQueryLang = Object.keys(LOCALES).includes(query.get("lang"));

	let storedLocale =
		(isValidQueryLang && query.get("lang")) || parse(headers.cookie || "")["locale"];
	return { acceptedLanguage, storedLocale };
};
