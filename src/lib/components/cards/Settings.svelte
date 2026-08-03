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

	// Font
	let fonts = [
		{
			label: 'Georgia',
			value: 'georgia'
		},
		{
			label: 'Tahoma',
			value: 'tahoma'
		},
		{
			label: 'Arial',
			value: 'arial'
		},
		{
			label: 'Trebuchet MS',
			value: 'trebuchet'
		},
		{
			label: 'Monospace',
			value: 'monospace'
		},
		{
			label: 'System UI',
			value: 'system'
		},
		{
			label: 'Fira Sans',
			value: 'fira'
		}
	];

	let currentFont: any = $state(theme.current);

	function onFontChange() {
		setTheme(currentFont);
	}

	let { class: c, ...props } = $props();
</script>

<div in:slide out:slide class="rounded-xl bg-(--bg) p-6 outline outline-(--o) {c}" {...props}>
	<div class="m-auto mb-8 w-fit">
		<Label.Root>Mode:</Label.Root>
		<Select options={modes} styling={false} bind:value={currentMode} onChange={onModeChange} />
	</div>

	<div class="m-auto mb-8 w-fit">
		<Label.Root>{m.font()}:</Label.Root>
		<Select options={fonts} bind:value={currentFont} onChange={onFontChange} />
	</div>

	<div class="m-auto w-fit">
		<Label.Root>{m.language()}:</Label.Root>
		<Select options={languages} bind:value={currentLang} onChange={onLangChange} />
	</div>
</div>
