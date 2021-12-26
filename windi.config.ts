import { defineConfig } from "windicss/helpers";

export default defineConfig({
	darkMode: "class",
	theme: {
		extend: {
			borderColor: {
				DEFAULT: "#D4D4D4",
			},
			colors: {
				primary: {
					DEFAULT: "#3F9CB4", // Also 50
					60: "#144B59",
					50: "#3F9CB4",
					40: "#A1D6E3",
					30: "#D4E8ED",
					20: "#E4F0F3",
					10: "#F2F7F9",
				},
				title: "#404040",
				sub: {
					DEFAULT: "#888888",
					dark: "#929AC9",
				},
				body: {
					DEFAULT: "#555555",
					dark: "#BEC7D5",
				},
				highlighter: {
					DEFAULT: "#FFFFA2",
					dark: "#494C35",
				},
				grey: {
					10: "#F5F5F5",
				},
				dark: {
					900: "#25293A",
					800: "#292D3E",
					700: "#31364A",
					600: "#3B4158",
				},
				gold: "#ECB22E",
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
