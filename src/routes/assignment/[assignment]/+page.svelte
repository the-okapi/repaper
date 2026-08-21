<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { formatDate } from '$lib/util';
	import { Tiptap } from '$lib/components';
	import { Button } from 'bits-ui';
	import { AlertDialog } from '$lib/components';

	let { data } = $props();

	let assignmentDetailsOpen = $state(false);
</script>

<svelte:head>
	<title>{data.title} | Repaper</title>
</svelte:head>

<div class="h-4"></div>
{#if !data.assignment.submitted}
	<Tiptap content={data.assignment.content}>
		{#snippet buttons()}
			<Button.Root onclick={() => (assignmentDetailsOpen = true)}
				>{m.assignment_details()}</Button.Root
			>
		{/snippet}
	</Tiptap>
{/if}

<AlertDialog bind:open={assignmentDetailsOpen}>
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
