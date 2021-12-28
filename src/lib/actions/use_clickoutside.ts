export const clickoutside = (node: HTMLElement, cb: () => void): SvelteActionReturnType => {
	function handleClick(event: MouseEvent) {
		if (node && !node.contains(event.target as HTMLElement) && !event.defaultPrevented) {
			cb();
		}
	}

	document.addEventListener("click", handleClick, true);

	return {
		destroy() {
			document.removeEventListener("click", handleClick, true);
		},
	};
};
