import { theme } from "$lib/stores/a11y";

const darkmode = (node: HTMLElement): SvelteActionReturnType => {
	const unsubscribe = theme.subscribe((x) => {
		node.classList.remove("light");
		node.classList.remove("dark");
		node.classList.add(x);
	});

	return {
		destroy: () => {
			unsubscribe();
		},
	};
};

export default darkmode;
