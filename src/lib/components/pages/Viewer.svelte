<script lang="ts">
	import { TextEditor } from '$lib/components';
	import { Button } from 'bits-ui';
	import lang, { languageState as lS } from '$lib/lang.svelte';
	import fullscreen from '$lib/fullscreen.svelte';

	let { document, scale } = $props();

	function enableFullscreen() {
		fullscreen.value = true;
		scale = 100;
	}

	function disableFullscreen() {
		fullscreen.value = false;
		scale = 70;
	}
</script>

<svelte:head>
	<title>{document.title} - Repaper</title>
</svelte:head>

<div class="h-screen" style="width: calc(100vw{fullscreen.value ? '' : ' - 5rem'})">
	<div class="flex m-auto mt-8 w-fit">
		<h2 class="m-auto text-center text-lg font-bold text-(--fg)/60">
			{lang(lS, 'View Mode', 'Mode de Spectateur')}
		</h2>
		{#if !fullscreen.value}
			<Button.Root onclick={enableFullscreen} class="m-auto ml-5 h-fit"
				>{lang(lS, 'Fullscreen', 'Plein Écran')}</Button.Root
			>
		{:else}
			<Button.Root onclick={disableFullscreen} class="m-auto ml-5 h-fit"
				>{lang(lS, 'Exit Fullscreen', 'Quitter Plein Écran')}</Button.Root
			>
		{/if}
		<Button.Root onclick={() => window.location.reload()} class="m-auto ml-5 h-fit"
			>{lang(lS, 'Reload', 'Rafraîchir')}</Button.Root
		>
	</div>
	<h1 class="h1 mt-5">{document.title}</h1>
	<TextEditor
		promise={document.promise}
		initial={document.content}
		editor={false}
		fullscreen={fullscreen.value}
		scale="transform: scale({scale / 100}); transform-origin: top center;"
	/>
	<div class="h-[2vw]"></div>
</div>
