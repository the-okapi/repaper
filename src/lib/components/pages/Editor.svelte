<script lang="ts">
	import { page } from '$app/state';
	import { Loading, TextEditor } from '$lib/components';
	import { Button } from 'bits-ui';

	let { document, scale, save, settings, show, fullscreen } = $props();

	let loading = $state(false);

	let changesMadeSinceSave = $state(false);

	let editor: any = $state();

	function onbeforeunload(event: Event) {
		if (changesMadeSinceSave) {
			event.preventDefault();
		}
	}

	async function enableFullscreen() {
		if (changesMadeSinceSave) {
			await editor.saveFunc();
		}
		window.location.assign(page.url.toString() + '&fullscreen');
	}

	async function disableFullscreen() {
		if (changesMadeSinceSave) {
			await editor.saveFunc();
		}
		window.location.assign(page.url.toString().split('&')[0]);
	}
</script>

<Loading show={loading} />

<svelte:window {onbeforeunload} />

<div class="h-screen" style="width: calc(100vw - 17.5rem)" hidden={!show}>
	<div class="m-auto mt-8 flex w-fit">
		<h2 class="m-auto text-center text-lg text-(--fg)/60">Edit Mode</h2>
		<Button.Root onclick={settings} class="m-auto ml-5 h-fit">Document Settings</Button.Root>
		{#if !fullscreen}
			<Button.Root onclick={enableFullscreen} class="m-auto ml-5 h-fit">Fullscreen</Button.Root>
		{:else}
			<Button.Root onclick={disableFullscreen} class="m-auto ml-5 h-fit"
				>Exit Fullscreen</Button.Root
			>
		{/if}
	</div>
	<h1 class="h1">{document.title}</h1>
	<TextEditor
		promise={document.promise}
		{save}
		initial={document.content}
		scale="transform: scale({scale / 100}); margin-top: -{(100 - scale) / 2.25}%"
		bind:this={editor}
	/>
	<div class="h-[2vw]"></div>
</div>
