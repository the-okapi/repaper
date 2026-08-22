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
	import { Slider, Toggle, Loader, Popover, Select } from '$lib/components';
	import { m } from '$lib/paraglide/messages';
	import { Button } from 'bits-ui';
	import BoldIcon from '$lib/assets/icons/Bold.svelte';
	import ItalicIcon from '$lib/assets/icons/Italic.svelte';
	import UnderlineIcon from '$lib/assets/icons/Underline.svelte';
	import zoomIcon from '$lib/assets/icons/zoom.svg';
	import fontSizeIcon from '$lib/assets/icons/font.svg';
	import { barHidden } from '$lib/state.svelte';

	let element: any = $state();
	let editorState: { editor: Editor | null } = $state({ editor: null });

	let { content, buttons } = $props();

	let zoom = $state(95);

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

	let textStyle = $state('p');
	let changeTextStyleOpen = $state(false);

	function updateTextStyle() {
		if (editorState.editor?.isActive('heading', { level: 1 })) {
			textStyle = 'h1';
		} else if (editorState.editor?.isActive('heading', { level: 2 })) {
			textStyle = 'h2';
		} else if (editorState.editor?.isActive('paragraph')) {
			textStyle = 'p';
		}
	}

	function changeTextStyle() {
		if (textStyle === 'h1') {
			editorState.editor?.chain().focus().setHeading({ level: 1 }).run();
		} else if (textStyle === 'h2') {
			editorState.editor?.chain().focus().setHeading({ level: 2 }).run();
		} else {
			editorState.editor?.chain().focus().setParagraph().run();
		}
		changeTextStyleOpen = false;
	}

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
			},
			onSelectionUpdate: updateTextStyle
		});
		updateTextStyle();
	});

	onDestroy(() => {
		editorState.editor?.destroy();
	});
</script>

<div
	class="absolute top-{barHidden.value ? '0' : '20'} h-[calc(100vh-{barHidden.value
		? '6 rem'
		: '11rem'})] left-24 w-[calc(100vw-6rem)] pt-4 text-center"
>
	<div class="tiptap-container">
		<div spellcheck="false" bind:this={element} style="zoom: {zoom / 100};"></div>
	</div>
</div>

<div
	class="fixed top-0 left-0 flex h-screen w-24 flex-col items-center justify-center gap-2 border-r border-(--o) bg-(--bg)"
>
	{#if editorState.editor}
		<a href="/home"
			><Button.Root class="flex size-10 items-center justify-center" title={m.back()}
				>←</Button.Root
			></a
		>
		<div class="my-3 w-10 border-b border-(--o)"></div>
		<Popover>
			{#snippet trigger()}
				<Button.Root class="flex size-10 items-center justify-center p-0!"
					><img src={zoomIcon} alt="Zoom" class="size-4.5" /></Button.Root
				>
			{/snippet}
			<div class="flex gap-4">
				<p>Zoom:</p>
				<Slider bind:value={zoom} min={10} max={200} />
			</div>
		</Popover>
		<div class="my-3 w-10 border-b border-(--o)"></div>
		<Toggle
			active={editorState.editor?.isActive('bold')}
			class="toggle-icon"
			onclick={() => editorState.editor?.chain().focus().toggleBold().run()}
			title={m.bold()}
		>
			<BoldIcon class="size-4.5" />
		</Toggle>
		<Toggle
			active={editorState.editor?.isActive('italic')}
			class="toggle-icon"
			onclick={() => editorState.editor?.chain().focus().toggleItalic().run()}
			title={m.italic()}
		>
			<ItalicIcon class="size-4.5" />
		</Toggle>
		<Toggle
			active={editorState.editor?.isActive('underline')}
			class="toggle-icon"
			onclick={() => editorState.editor?.chain().focus().toggleUnderline().run()}
			title={m.underline()}
		>
			<UnderlineIcon class="size-4.5" />
		</Toggle>
		<div class="h-3"></div>
		<Popover border={false} bind:open={changeTextStyleOpen}>
			{#snippet trigger()}
				<Button.Root class="flex size-10 items-center justify-center p-0!"
					><img src={fontSizeIcon} alt="Font Size" class="size-4.5" /></Button.Root
				>
			{/snippet}
			<Select
				options={[
					{ value: 'p', label: m.body() },
					{ value: 'h2', label: m.subheading() },
					{ value: 'h1', label: m.heading() }
				]}
				bind:value={textStyle}
				onChange={changeTextStyle}
			/>
		</Popover>
		<div class="my-3 w-10 border-b border-(--o)"></div>
		{@render buttons()}
	{:else}
		<Loader />
	{/if}
</div>
