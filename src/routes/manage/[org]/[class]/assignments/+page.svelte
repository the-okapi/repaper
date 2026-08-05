<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { Button, Label } from 'bits-ui';
	import { page } from '$app/state';
	import { Tabs, AlertDialog } from '$lib/components';
	import { formatDate } from '$lib/util';

	let { data, form } = $props();

	let dueDate = $derived(form?.dueDate ?? new Date().toISOString());

	let confirmDeleteOpen = $state(false);
	let assignmentIndex = $state(0);
	let assignment = $derived(data.assignments[assignmentIndex]);
</script>

<svelte:head>
	<title>{data.title} | Repaper</title>
</svelte:head>

{#if data.assignments.length === 0}
	<div class="flex h-screen w-screen flex-col items-center justify-center">
		<p class="mb-10 w-100 text-center text-xl">{m.no_assignments()}</p>
		<Button.Root href={page.url.pathname.split('/assignments')[0]}>{m.back()}</Button.Root>
	</div>
{:else}
	<div class="h-22"></div>
	<a
		href="/manage/{page.params.org ?? ''}/{page.params.class ?? ''}"
		class="relative ml-10 hover:underline">← {m.back()}</a
	>
	<div class="mt-2 grid grid-cols-3 gap-8 px-2">
		{#each data.assignments as assignment, i (assignment.id)}
			<div class="box">
				<div>
					<p class="text-center italic">{formatDate(assignment.due_date)}</p>
					<h2 class="text-center text-2xl font-bold">{assignment.name}</h2>
					<p class="px-4 text-center">{assignment.description}</p>
					<div class="m-auto mt-8 h-40 w-fit">
						{#snippet changeName()}
							<form method="POST" action="?/changeName" class="m-auto w-fit">
								<Label.Root>{m.change()} {m.name()}:</Label.Root><br />
								<input value={form?.name} name="name" class="h-10 w-56" required />
								<Button.Root type="submit">{m.go()}</Button.Root>
								<input type="hidden" name="assignment" value={assignment.id} />
							</form>
							<p class="text-center">{form?.nameMessage}</p>
						{/snippet}
						{#snippet changeDescription()}
							<form
								method="POST"
								action="?/changeDescription"
								class="m-auto h-fit w-fit"
							>
								<Label.Root>{m.change()} Description:</Label.Root><br />
								<div class="mt-0.75 flex gap-1">
									<textarea
										value={form?.description}
										name="description"
										class="m-0! inline h-10 w-56"
										required></textarea>
									<Button.Root type="submit">{m.go()}</Button.Root>
								</div>
								<input type="hidden" name="assignment" value={assignment.id} />
							</form>
							<p class="text-center">{form?.descriptionMessage}</p>
						{/snippet}
						{#snippet changeDueDate()}
							<form method="POST" action="?/changeDueDate" class="m-auto w-fit">
								<Label.Root>{m.change()} {m.due_date()}:</Label.Root><br />
								<input
									type="datetime-local"
									class="h-10 w-56"
									bind:value={dueDate}
									required
								/>
								<Button.Root type="submit">{m.go()}</Button.Root>
								<input type="hidden" name="assignment" value={assignment.id} />
								<input
									type="hidden"
									name="dueDate"
									value={new Date(dueDate).toISOString()}
								/>
							</form>
							<p class="text-center">{form?.dueDateMessage}</p>
						{/snippet}
						{#snippet deleteAssignment()}
							<div class="mt-5 w-full">
								<Button.Root
									class="red-button m-auto block"
									onclick={() => {
										assignmentIndex = i;
										confirmDeleteOpen = true;
									}}>{m.delete()} {m.assignment()}</Button.Root
								>
							</div>
						{/snippet}
						<Tabs
							labels={[m.name(), 'Description', m.due_date(), m.delete()]}
							snippets={[
								changeName,
								changeDescription,
								changeDueDate,
								deleteAssignment
							]}
							class="m-auto"
						/>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}

<AlertDialog bind:open={confirmDeleteOpen}>
	<p class="mb-5 w-100">
		{m.are_you_sure()}
		{m.confirm_delete_assignment({ name: assignment.name })}
	</p>
	{#snippet go()}
		<form action="?/delete" method="POST">
			<input type="hidden" value={assignment.id} name="assignment" />
			<Button.Root type="submit" class="red-button">{m.go()}</Button.Root>
		</form>
	{/snippet}
</AlertDialog>
