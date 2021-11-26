<script lang="ts">
	import type { IStat } from "$lib/types/stats";
	import { draw, fade } from "svelte/transition";

	export let height = 100;
	export let width = 300;
	export let horizontalPadding = 0;
	export let verticalPadding = 0;

	export let stats: IStat[];
	const color = "#3F9CB4";

	export let selected: number = null;

	$: max = stats.reduce((a, c) => (c.Value > a ? c.Value : a), 0);
	$: min = stats.reduce((a, c) => (c.Value < a ? c.Value : a), 0);
	$: interval = width / (stats.length - 1);

	$: points = stats.map((e, i) => ({
		x: interval * i,
		y:
			height -
			(((e.Value - min) * 100) / (max - min)) * ((height - verticalPadding * 2) / 100) -
			verticalPadding,
	}));

	$: curvePoints = points
		.map(({ x, y }, i) => {
			if (i === 0) return `${Math.round(x)} ${Math.round(y)}`;
			const prevPoint = points[i - 1];
			return `C${Math.round(prevPoint.x + interval / 3)} ${Math.round(prevPoint.y)} ${Math.round(
				x - interval / 3
			)} ${Math.round(y)} ${Math.round(x)} ${Math.round(y)}`;
		})
		.join(" ");

	const handleMouseMove = (
		e: MouseEvent & {
			currentTarget: EventTarget & SVGSVGElement;
		}
	) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		let closest = points.reduce((a, c) => (Math.abs(c.x - x) < Math.abs(a.x - x) ? c : a));

		selected = points.indexOf(closest);
	};
</script>

<svg
	on:mousemove={handleMouseMove}
	on:mouseleave={() => (selected = null)}
	{...$$props}
	viewBox="0 0 {width} {height}"
>
	<path
		in:draw={{ duration: 1000, delay: 500 }}
		fill="none"
		stroke={color}
		stroke-width="2"
		d="M {curvePoints}"
	/>
	<path
		in:fade={{ duration: 1000, delay: 1500 }}
		fill="url(#graph-gradient)"
		d="M {curvePoints} L{width} {height} L0 {height} Z"
	/>

	{#if selected !== null}
		<circle r="12" fill={color} cx={points[selected].x} cy={points[selected].y} class="pulse" />
		<circle r="6" fill={color} cx={points[selected].x} cy={points[selected].y} />
	{/if}

	<defs>
		<linearGradient
			id="graph-gradient"
			x1="0"
			y1="0"
			x2="-4.12994e-06"
			y2={height}
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color={color} stop-opacity="0.4" />
			<stop stop-color={color} stop-opacity="0" offset="1" />
		</linearGradient>
	</defs>
</svg>

<style>
	@keyframes pulse {
		0%,
		100% {
			opacity: 0%;
		}
		50% {
			opacity: 20%;
		}
	}
	.pulse {
		animation: pulse 1s infinite ease-in-out;
	}
</style>
