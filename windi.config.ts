import { defineConfig } from "windicss/helpers";

export default defineConfig({
	theme: {
		extend: {
			borderColor: {
				DEFAULT: "#D4D4D4",
			},
			colors: {
				primary: {
					DEFAULT: "#3F9CB4",
					dark: "#267185",
					10: "#ECF6F8",
				},
				title: "#404040",
				sub: "#888888",
				body: "#555555",
				highlighter: "#FFFFA2",
				grey: {
					10: "#F5F5F5",
				},
			},
			fontFamily: {
				sans: ["Poppins", "sans-serif"],
			},
			boxShadow: {
				card: "0px 12px 10px -8px rgba(0, 0, 0, 0.15)",
				"card-selected": "0px 12px 10px -8px rgba(63, 156, 180, 0.4)",
			},
		},
	},
	plugins: [require("windicss/plugin/line-clamp")],
});
