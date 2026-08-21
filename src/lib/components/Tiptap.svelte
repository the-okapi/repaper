<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor, Extension } from '@tiptap/core';
	import { Bold } from '@tiptap/extension-bold';
	import { Document } from '@tiptap/extension-document';
	import { Heading } from '@tiptap/extension-heading';
	import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
	import { Italic } from '@tiptap/extension-italic';
	import { Paragraph } from '@tiptap/extension-paragraph';
	import { Text } from '@tiptap/extension-text';
	import { Underline } from '@tiptap/extension-underline';
	import { UndoRedo } from '@tiptap/extensions';
	import { Slider, Toggle, Loader } from '$lib/components';
	import { m } from '$lib/paraglide/messages';
	import { Button } from 'bits-ui';
	import BoldIcon from '$lib/assets/icons/Bold.svelte';
	import ItalicIcon from '$lib/assets/icons/Italic.svelte';
	import UnderlineIcon from '$lib/assets/icons/Underline.svelte';

	let element: any = $state();
	let editorState: { editor: Editor | null } = $state({ editor: null });

	let { content, buttons } = $props();

	export const Keybindings = Extension.create({
		addKeyboardShortcuts() {
			return {
				F1: () => this.editor.commands.setHeading({ level: 1 }),
				F2: () => this.editor.commands.setHeading({ level: 2 }),
				F3: () => this.editor.commands.setParagraph(),
				Tab: () => this.editor.commands.insertContent('\t')
			};
		}
	});

	onMount(() => {
		editorState.editor = new Editor({
			element,
			extensions: [
				Bold,
				Document,
				Heading,
				HorizontalRule,
				Italic,
				Paragraph,
				Text,
				Underline,
				UndoRedo,
				Keybindings
			],
			editorProps: {
				handlePaste: () => true,
				handleDrop: () => true
			},
			content,
			onTransaction: ({ editor }) => {
				editorState = { editor };
			}
		});
	});

	onDestroy(() => {
		editorState.editor?.destroy();
	});

	let zoom = $state(95);
</script>

<div class="relative">
	<div class="text-center">
		<div class="tiptap-container">
			<div
				spellcheck="false"
				bind:this={element}
				style="zoom: {zoom / 100}; transform-origin: top center;"
			></div>
		</div>
	</div>
	<div class="h-24"></div>
</div>

<div
	class="fixed bottom-0 left-0 flex h-24 w-screen items-center justify-center gap-2 border-t border-(--o) bg-(--bg) py-5"
>
	{#if editorState.editor}
		<div>
			<a href="/home"><Button.Root>← {m.back()}</Button.Root></a>
		</div>
		<div class="mx-4 h-10 border-l border-(--o)"></div>
		<div class="relative">
			<p class="absolute -top-7">Zoom:</p>
			<Slider bind:value={zoom} min={10} max={200} />
		</div>
		<div class="mx-4 h-10 border-l border-(--o)"></div>
		<Toggle
			onclick={() => editorState.editor?.chain().focus().toggleBold().run()}
			active={editorState.editor.isActive('bold')}
			class="toggle-icon"><BoldIcon class="size-4.5" /></Toggle
		>
		<Toggle
			onclick={() => editorState.editor?.chain().focus().toggleItalic().run()}
			active={editorState.editor.isActive('italic')}
			class="toggle-icon"><ItalicIcon class="size-4.5" /></Toggle
		>
		<Toggle
			onclick={() => editorState.editor?.chain().focus().toggleUnderline().run()}
			active={editorState.editor.isActive('underline')}
			class="toggle-icon"><UnderlineIcon class="size-4.5" /></Toggle
		>
		<div class="w-4"></div>
		<Toggle
			onclick={() => editorState.editor?.chain().focus().setParagraph().run()}
			active={editorState.editor.isActive('paragraph')}>{m.body()}</Toggle
		>
		<Toggle
			onclick={() => editorState.editor?.chain().focus().setHeading({ level: 2 }).run()}
			active={editorState.editor.isActive('heading', { level: 2 })}>{m.subheading()}</Toggle
		>
		<Toggle
			onclick={() => editorState.editor?.chain().focus().setHeading({ level: 1 }).run()}
			active={editorState.editor.isActive('heading', { level: 1 })}>{m.heading()}</Toggle
		>
		<div class="mx-4 h-10 border-l border-(--o)"></div>
		{@render buttons()}
	{:else}
		<Loader />
	{/if}
</div>
