<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import { Slider, Toggle, Loader, Popover, Select, AlertDialog } from '$lib/components';
	import { m } from '$lib/paraglide/messages';
	import { Button } from 'bits-ui';
	import BoldIcon from '$lib/assets/icons/Bold.svelte';
	import ItalicIcon from '$lib/assets/icons/Italic.svelte';
	import UnderlineIcon from '$lib/assets/icons/Underline.svelte';
	import zoomIcon from '$lib/assets/icons/zoom.svg';
	import fontSizeIcon from '$lib/assets/icons/font.svg';
	import saveIcon from '$lib/assets/icons/save.svg';
	import submitIcon from '$lib/assets/icons/submit.svg';
	import { barHidden } from '$lib/state.svelte';
	import { extensions, editorExtensions } from '$lib/tiptap';
	import { saveDocument, submitDocument } from './server.remote.ts';

	let element: any = $state();
	let editorState: { editor: Editor | null } = $state({ editor: null });

	let { content, children, assignment } = $props();

	let zoom = $state(95);

	let textStyle = $state('p');
	let changeTextStyleOpen = $state(false);

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
				<Button.Root class="icon-button"
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
		<div class="h-2"></div>
		<Popover border={false} bind:open={changeTextStyleOpen}>
			{#snippet trigger()}
				<Button.Root class="icon-button"
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
		{@render children()}
		<Button.Root
			class="icon-button"
			title={m.submit()}
			onclick={() => (confirmSubmitOpen = true)}
		>
			<img src={submitIcon} alt={m.submit()} class="size-7" />
		</Button.Root>
		{#if !saving}
			<Button.Root class="icon-button" title={m.save()} onclick={saveButton}>
				<img src={saveIcon} alt={m.save()} class="size-4.5!" />
			</Button.Root>
		{:else}
			<Button.Root disabled class="icon-button outline-none!">
				<Loader size={20} />
			</Button.Root>
		{/if}
	{:else}
		<Loader />
	{/if}
</button>

<AlertDialog bind:open={failedSave} message={m.ok()}>
	<p class="mb-4 w-100 text-center">{m.failed_to_save()}</p>
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
