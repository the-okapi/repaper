<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import Slider from '$lib/components/Slider.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Popover from '$lib/components/Popover.svelte';
	import Select from '$lib/components/Select.svelte';
	import AlertDialog from '$lib/components/AlertDialog.svelte';
	import { m } from '$lib/paraglide/messages';
	import { Button } from 'bits-ui';
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Underline from '@lucide/svelte/icons/underline';
	import Zoom from '@lucide/svelte/icons/zoom-in';
	import FontSize from '@lucide/svelte/icons/a-large-small';
	import Insert from '@lucide/svelte/icons/plus';
	import Save from '@lucide/svelte/icons/save';
	import Submit from '@lucide/svelte/icons/send';
	import Image from '@lucide/svelte/icons/image';
	import { barHidden } from '$lib/state.svelte';
	import { extensions, editorExtensions } from '$lib/tiptap';
	import { saveDocument, submitDocument, uploadFile, deleteFile } from './server.remote.ts';
	import Accents from './Accents.svelte';

	let element: any = $state();
	let editorState: { editor: Editor | null } = $state({ editor: null });

	let { content, children, assignment } = $props();

	let zoom = $state(95);

	let textStyle = $state('p');
	let changeTextStyleOpen = $state(false);

	let insertOpen = $state(false);

	let addAccentOpen = $state(false);

	function addAccent(str: string) {
		addAccentOpen = false;
		editorState.editor?.chain().insertContent(str).focus().run();
	}

	let addImageOpen = $state(false);
	let addImageLoading = $state(false);
	let imageTooBig = $state(false);

	let images: any = $state();

	function openFile() {
		if (images[0].size > 50000000) {
			imageTooBig = true;
			images = [];
		} else {
			imageTooBig = false;
		}
	}

	function cancelAddImage() {
		addImageOpen = false;
		images = [];
	}

	async function addImage() {
		if (!images) {
			return;
		}

		addImageLoading = true;

		const { status, url } = await uploadFile({
			assignment,
			file: images[0]
		});

		if (status !== 200) {
			return;
		}

		editorState.editor
			?.chain()
			.setImage({ src: url ?? '' })
			.focus()
			.run();

		images = [];
		addImageOpen = false;
		addImageLoading = false;
	}

	let confirmSubmitOpen = $state(false);

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

	let saving = $state(false);
	let failedSave = $state(false);

	async function saveButton() {
		saving = true;
		const { status } = await saveDocument({
			assignment: assignment,
			content: editorState.editor?.getHTML() ?? ''
		});
		if (status !== 200) {
			failedSave = true;
		} else {
			changesMadeSinceSave = false;
		}
		saving = false;
	}

	async function submitAssignment() {
		await saveButton();
		await submitDocument(assignment);
		window.location.reload();
	}

	onMount(() => {
		editorState.editor = new Editor({
			element,
			extensions: [...extensions, ...editorExtensions],
			editorProps: {
				handlePaste: () => true,
				handleDrop: () => true
			},
			content,
			onTransaction: ({ editor }) => {
				editorState = { editor };
			},
			onUpdate: () => {
				changesMadeSinceSave = true;
				if (editorState.editor?.isActive('link')) {
					editorState.editor?.commands.unsetLink();
				}
			},
			onDelete: async (data) => {
				if (data.type === 'node' && data.node.type.name === 'image') {
					await deleteFile({
						assignment,
						url: data.node.attrs.src
					});
				}
			},
			onSelectionUpdate: updateTextStyle
		});
		updateTextStyle();
	});

	onDestroy(() => {
		editorState.editor?.destroy();
	});

	let changesMadeSinceSave = $state(false);

	function onbeforeunload(event: Event) {
		if (changesMadeSinceSave) {
			event.preventDefault();
		}
	}

	function oncontextmenu(event: Event) {
		event.preventDefault();
	}

	const wordCount = $derived(
		editorState.editor
			?.getText()
			.split(' ')
			.filter((word) => word !== '').length
	);

	const selectionWordCount = $derived(
		editorState.editor?.state.doc
			.textBetween(
				editorState.editor?.state.selection.from,
				editorState.editor?.state.selection.to
			)
			.split(' ')
			.filter((word) => word !== '').length
	);
</script>

<svelte:window {onbeforeunload} {oncontextmenu} />

<div
	class="absolute top-{barHidden.value ? '0' : '20'} h-[calc(100vh-{barHidden.value
		? '6 rem'
		: '11rem'})] left-24 w-[calc(100vw-6rem)] pt-4 text-center"
>
	<div class="tiptap-container">
		<div spellcheck="false" bind:this={element} style="zoom: {zoom / 100};"></div>
	</div>
</div>

<button
	class="fixed top-0 left-0 flex h-screen w-24 flex-col items-center justify-center gap-2 border-r border-(--o) bg-(--bg)"
	onclick={() => editorState.editor?.chain().focus().run()}
>
	{#if editorState.editor}
		{#if !barHidden.value}
			<div class="relative top-0 left-0 h-20 bg-red-500"></div>
		{/if}
		<Popover>
			{#snippet trigger()}
				<Button.Root class="icon-button"><Zoom size={20} /></Button.Root>
			{/snippet}
			<div class="flex gap-4">
				<p>{m.zoom()}:</p>
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
			<Bold size={20} />
		</Toggle>
		<Toggle
			active={editorState.editor?.isActive('italic')}
			class="toggle-icon"
			onclick={() => editorState.editor?.chain().focus().toggleItalic().run()}
			title={m.italic()}
		>
			<Italic size={20} />
		</Toggle>
		<Toggle
			active={editorState.editor?.isActive('underline')}
			class="toggle-icon"
			onclick={() => editorState.editor?.chain().focus().toggleUnderline().run()}
			title={m.underline()}
		>
			<Underline size={20} />
		</Toggle>
		<div class="h-2"></div>
		<Popover border={false} bind:open={changeTextStyleOpen}>
			{#snippet trigger()}
				<Button.Root class="icon-button"><FontSize size={20} /></Button.Root>
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
		<div class="h-2"></div>
		<Popover bind:open={insertOpen}>
			<div class="my-2 flex gap-3">
				<Button.Root
					onclick={() => {
						addImageOpen = true;
						insertOpen = false;
					}}
					class="icon-button"
					title={m.image()}><Image size={20} /></Button.Root
				>
				<Button.Root
					onclick={() => {
						addAccentOpen = true;
						insertOpen = false;
					}}
					class="icon-button"
					title={m.accents()}
				>
					É
				</Button.Root>
			</div>
			{#snippet trigger()}
				<Button.Root class="icon-button">
					<Insert size={20} />
				</Button.Root>
			{/snippet}
		</Popover>
		<div class="my-3 w-10 border-b border-(--o)"></div>
		{@render children()}
		<Button.Root
			class="icon-button"
			title={m.submit()}
			onclick={() => (confirmSubmitOpen = true)}
		>
			<Submit size={20} />
		</Button.Root>
		{#if !saving}
			<Button.Root class="icon-button" title={m.save()} onclick={saveButton}>
				<Save size={20} />
			</Button.Root>
		{:else}
			<Button.Root disabled class="icon-button outline-none!">
				<Loader size={20} />
			</Button.Root>
		{/if}
		<div class="h-2"></div>
		<div>
			<p class="text-xl leading-3 font-bold">
				{selectionWordCount !== 0 ? selectionWordCount : wordCount}
			</p>
			<p>{m.words()}</p>
		</div>
	{:else}
		<Loader />
	{/if}
</button>

<AlertDialog bind:open={failedSave} message={m.ok()}>
	<p class="mb-4 w-100 text-center">{m.failed_to_save()}</p>
</AlertDialog>

<AlertDialog bind:open={addAccentOpen} cancelOverride>
	<Accents {addAccent} />
</AlertDialog>

{#if confirmSubmitOpen}
	{const text = $derived(editorState.editor?.getText())}
	{#if text !== ''}
		<AlertDialog bind:open={confirmSubmitOpen}>
			<p class="mb-4 w-100 text-center">{m.are_you_sure()} {m.submission()}</p>
			{#snippet go()}
				<Button.Root type="submit" onclick={submitAssignment}>{m.submit()}</Button.Root>
			{/snippet}
		</AlertDialog>
	{:else}
		<AlertDialog bind:open={confirmSubmitOpen} message={m.ok()}>
			<p class="mb-4 text-center">{m.document_empty()}</p>
		</AlertDialog>
	{/if}
{/if}

{#if addImageLoading}
	<AlertDialog bind:open={addImageOpen}>
		<div class="m-auto flex h-24 w-fit items-center">
			<Loader />
		</div>
	</AlertDialog>
{:else}
	<AlertDialog bind:open={addImageOpen} cancel={false}>
		<div class="h-14">
			<div class="flex gap-4">
				<div>
					<label for="fileInput" data-button-root>{m.choose_image()}</label>
					<input
						id="fileInput"
						type="file"
						accept="image/png, image/jpeg, image/webp, image/avif"
						bind:files={images}
						onchange={openFile}
						hidden
					/>
				</div>
				{#if imageTooBig}
					<p>Max 50 MB</p>
				{:else if images}
					<p>{images[0].name}</p>
				{/if}
			</div>

			<div class="h-8"></div>
		</div>
		{#snippet go()}
			<div class="h-10 w-full">
				<div class="flex gap-4">
					<Button.Root onclick={cancelAddImage} class="gray-button"
						>{m.cancel()}</Button.Root
					>
					<Button.Root onclick={addImage}>{m.submit()}</Button.Root>
				</div>
			</div>
		{/snippet}
	</AlertDialog>
{/if}
