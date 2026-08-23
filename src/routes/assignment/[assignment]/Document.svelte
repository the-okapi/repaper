<script lang="ts">
	import { onMount } from 'svelte';
	import { Editor } from '@tiptap/core';
	import { barHidden } from '$lib/state.svelte';
	import { Bold } from '@tiptap/extension-bold';
	import { Heading } from '@tiptap/extension-heading';
	import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
	import { Italic } from '@tiptap/extension-italic';
	import { Paragraph } from '@tiptap/extension-paragraph';
	import { Underline } from '@tiptap/extension-underline';
	import { Document } from '@tiptap/extension-document';
	import { Text } from '@tiptap/extension-text';
	import { Slider } from '$lib/components';
	import { m } from '$lib/paraglide/messages';
	import { formatDate } from '$lib/util';

	let { content, children, submitted } = $props();

	let element: any = $state();
	let editorState: { editor: Editor | null } = $state({ editor: null });

	onMount(() => {
		editorState.editor = new Editor({
			element,
			extensions: [
				Bold,
				Document,
				Heading.configure({
					levels: [1, 2]
				}),
				HorizontalRule,
				Italic,
				Paragraph,
				Text,
				Underline
			],
			content,
			editable: false
		});
	});

	let zoom = $state(95);
</script>

<div class="relative mx-auto flex w-fit items-center gap-5 pt-10">
	<p>{m.submitted()} <strong>{formatDate(submitted)}</strong></p>
	<div class="relative mx-auto">
		<p class="absolute -top-7">Zoom:</p>
		<Slider bind:value={zoom} min={10} max={200} />
	</div>
	{@render children()}
</div>

<div
	class="absolute top-{barHidden.value ? '0' : '20'} h-[calc(100vh-{barHidden.value
		? '6 rem'
		: '11rem'})] w-screen pt-4 text-center"
>
	<div class="tiptap-container">
		<div spellcheck="false" bind:this={element} style="zoom: {zoom / 100};"></div>
	</div>
</div>
