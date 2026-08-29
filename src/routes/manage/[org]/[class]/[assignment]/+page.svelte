<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
	import { Label, Button } from 'bits-ui';
	import { DatePicker, AlertDialog, Tabs, Document } from '$lib/components';
	import { formatDate } from '$lib/util';
	import { getLocale } from '$lib/paraglide/runtime';

	let { data, form } = $props();

	let dueDate = $state('');

	let confirmDeleteOpen = $state(false);
</script>

<div class="h-2"></div>
<a
	href="/manage/{page.params.org}/{page.params.class}/assignments"
	class="absolute top-20 left-2 text-sm hover:underline">← {m.back()}</a
>

<div class="fixed top-20 right-0 flex h-[calc(100vh-5rem)] flex-col gap-2 py-5 pr-5">
	<!-- <div class="box relative text-center">
		<div>
			{#if new Date() > new Date(data.assignment.due_date)}
				<p class="badge m-auto w-fit! bg-(--red) px-5!">
					{m.past()}
				</p>
			{:else}
				<p class="badge m-auto w-fit! bg-(--p) px-5! text-(--p-fg)">
					{m.upcoming()}
				</p>
			{/if}
			<p class="mt-2 italic">{formatDate(data.assignment.due_date)}</p>
			<h3 class="text-center text-2xl font-semibold">
				{data.assignment.name}
			</h3>
			<p class="mb-8 px-8">{data.assignment.description}</p>
			<Button.Root class="red-button m-auto block" onclick={() => (confirmDeleteOpen = true)}
				>{m.delete()} {m.assignment()}</Button.Root
			>
		</div>
	</div> -->

	<div class="box relative h-full! overflow-scroll">
		<div class="h-full w-full p-3">
			{#each data.submissions as submission, i (submission.id)}
				{#if i !== 0}
					<div class="m-auto my-3 w-[85%] border-b border-(--o)"></div>
				{/if}
				<div class="flex items-center justify-end gap-3">
					<div class="flex w-full items-center gap-2">
						<p class="text-lg font-bold whitespace-nowrap">{submission.user.name}</p>
						{#if submission.submitted}
							<p class="text-sm">
								{m.submitted()}
								{new Date(submission.submitted).toLocaleDateString(getLocale(), {})}
							</p>
						{/if}
					</div>
					<Button.Root class="small-button">View</Button.Root>
				</div>
			{/each}
		</div>
	</div>

	<div class="box relative h-140!">
		{#snippet changeName()}
			<form method="POST" action="?/changeName">
				<h1 class="mb-4 text-center text-3xl font-bold">{m.change()} {m.name()}</h1>
				<div class="m-auto w-fit">
					<Label.Root>{m.name()}:</Label.Root><br />
					<input
						value={form?.name}
						placeholder={data.assignment.name}
						name="name"
						class="w-60"
						required
					/>
				</div>
				<div class="absolute right-0 bottom-5 w-full text-center">
					<Button.Root type="submit">{m.submit()}</Button.Root>
				</div>
				<p class="absolute bottom-px px-8 text-sm">
					{form?.nameMessage}
				</p>
			</form>
		{/snippet}
		{#snippet changeDescription()}
			<form method="POST" action="?/changeDescription">
				<h1 class="mb-4 text-center text-3xl font-bold">{m.change()} Description</h1>
				<div class="m-auto w-fit">
					<Label.Root>Description:</Label.Root><br />
					<textarea
						value={form?.description}
						name="description"
						placeholder={data.assignment.description}
						class="m-0! mt-1! inline h-20 w-60"
						required></textarea>
				</div>
				<div class="absolute right-0 bottom-5 w-full text-center">
					<Button.Root type="submit">{m.submit()}</Button.Root>
				</div>
				<p class="absolute bottom-px px-8 text-sm">{form?.descriptionMessage}</p>
			</form>
		{/snippet}
		{#snippet changeDueDate()}
			<form method="POST" action="?/changeDueDate">
				<h1 class="mb-4 text-center text-3xl font-bold">{m.change()} {m.due_date()}</h1>
				<div class="px-12">
					<Label.Root>{m.due_date()}:</Label.Root>
					<DatePicker name="dueDate" defaultValue={form?.dueDate} bind:value={dueDate} />
				</div>
				<div class="absolute right-0 bottom-5 w-full text-center">
					<Button.Root type="submit" disabled={dueDate === ''}>{m.submit()}</Button.Root>
				</div>
				<p class="absolute bottom-px px-8 text-sm">{form?.dueDateMessage}</p>
			</form>
		{/snippet}
		<div class="h-full w-full">
			<Tabs
				snippets={[changeName, changeDescription, changeDueDate]}
				labels={[m.name(), 'Description', m.due_date()]}
				value={m.name()}
				triggerClass="w-27"
			/>
		</div>
	</div>
</div>

<AlertDialog bind:open={confirmDeleteOpen}>
	<p class="mb-5 w-100 text-center">
		{m.are_you_sure()}
		{m.confirm_delete_assignment({ name: data.assignment.name })}
	</p>
	{#snippet go()}
		<form action="?/deleteAssignment" method="POST">
			<Button.Root type="submit" class="red-button">{m.go()}</Button.Root>
		</form>
	{/snippet}
</AlertDialog>
