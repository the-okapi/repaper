<script lang="ts">
	import { Select as EnhancedSelect } from '$lib/components';
	import { setTheme, theme } from 'mode-watcher';
	import { Label } from 'bits-ui';
	import { onMount } from 'svelte';
	import lang, { languageState as lS, setLanguage } from '$lib/lang.svelte';

	let currentTheme = $state('');
	let currentFont = $state('');

	onMount(() => {
		const themeCurrent = theme.current;
		const split = themeCurrent?.split('-') ?? ['default', 'georgia'];
		currentTheme = split[0];
		currentFont = split[1];
	});

	// Light/Dark

	let themes = [
		{ value: 'default', label: 'Light', mode: 'light' },
		{ value: 'og', label: 'Dark', mode: 'dark' },
	];

	function onThemeChange(value: string) {
		currentTheme = value;
		setTheme(`${currentTheme}-${currentFont}`);
	}

	// Fonts

	let fonts = [
		{ value: 'georgia', label: 'Georgia' },
		{ value: 'arial', label: 'Arial' },
		{ value: 'tahoma', label: 'Tahoma' },
		{ value: 'times', label: 'Times New Roman' },
		{ value: 'trebuchet', label: 'Trebuchet MS' },
		{ value: 'system', label: 'System' }
	];

	function onFontChange(value: string) {
		currentFont = value;
		setTheme(`${currentTheme}-${currentFont}`);
	}

	// Language

	let languages = [
		{ value: 'en', label: 'English' },
		{ value: 'fr', label: 'Français' }
	];

	function onLangChange(value: string) {
		localStorage.setItem('repaper-lang', value);
		setLanguage(value);
	}
</script>

<svelte:head>
	<title>{lang(lS, 'Settings - Repaper', 'Paramètres - Repaper')}</title>
</svelte:head>

<div class="text-left">
	<h1 class="h1">{lang(lS, 'Settings', 'Paramètres')}</h1>
	<div class="m-auto mb-5 w-fit">
		<Label.Root for="theme">{lang(lS, 'Theme', 'Thème')}:</Label.Root>
		<EnhancedSelect bind:value={currentTheme} options={themes} onValueChange={onThemeChange} />
	</div>
	<div class="m-auto w-fit mb-5">
		<Label.Root for="font">{lang(lS, 'Font', 'Police')}:</Label.Root>
		<EnhancedSelect bind:value={currentFont} options={fonts} onValueChange={onFontChange} />
	</div>
	<div class="m-auto w-fit">
		<Label.Root for="lang">{lang(lS, 'Language', 'Langue')}:</Label.Root>
		<EnhancedSelect bind:value={lS.lang} options={languages} onValueChange={onLangChange} />
	</div>
</div>
