<script lang="ts">
	import { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import { extensions, viewerExtensions } from '$lib/tiptap';

	let element: any = $state();
	let editorState: { editor: Editor | null } = $state({ editor: null });

	let { data } = $props();

	onMount(async () => {
		editorState.editor = new Editor({
			element,
			extensions: [...extensions, ...viewerExtensions],
			content: data.content,
			editable: false
		});
	});
</script>

<div class="absolute top-25 right-0 flex w-[calc(100vw-26.25rem)] items-center justify-center pb-5">
	<div class="tiptap-container">
		<div spellcheck="false" bind:this={element} style="zoom: 0.75;"></div>
	</div>
</div>
