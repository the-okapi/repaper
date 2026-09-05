<script lang="ts">
	import Select from '$lib/components/Select.svelte';
	import { mode, setMode, setTheme, theme } from 'mode-watcher';
	import { Label } from 'bits-ui';
	import { slide } from 'svelte/transition';
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { setLocale } from '$lib/paraglide/runtime';

	// Light/Dark
	let modes = $derived([
		{
			label: m.system(),
			value: 'system'
		},
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
			label: '<div class="swatch bg-(--red)"></div> ' + m.red(),
			value: 'red'
		},
		{
			label: '<div class="swatch bg-(--yellow)"></div> ' + m.yellow(),
			value: 'yellow'
		},
		{
			label: '<div class="swatch bg-(--green)"></div> ' + m.green(),
			value: 'green'
		},
		{
			label: '<div class="swatch bg-(--turquoise)"></div> Turquoise',
			value: 'turquoise'
		},
		{
			label: '<div class="swatch bg-(--blue)"></div> ' + m.blue(),
			value: 'blue'
		},
		{
			label: '<div class="swatch bg-(--purple)"></div> ' + m.purple(),
			value: 'purple'
		}
	];

	let currentColor: any = $state(theme.current);

	function onColorChange() {
		setTheme(currentColor);
	}

	let { class: c } = $props();
</script>

<div transition:slide class="rounded-xl bg-(--bg) p-6 outline outline-(--o) {c}">
	<div class="m-auto mb-8 w-fit">
		<Label.Root>{m.mode()}:</Label.Root>
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
