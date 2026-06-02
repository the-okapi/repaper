<script lang="ts">
	import { TextEditor } from '$lib/components';
	import { Button } from 'bits-ui';
	import { page } from '$app/state';

	let { document, scale, fullscreen } = $props();

	function enableFullscreen() {
		window.location.assign(page.url.toString() + '&fullscreen');
	}

	function disableFullscreen() {
		window.location.assign(page.url.toString().split('&')[0]);
	}
</script>

<div class="h-screen" style="width: calc(100vw{fullscreen ? '' : ' - 5rem'})">
	<div class="flex m-auto mt-8 w-fit">
		<h2 class="m-auto text-center text-lg font-bold text-(--fg)/60">View Mode</h2>
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
		initial={document.content}
		editor={false}
		scale="transform: scale({scale / 100}); margin-top: -{(100 - scale) / 35}%"
	/>
	<div class="h-[2vw]"></div>
</div>
