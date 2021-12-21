const konamicode = (node: HTMLElement, callback: () => void): SvelteActionReturnType => {
	const sequence = [
		"ArrowUp",
		"ArrowUp",
		"ArrowDown",
		"ArrowDown",
		"ArrowLeft",
		"ArrowRight",
		"ArrowLeft",
		"ArrowRight",
		"b",
		"a",
	];

	let pos = 0;

	function handleKeyDown(e: KeyboardEvent) {
		const requiredKey = sequence[pos];

		if (e.key === requiredKey) {
			pos++;

			if (pos === sequence.length) {
				callback();
				pos = 0;
			}
		} else {
			pos = 0;
		}
	}

	// add keydown event listener
	document.addEventListener("keydown", handleKeyDown);

	return {
		update: (newCallback: () => void) => {
			callback = newCallback;
		},
		destroy: () => {
			document.removeEventListener("keydown", handleKeyDown);
		},
	};
};

export default konamicode;
