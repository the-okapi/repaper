<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { formatDate } from '$lib/util';
	import { Button } from 'bits-ui';
	import { AlertDialog } from '$lib/components';
	import infoIcon from '$lib/assets/icons/info.svg';
	import submitIcon from '$lib/assets/icons/submit.svg';
	import { saveDocument } from './server.remote';
	import Tiptap from './Tiptap.svelte';
	import Document from './Document.svelte';

	let { data, params } = $props();

	let assignmentDetailsOpen = $state(false);

	async function save(content: string) {
		return await saveDocument({
			assignment: params.assignment,
			content
		});
	}

	let confirmUnsubmitOpen = $state(false);
	let confirmSubmitOpen = $state(false);
</script>

<svelte:head>
	<title>{data.title} | Repaper</title>
</svelte:head>

{#snippet assignmentDetails()}
	<Button.Root
		class="flex size-10 items-center justify-center p-0!"
		onclick={() => (assignmentDetailsOpen = true)}
		title={m.assignment_details()}
	>
		<img src={infoIcon} alt={m.assignment_details()} class="size-4.5" />
	</Button.Root>
{/snippet}

{#if !data.assignment.submitted}
	<Tiptap content={data.document.content} {save}>
		{@render assignmentDetails()}
		<div class="h-2"></div>
		<Button.Root
			class="flex size-10 items-center justify-center p-0!"
			title={m.submit()}
			onclick={() => (confirmSubmitOpen = true)}
		>
			<img src={submitIcon} alt={m.submit()} class="size-7" />
		</Button.Root>
	</Tiptap>
{:else}
	<Document content={data.document.content} submitted={data.assignment.submitted}>
		{@render assignmentDetails()}
		<Button.Root
			class="flex size-10 items-center justify-center p-0!"
			title={m.unsubmit()}
			onclick={() => (confirmUnsubmitOpen = true)}
		>
			<img src={submitIcon} alt={m.unsubmit()} class="size-7 rotate-180" />
		</Button.Root>
	</Document>
{/if}

<AlertDialog bind:open={assignmentDetailsOpen} message={m.ok()}>
	<div class="mb-10">
		<div class="flex">
			{#if new Date() > new Date(data.assignment.due_date)}
				<div class="badge w-fit! bg-(--red) px-5!">{m.late()}</div>
			{/if}
			<p class="my-auto ml-3">
				{m.due_date()}: <i>{formatDate(data.assignment.due_date)}</i>
			</p>
		</div>
		<h2 class="text-center text-2xl font-bold">{data.assignment.name}</h2>
		<p>{data.assignment.description}</p>
	</div>
</AlertDialog>

<AlertDialog bind:open={confirmSubmitOpen}>
	<p class="mb-4 w-100 text-center">{m.are_you_sure()} {m.submission()}</p>
	{#snippet go()}
		<form method="POST" action="?/submit">
			<Button.Root type="submit">{m.submit()}</Button.Root>
		</form>
	{/snippet}
</AlertDialog>

<AlertDialog bind:open={confirmUnsubmitOpen}>
	<p class="mb-4 w-100 text-center">{m.are_you_sure()} {m.undo_submission()}</p>
	{#snippet go()}
		<form method="POST" action="?/undo">
			<Button.Root type="submit">{m.submit()}</Button.Root>
		</form>
	{/snippet}
</AlertDialog>
