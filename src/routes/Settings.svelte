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
			label: '<span class="font-[Fira_Sans]">Fira Sans</span>',
			value: 'fira'
		},
		{
			label: '<span class="font-[Georgia]">Georgia</span>',
			value: 'georgia'
		},
		{
			label: '<span class="font-[Tahoma]">Tahoma</span>',
			value: 'tahoma'
		},
		{
			label: '<span class="font-[Trebuchet_MS]">Trebuchet MS</span>',
			value: 'trebuchet'
		},
		{
			label: '<span class="font-system">System UI</span>',
			value: 'system'
		}
	];

	let currentFont: any = $state(theme.current);

	function onFontChange() {
		setTheme(currentFont);
	}

	let { class: c, ...props } = $props();
</script>

<div transition:slide class="rounded-xl bg-(--bg) p-6 outline outline-(--o) {c}" {...props}>
	<div class="m-auto mb-8 w-fit">
		<Label.Root>Mode:</Label.Root>
		<Select options={modes} bind:value={currentMode} onChange={onModeChange} />
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
