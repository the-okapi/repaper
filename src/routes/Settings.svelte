<script lang="ts">
	import Select from '$lib/components/Select.svelte';
	import { mode, setMode, setTheme, theme } from 'mode-watcher';
	import { Label, Popover } from 'bits-ui';
	import { fade } from 'svelte/transition';
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

	function onModeChange(v: 'dark' | 'light' | 'system') {
		setMode(v);
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

	function onLangChange(v: 'en' | 'fr') {
		setLocale(v);
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

	function onColorChange(v: string) {
		setTheme(v);
	}
</script>

<Popover.Root>
	<Popover.Trigger class="nav-bar-link">{m.settings()}</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content sideOffset={10} forceMount>
			{#snippet child({ wrapperProps, props, open })}
				{#if open}
					<div {...wrapperProps}>
						<div {...props} transition:fade={{ duration: 100 }}>
							<div class="p-3">
								<div class="m-auto mb-8 w-fit">
									<Label.Root
										>{m.mode()}:
										<Select
											options={modes}
											value={mode.current}
											onChange={onModeChange}
										/></Label.Root
									>
								</div>

								<div class="m-auto mb-8 w-fit">
									<Label.Root
										>{m.color()}:
										<Select
											options={colors}
											value={theme.current}
											onChange={onColorChange}
										/></Label.Root
									>
								</div>

								<div class="m-auto w-fit">
									<Label.Root
										>{m.language()}:
										<Select
											options={languages}
											value={getLocale()}
											onChange={onLangChange}
										/></Label.Root
									>
								</div>
							</div>
						</div>
					</div>
				{/if}
			{/snippet}
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
