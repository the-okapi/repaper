<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import Document from '@tiptap/extension-document';
	import Text from '@tiptap/extension-text';
	import Paragraph from '@tiptap/extension-paragraph';
	import { TextStyle, FontSize } from '@tiptap/extension-text-style';
	import Italic from '@tiptap/extension-italic';
	import Bold from '@tiptap/extension-bold';
	import Underline from '@tiptap/extension-underline';
	import TextAlign from '@tiptap/extension-text-align';
	import { UndoRedo } from '@tiptap/extensions';
	import { Loading, Toggle } from '$lib/components';
	import { Button } from 'bits-ui';
	import { changed } from '$lib';
	import TextAlignLeft from '@lucide/svelte/icons/text-align-start';
	import TextAlignCenter from '@lucide/svelte/icons/text-align-center';
	import TextAlignRight from '@lucide/svelte/icons/text-align-end';
	import lang, { languageState as lS } from '$lib/lang.svelte';

	let element: any = $state();
	let editorState: any = $state({ editor: null });

	let loading = $state(true);

	let { initial, promise, save = () => {}, editor = true, scale, ...props } = $props();

	export async function saveFunc(after = false) {
		loading = true;
		const status = await save(JSON.stringify(editorState.editor.getJSON()));
		loading = after;
		if (status === 200) {
			localStorage.removeItem('repaper-document-unsaved');
			changed.set(false);
		} else {
			alert(
				lang(
					lS,
					'Failed to save document. Please try again later.',
					"Échoué à enregistrer le document. Essayez plus tard s'il vous plaît."
				)
			);
		}
	}

	onMount(async () => {
		await promise;
		editorState.editor = new Editor({
			element,
			extensions: [
				Document,
				Text,
				Paragraph,
				TextStyle,
				TextAlign.configure({
					types: ['paragraph'],
					alignments: ['left', 'center', 'right'],
					defaultAlignment: 'left'
				}),
				FontSize,
				Italic,
				Bold,
				Underline,
				UndoRedo
			],
			editorProps: {
				handlePaste: () => true,
				handleDrop: () => true
			},
			content: JSON.parse(initial),
			onTransaction: ({ editor }) => {
				editorState = { editor };
			},
			onUpdate: () => {
				changed.set(true);
			},
			onSelectionUpdate: ({ editor }) => {
				fontSize = (editor.getAttributes('textStyle').fontSize ?? '29px').split('p')[0];
			},
			autofocus: editor,
			editable: editor
		});
		fontSize = (editorState.editor.getAttributes('textStyle').fontSize ?? '29px').split('p')[0];
		editorState.editor.chain().focus().setFontSize(`${fontSize}px`).run();
		loading = false;
	});

	onDestroy(() => {
		editorState.editor?.destroy();
	});

	function onbeforeunload(event: Event) {
		if ($changed) {
			event.preventDefault();
		}
	}

	let fontSize = $state(29);

	function fontSizeChange() {
		if (fontSize > 99) {
			fontSize = 99;
		} else if (fontSize < 1) {
			fontSize = 1;
		}
		editorState.editor.chain().focus().setFontSize(`${fontSize}px`).run();
	}
</script>

<svelte:window {onbeforeunload} />

<Loading show={loading} />

<div class="app relative" {...props}>
	{#if editorState.editor && editor}
		<div class="m-auto mb-5 flex w-fit gap-3">
			<div class="relative inline-block">
				<input
					type="number"
					class="h-full w-22 rounded-xl!"
					min="1"
					max="99"
					bind:value={fontSize}
					onchange={fontSizeChange}
				/>
				<span
					class="absolute pointer-events-none top-[50%] right-10 translate-y-[-50%] text-(--fg)/50"
					>px</span
				>
			</div>
			<Toggle
				onclick={() => editorState.editor.chain().focus().toggleBold().run()}
				active={editorState.editor.isActive('bold')}>{lang(lS, 'Bold', 'Gras')}</Toggle
			>
			<Toggle
				onclick={() => editorState.editor.chain().focus().toggleItalic().run()}
				active={editorState.editor.isActive('italic')}>{lang(lS, 'Italic', 'Italique')}</Toggle
			>
			<Toggle
				onclick={() => editorState.editor.chain().focus().toggleUnderline().run()}
				active={editorState.editor.isActive('underline')}
				>{lang(lS, 'Underline', 'Soulignement')}</Toggle
			>
			<div class="flex gap-1 rounded-xl border border-(--o) p-1.5">
				<Toggle
					onclick={() => editorState.editor.chain().focus().setTextAlign('left').run()}
					active={editorState.editor.isActive({ textAlign: 'left' })}
					icon={true}
				>
					<TextAlignLeft size={20} /></Toggle
				>
				<Toggle
					onclick={() => editorState.editor.chain().focus().setTextAlign('center').run()}
					active={editorState.editor.isActive({ textAlign: 'center' })}
					icon={true}
				>
					<TextAlignCenter size={20} /></Toggle
				>
				<Toggle
					onclick={() => editorState.editor.chain().focus().setTextAlign('right').run()}
					active={editorState.editor.isActive({ textAlign: 'right' })}
					icon={true}
				>
					<TextAlignRight size={20} /></Toggle
				>
			</div>
			<Button.Root class="ml-10" onclick={() => saveFunc(false)}
				>{lang(lS, 'Save', 'Enregistrer')}</Button.Root
			>
		</div>
	{/if}

	<div bind:this={element} style={scale} spellcheck="false"></div>
</div>
