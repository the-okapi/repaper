<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { formatDate } from '$lib/util';
	import { Button } from 'bits-ui';
	import { AlertDialog } from '$lib/components';
	import infoIcon from '$lib/assets/icons/info.svg';
	import { saveDocument } from './server.remote';
	import Tiptap from './Tiptap.svelte';

	let { data, params } = $props();

	let assignmentDetailsOpen = $state(false);

	async function save(content: string) {
		return await saveDocument({
			assignment: params.assignment,
			content
		});
	}
</script>

<svelte:head>
	<title>{data.title} | Repaper</title>
</svelte:head>

{#if !data.assignment.submitted}
	<Tiptap content={data.document.content} {save}>
		<Button.Root
			class="flex size-10 items-center justify-center p-0!"
			onclick={() => (assignmentDetailsOpen = true)}
			title={m.assignment_details()}
		>
			<img src={infoIcon} alt={m.assignment_details()} class="size-4.5" />
		</Button.Root>
	</Tiptap>
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
