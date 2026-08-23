<script lang="ts">
	import { Select } from '$lib/components';
	import { mode, setMode, setTheme, theme } from 'mode-watcher';
	import { Label } from 'bits-ui';
	import { slide } from 'svelte/transition';
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { setLocale } from '$lib/paraglide/runtime';

	// Light/Dark
	let modes = $derived([
		{
			label: m.light(),
			value: 'light'
		},
		{
			label: m.dark(),
			value: 'dark'
		}
	]);

	let currentMode: any = $state(mode.current);

	function onModeChange() {
		setMode(currentMode);
	}

	// Language
	let languages = [
		{
			label: 'English',
			value: 'en'
		},
		{
			label: 'Français',
			value: 'fr'
		}
	];

	let currentLang = $state(getLocale());

	function onLangChange() {
		setLocale(currentLang);
	}

	// Colors
	let colors = [
		{
			label: '<div data-theme="red" class="swatch"></div>',
			value: 'red'
		},
		{
			label: '<div data-theme="orange" class="swatch"></div>',
			value: 'orange'
		},
		{
			label: '<div data-theme="yellow" class="swatch"></div>',
			value: 'yellow'
		},
		{
			label: '<div data-theme="green" class="swatch"></div>',
			value: 'green'
		},
		{
			label: '<div class="swatch turquoise"></div>',
			value: 'turquoise'
		},
		{
			label: '<div data-theme="blue" class="swatch"></div>',
			value: 'blue'
		},
		{
			label: '<div data-theme="purple" class="swatch"></div>',
			value: 'purple'
		}
	];

	let currentColor: any = $state(theme.current);

	function onColorChange() {
		setTheme(currentColor);
	}

	let { class: c, ...props } = $props();
</script>

<div transition:slide class="rounded-xl bg-(--bg) p-6 outline outline-(--o) {c}" {...props}>
	<div class="m-auto mb-8 w-fit">
		<Label.Root>Mode:</Label.Root>
		<Select options={modes} bind:value={currentMode} onChange={onModeChange} />
	</div>

	<div class="m-auto mb-8 w-fit">
		<Label.Root>{m.color()}:</Label.Root>
		<Select options={colors} bind:value={currentColor} onChange={onColorChange} />
	</div>

	<div class="m-auto w-fit">
		<Label.Root>{m.language()}:</Label.Root>
		<Select options={languages} bind:value={currentLang} onChange={onLangChange} />
	</div>
</div>
