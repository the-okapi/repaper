<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
	import { Label, Button } from 'bits-ui';
	import { DatePicker, AlertDialog, Tabs } from '$lib/components';
	import { formatDate } from '$lib/util';

	let { data, form } = $props();

	let dueDate = $state('');

	let confirmDeleteOpen = $state(false);
</script>

<div class="h-5"></div>
<a
	href="/manage/{page.params.org}/{page.params.class}/assignments"
	class="absolute top-22 ml-10 hover:underline">← {m.back()}</a
>

<div class="grid grid-cols-3 gap-3 px-30">
	<div class="box relative text-center">
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
	</div>

	<div class="box relative">
		{#snippet changeName()}
			<form method="POST" action="?/changeName" class="mt-6">
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
				<br />
				<Button.Root type="submit" class="m-auto mt-4.5 block">{m.submit()}</Button.Root>
				<p class="absolute bottom-4 px-8 leading-5">{form?.nameMessage}</p>
			</form>
		{/snippet}
		{#snippet changeDescription()}
			<form method="POST" action="?/changeDescription" class="mt-6">
				<h1 class="mb-4 text-center text-3xl font-bold">{m.change()} Description</h1>
				<div class="m-auto w-fit">
					<Label.Root>Description:</Label.Root><br />
					<textarea
						value={form?.description}
						name="description"
						placeholder={data.assignment.description}
						class="m-0! inline h-20 w-60"
						required></textarea>
				</div>
				<Button.Root type="submit" class="m-auto mt-2 block">{m.submit()}</Button.Root>
				<p class="absolute bottom-4 px-8 leading-5">{form?.descriptionMessage}</p>
			</form>
		{/snippet}
		{#snippet changeDueDate()}
			<form method="POST" action="?/changeDueDate" class="mt-6">
				<h1 class="mb-4 text-center text-3xl font-bold">{m.change()} {m.due_date()}</h1>
				<div class="px-12">
					<Label.Root>{m.due_date()}:</Label.Root>
					<DatePicker name="dueDate" defaultValue={form?.dueDate} bind:value={dueDate} />
				</div>
				<Button.Root type="submit" class="m-auto mt-2 block" disabled={dueDate === ''}
					>{m.submit()}</Button.Root
				>
				<p class="absolute bottom-4 px-8 leading-5">{form?.dueDateMessage}</p>
			</form>
		{/snippet}
		<div class="h-full w-full pt-2">
			<Tabs
				snippets={[changeName, changeDescription, changeDueDate]}
				labels={[m.name(), 'Description', m.due_date()]}
				value={m.name()}
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
