<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import { Loading, Toggle, Popover } from '$lib/components';
	import {
		Document,
		Text,
		Paragraph,
		TextStyle,
		FontSize,
		Italic,
		Bold,
		Underline,
		TextAlign,
		UndoRedo,
		Tab
	} from '$lib/extensions';
	import { Button } from 'bits-ui';
	import { changed } from '$lib';
	import TextAlignLeft from '$lib/components/ui/icons/AlignLeft.svelte';
	import TextAlignCenter from '$lib/components/ui/icons/AlignCenter.svelte';
	import TextAlignRight from '$lib/components/ui/icons/AlignRight.svelte';
	import lang, { languageState as lS } from '$lib/lang.svelte';
	import { downloadDocument } from '$lib/pdf';

	let element: any = $state();
	let editorState: { editor: Editor | null } = $state({ editor: null });

	let loading = $state(true);

	let { initial, promise, save = () => {}, editor = true, scale, ...props } = $props();

	let fontSize = $state(29);

	export async function saveFunc(after = false) {
		loading = true;
		const status = await save(JSON.stringify(editorState.editor?.getJSON()));
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

	export const CustomFontSize = FontSize.extend({
		addKeyboardShortcuts() {
			return {
				F2: () => {
					if (fontSize + 1 < 100) {
						fontSize += 1;
					}
					this.editor.commands.setFontSize(`${fontSize}pt`);
				},
				F1: () => {
					if (fontSize - 1 > 0) {
						fontSize -= 1;
					}
					this.editor.commands.setFontSize(`${fontSize}pt`);
				}
			};
		}
	});

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
				CustomFontSize,
				Italic,
				Bold,
				Underline,
				UndoRedo,
				Tab
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
				fontSize = Number((editor.getAttributes('textStyle').fontSize ?? '20pt').split('p')[0]);
			},
			autofocus: editor,
			editable: editor
		});
		fontSize = Number(
			(editorState.editor.getAttributes('textStyle').fontSize ?? '20pt').split('p')[0]
		);
		editorState.editor.chain().focus().setFontSize(`${fontSize}pt`).run();
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

	function fontSizeChange() {
		if (fontSize > 99) {
			fontSize = 99;
		} else if (fontSize < 1) {
			fontSize = 1;
		}
		editorState.editor?.chain().focus().setFontSize(`${fontSize}pt`).run();
	}

	let wordCount = $derived(
		editorState.editor
			?.getText()
			.split(' ')
			.filter((word) => word !== '').length
	);

	async function download() {
		loading = true;
		const bytes = await downloadDocument(editorState.editor?.getHTML() || '');
		const blob = new Blob([bytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'Document.pdf';
		a.click();
		URL.revokeObjectURL(url);
		loading = false
	}
</script>

<svelte:window {onbeforeunload} />

<Loading show={loading} />

<div class="app relative" {...props}>
	{#if editorState.editor && editor}
		<div class="mb-5 border-b border-(--o) py-5 bg-(--bg) sticky top-0 z-40">
			<div class="m-auto flex w-fit gap-3">
				<Button.Root onclick={download}>Download PDF</Button.Root>
				<Popover
					questionMark={false}
					bClass="mr-10"
					message={lang(lS, 'Document Info', 'Info sur le Document')}
					>{lang(lS, 'Word Count', 'Nombre de Mots')}: <strong>{wordCount}</strong>
					{lang(lS, 'Words', 'Mots')}</Popover
				>
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
						>pt</span
					>
				</div>
				<Toggle
					onclick={() => editorState.editor?.chain().focus().toggleBold().run()}
					active={editorState.editor.isActive('bold')}>{lang(lS, 'Bold', 'Gras')}</Toggle
				>
				<Toggle
					onclick={() => editorState.editor?.chain().focus().toggleItalic().run()}
					active={editorState.editor.isActive('italic')}>{lang(lS, 'Italic', 'Italique')}</Toggle
				>
				<Toggle
					onclick={() => editorState.editor?.chain().focus().toggleUnderline().run()}
					active={editorState.editor.isActive('underline')}
					>{lang(lS, 'Underline', 'Soulignement')}</Toggle
				>
				<div class="flex gap-1 rounded-xl border border-(--o) p-1.5">
					<Toggle
						onclick={() => editorState.editor?.chain().focus().setTextAlign('left').run()}
						active={editorState.editor.isActive({ textAlign: 'left' })}
						icon={true}
					>
						<TextAlignLeft /></Toggle
					>
					<Toggle
						onclick={() => editorState.editor?.chain().focus().setTextAlign('center').run()}
						active={editorState.editor.isActive({ textAlign: 'center' })}
						icon={true}
					>
						<TextAlignCenter /></Toggle
					>
					<Toggle
						onclick={() => editorState.editor?.chain().focus().setTextAlign('right').run()}
						active={editorState.editor.isActive({ textAlign: 'right' })}
						icon={true}
					>
						<TextAlignRight /></Toggle
					>
				</div>
				<Button.Root class="ml-10" onclick={() => saveFunc(false)}
					>{lang(lS, 'Save', 'Enregistrer')}</Button.Root
				>
			</div>
		</div>
	{/if}

	<div bind:this={element} style={scale} spellcheck="false"></div>
</div>
