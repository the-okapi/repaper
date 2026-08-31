<script lang="ts">
	import { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import { extensions, viewerExtensions } from '$lib/tiptap';
	import { m } from '$lib/paraglide/messages';
	import { formatDate } from '$lib/util';
	import { Button } from 'bits-ui';
	import { AlertDialog } from '$lib/components';

	let element: any = $state();
	let editorState: { editor: Editor | null } = $state({ editor: null });

	let { data } = $props();

	let assignmentDetailsOpen = $state(false);

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
	class="absolute top-25 right-0 flex w-[calc(100vw-26.25rem)] flex-col items-center justify-center gap-4 pb-5"
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
		<Button.Root onclick={() => (assignmentDetailsOpen = true)}
			>{m.assignment_details()}</Button.Root
		>
	</div>
	<div class="tiptap-container">
		<div spellcheck="false" bind:this={element} style="zoom: 0.75;"></div>
	</div>
</div>

<AlertDialog bind:open={assignmentDetailsOpen} message={m.ok()} cancelOverride>
	<div class="mb-5">
		<div class="flex">
			{#if new Date() > new Date(data.submission.assignment.due_date)}
				<div class="badge w-fit! bg-(--red) px-5!">{m.late()}</div>
			{/if}
			<p class="w-full text-center">
				{m.due_date()}: <i>{formatDate(data.submission.assignment.due_date)}</i>
			</p>
		</div>
		<h2 class="text-center text-2xl font-bold">{data.submission.assignment.name}</h2>
		<p class="m-auto block w-fit">{data.submission.assignment.description}</p>
	</div>
</AlertDialog>
