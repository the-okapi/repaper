<script lang="ts">
	import { page } from '$app/state';
	import { Loading, TextEditor } from '$lib/components';
	import { Button } from 'bits-ui';
	import lang, { languageState as lS } from '$lib/lang.svelte';

	let {
		document,
		scale,
		save,
		settings,
		show,
		fullscreen,
		changesMadeSinceSave = $bindable()
	} = $props();

	let loading = $state(false);

	let editor: any = $state();

	function onbeforeunload(event: Event) {
		if (changesMadeSinceSave) {
			event.preventDefault();
		}
	}

	export async function saveFunction() {
		await editor.saveFunc(true);
	}

	async function enableFullscreen() {
		await saveFunction();
		window.location.assign(page.url.toString() + '&fullscreen');
	}

	async function disableFullscreen() {
		await saveFunction();
		window.location.assign(page.url.toString().split('&')[0]);
	}
</script>

<Loading show={loading} />

<svelte:window {onbeforeunload} />

<svelte:head>
	<title>{document.title} - Repaper</title>
</svelte:head>

<div
	class="h-screen"
	style={!fullscreen ? 'width: calc(100vw - 5rem)' : 'width: 100vw'}
	hidden={!show}
>
	<div class="m-auto mt-8 flex w-fit">
		<h2 class="m-auto text-center font-bold text-lg text-(--fg)/60">
			{lang(lS, 'Edit Mode', "Mode d'Éditeur")}
		</h2>
		<Button.Root onclick={settings} class="m-auto ml-5 h-fit"
			>{lang(lS, 'Document Settings', 'Paramètres du Document')}</Button.Root
		>
		{#if !fullscreen}
			<Button.Root onclick={enableFullscreen} class="m-auto ml-5 h-fit"
				>{lang(lS, 'Fullscreen', 'Plein Écran')}</Button.Root
			>
		{:else}
			<Button.Root onclick={disableFullscreen} class="m-auto ml-5 h-fit"
				>{lang(lS, 'Exit Fullscreen', 'Sortir de Plein Écran')}</Button.Root
			>
		{/if}
	</div>
	<h1 class="h1">{document.title}</h1>
	<TextEditor
		promise={document.promise}
		{save}
		initial={document.content}
		{fullscreen}
		scale="transform: scale({scale / 100}); transform-origin: top center;"
		bind:this={editor}
	/>
	<div class="h-[2vw]"></div>
</div>
