<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { formatDate } from '$lib/util';
	import { Button } from 'bits-ui';
	import { AlertDialog } from '$lib/components';
	import infoIcon from '$lib/assets/icons/info.svg';
	import submitIcon from '$lib/assets/icons/submit.svg';
	import Editor from './Editor.svelte';
	import Viewer from './Viewer.svelte';

	let { data, params } = $props();

	let assignmentDetailsOpen = $state(false);

	let confirmUnsubmitOpen = $state(false);
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
	<Editor content={data.document.content} assignment={params.assignment}>
		{@render assignmentDetails()}
	</Editor>
{:else}
	<Viewer content={data.document.content} submitted={data.assignment.submitted}>
		{@render assignmentDetails()}
		<Button.Root
			class="flex size-10 items-center justify-center p-0!"
			title={m.unsubmit()}
			onclick={() => (confirmUnsubmitOpen = true)}
		>
			<img src={submitIcon} alt={m.unsubmit()} class="size-7 rotate-180" />
		</Button.Root>
	</Viewer>
{/if}

<AlertDialog bind:open={assignmentDetailsOpen} message={m.ok()} cancelOverride>
	<div class="mb-5">
		<div class="flex">
			{#if new Date() > new Date(data.assignment.due_date)}
				<div class="badge w-fit! bg-(--r) px-5!">{m.late()}</div>
			{/if}
			<p class="w-full text-center">
				{m.due_date()}: <i>{formatDate(data.assignment.due_date)}</i>
			</p>
		</div>
		<h2 class="text-center text-2xl font-bold">{data.assignment.name}</h2>
		<p class="m-auto block w-fit">{data.assignment.description}</p>
	</div>
</AlertDialog>

<AlertDialog bind:open={confirmUnsubmitOpen}>
	<p class="mb-4 w-100 text-center">{m.are_you_sure()} {m.undo_submission()}</p>
	{#snippet go()}
		<form method="POST" action="?/undo">
			<Button.Root type="submit">{m.submit()}</Button.Root>
		</form>
	{/snippet}
</AlertDialog>
