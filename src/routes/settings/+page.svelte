<script lang="ts">
	import { SelectC, SelectItem, Select as EnhancedSelect } from '$lib/components';
	import { setTheme, theme } from 'mode-watcher';
	import { Label, Select } from 'bits-ui';
	import { onMount } from 'svelte';
	import lang, { languageState, setLanguage } from '$lib/lang.svelte';
	import type { SelectItemType } from '$lib';

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
		{ value: 'default', label: 'Default', mode: 'light' },
		{ value: 'coral', label: 'Coral', mode: 'light' },
		{ value: 'graphite', label: 'Graphite', mode: 'light' },
		{ value: 'wumpus', label: 'Wumpus', mode: 'dark' },
		{ value: 'og', label: 'OG', mode: 'dark' },
		{ value: 'nord', label: 'Nord', mode: 'dark' },
		{ value: 'solarized', label: 'Solarized', mode: 'dark' }
	];

	const selectedModeLabel = $derived(
		themes.find((themeV: SelectItemType) => themeV.value === currentTheme)
	);

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

<div>
	<h1 class="h1">{lang(languageState, 'Settings', 'Paramètres')}</h1>
	<div class="m-auto mb-5 w-fit">
		<Label.Root for="theme">{lang(languageState, 'Theme', 'Thème')}:</Label.Root>
		<SelectC
			bind:value={currentTheme}
			id="theme"
			onValueChange={onThemeChange}
			trigger={selectedModeLabel?.label}
		>
			<Select.Group>
				<Select.GroupHeading class="group-heading"
					>{lang(languageState, 'Light Themes', 'Thèmes Clairs')}</Select.GroupHeading
				>
				{#each themes as theme, i (i + theme.value)}
					{#if theme.mode === 'light'}
						<SelectItem value={theme} />
					{/if}
				{/each}
			</Select.Group>
			<Select.Group>
				<Select.GroupHeading class="group-heading"
					>{lang(languageState, 'Dark Themes', 'Thèmes Sombres')}</Select.GroupHeading
				>
				{#each themes as theme, i (i + theme.value)}
					{#if theme.mode === 'dark'}
						<SelectItem value={theme} />
					{/if}
				{/each}
			</Select.Group>
		</SelectC>
	</div>
	<div class="m-auto w-fit mb-5">
		<Label.Root for="font">{lang(languageState, 'Font', 'Police')}:</Label.Root>
		<EnhancedSelect bind:value={currentFont} options={fonts} onValueChange={onFontChange} />
	</div>
	<div class="m-auto w-fit">
		<Label.Root for="lang">{lang(languageState, 'Language', 'Langue')}:</Label.Root>
		<EnhancedSelect
			bind:value={languageState.lang}
			options={languages}
			onValueChange={onLangChange}
		/>
	</div>
</div>
