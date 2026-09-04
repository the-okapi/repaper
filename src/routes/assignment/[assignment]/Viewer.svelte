<script lang="ts">
	import Slider from '$lib/components/Slider.svelte';
	import { m } from '$lib/paraglide/messages';
	import { formatDate } from '$lib/util';
	import { barHidden } from '$lib/state.svelte';
	import { onMount } from 'svelte';
	import { Editor } from '@tiptap/core';
	import { extensions, viewerExtensions } from '$lib/tiptap';

	let { content, children, submitted } = $props();

	let zoom = $state(95);

	let element: any = $state();
	let editorState: { editor: Editor | null } = $state({ editor: null });

	onMount(() => {
		editorState.editor = new Editor({
			element,
			extensions: [...extensions, ...viewerExtensions],
			content,
			editable: false
		});
	});
</script>

<div class="relative z-50 mx-auto flex w-fit items-center gap-5 pt-10">
	<p>{m.submitted()} <strong>{formatDate(submitted)}</strong></p>
	<div class="relative mx-auto">
		<p class="absolute -top-7">Zoom:</p>
		<Slider bind:value={zoom} min={10} max={200} />
	</div>
	{@render children()}
</div>

<div
	class="absolute top-{barHidden.value ? '20' : '40'} h-[calc(100vh-{barHidden.value
		? '6 rem'
		: '11rem'})] w-screen pt-4 text-center"
>
	<div class="tiptap-container">
		<div spellcheck="false" bind:this={element} style="zoom: {zoom / 100};"></div>
	</div>
</div>
