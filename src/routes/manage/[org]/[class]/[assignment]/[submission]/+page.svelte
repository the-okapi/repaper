<script lang="ts">
	import { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import { extensions, viewerExtensions } from '$lib/tiptap';
	import { m } from '$lib/paraglide/messages';
	import { formatDate } from '$lib/util';

	let element: any = $state();
	let editorState: { editor: Editor | null } = $state({ editor: null });

	let { data } = $props();

	onMount(async () => {
		editorState.editor = new Editor({
			element,
			extensions: [...extensions, ...viewerExtensions],
			content: data.submission.document.content,
			editable: false
		});
	});
</script>

<div
	class="absolute top-25 right-0 flex w-[calc(100vw-27.5rem)] flex-col items-center justify-center gap-4 pb-5"
>
	<div class="flex items-center justify-center gap-6">
		<p>
			{data.submission.user.name}
			–
			{#if data.submission.submitted !== null}
				{m.submitted()} {formatDate(data.submission.submitted)}
			{:else}{m.not()} {m.submitted()}
			{/if}
		</p>
	</div>
	<div class="tiptap-container">
		<div spellcheck="false" bind:this={element} style="zoom: 0.73;"></div>
	</div>
</div>
