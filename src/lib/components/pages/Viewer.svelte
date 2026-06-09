<script lang="ts">
	import { TextEditor } from '$lib/components';
	import { Button } from 'bits-ui';
	import { page } from '$app/state';
	import lang, { languageState as lS } from '$lib/lang.svelte';

	let { document, scale, fullscreen } = $props();

	function enableFullscreen() {
		window.location.assign(page.url.toString() + '&fullscreen');
	}

	function disableFullscreen() {
		window.location.assign(page.url.toString().split('&')[0]);
	}
</script>

<svelte:head>
	<title>{document.title} - Repaper</title>
</svelte:head>

<div class="h-screen" style="width: calc(100vw{fullscreen ? '' : ' - 5rem'})">
	<div class="flex m-auto mt-8 w-fit">
		<h2 class="m-auto text-center text-lg font-bold text-(--fg)/60">
			{lang(lS, 'View Mode', 'Mode de Spectateur')}
		</h2>
		{#if !fullscreen}
			<Button.Root onclick={enableFullscreen} class="m-auto ml-5 h-fit"
				>{lang(lS, 'Fullscreen', 'Plein Écran')}</Button.Root
			>
		{:else}
			<Button.Root onclick={disableFullscreen} class="m-auto ml-5 h-fit"
				>{lang(lS, 'Exit Fullscreen', 'Quitter Plein Écran')}</Button.Root
			>
		{/if}
	</div>
	<h1 class="h1 mt-5">{document.title}</h1>
	<TextEditor
		promise={document.promise}
		initial={document.content}
		editor={false}
		{fullscreen}
		scale="transform: scale({scale / 100}); transform-origin: top center;"
	/>
	<div class="h-[2vw]"></div>
</div>
