<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
	import { Label, Button } from 'bits-ui';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import AlertDialog from '$lib/components/AlertDialog.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Combobox from '$lib/components/Combobox.svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import {
		changeName,
		changeDescription,
		changeDueDate,
		deleteAssignment,
		assign
	} from './actions.remote';
	import { goto } from '$app/navigation';
	import type { RemoteFormEnhanceCallback } from '@sveltejs/kit';
	import { loadStudents } from './load.remote';
	import { formatDate } from '$lib/util';
	import Edit from '@lucide/svelte/icons/pencil';

	let { data, children } = $props();

	let nameValue = $state('');
	let descriptionValue = $state('');
	let dueDateValue = $state('');

	let changeNameOpen = $state(false);
	let changeDescriptionOpen = $state(false);
	let changeDueDateOpen = $state(false);

	let confirmDeleteOpen = $state(false);

	let nameLoading = $state(false);
	let descriptionLoading = $state(false);
	let dueDateLoading = $state(false);

	let assignToMoreStudentsOpen = $state(false);
	let assignToMoreStudentsLoading = $state(false);

	let selectedStudents = $state([]);

	const handleLoadingName: RemoteFormEnhanceCallback<any> = async (form) => {
		nameLoading = true;
		await form.submit();
		if (form.result?.status === 200) {
			changeNameOpen = false;
			nameValue = '';
			form.element.reset();
		}
		nameLoading = false;
	};

	const handleLoadingDescription: RemoteFormEnhanceCallback<any> = async (form) => {
		descriptionLoading = true;
		await form.submit();
		if (form.result?.status === 200) {
			changeDescriptionOpen = false;
			descriptionValue = '';
			form.element.reset();
		}
		descriptionLoading = false;
	};

	const handleLoadingDueDate: RemoteFormEnhanceCallback<any> = async (form) => {
		dueDateLoading = true;
		await form.submit();
		if (form.result?.status === 200) {
			changeDueDateOpen = false;
			dueDateValue = '';
			form.element.reset();
		}
		dueDateLoading = false;
	};

	let students = $state(null);

	async function assignToAnotherStudent() {
		assignToMoreStudentsLoading = true;
		assignToMoreStudentsOpen = true;
		const { students: unfilteredStudents } = await loadStudents(page.params.class ?? '');
		students = unfilteredStudents.filter(
			(a: { value: string; label: string }) =>
				data.submissions.find((b: any) => b.user.id === a.value) === undefined
		);
		assignToMoreStudentsLoading = false;
	}
</script>

<div class="fixed top-20 left-0 flex h-[calc(100vh-5rem)] flex-col gap-2 pt-10 pb-5 pl-10">
	<div class="box relative h-full! overflow-scroll">
		<div class="h-full w-full p-3">
			{#each data.submissions as submission (submission.id)}
				{const url = `/manage/${page.params.org}/${page.params.class}/${page.params.assignment}/${submission.id}`}
				<div class="flex items-center justify-end gap-3">
					<div class="flex w-full items-center gap-2">
						<p class="text-lg font-bold whitespace-nowrap">
							{submission.user.name}
						</p>
						{#if submission.submitted}
							<p class="text-sm">
								{m.submitted()}
								{new Date(submission.submitted).toLocaleDateString(getLocale(), {})}
							</p>
						{:else if submission.document === null}
							<p class="text-sm">{m.assignment_not_started()}</p>
						{/if}
					</div>
					<Button.Root
						class="small-button"
						onclick={() => goto(url, { replaceState: true })}
						disabled={url === page.url.pathname || submission.document === null}
						>{m.view()}</Button.Root
					>
				</div>
				<div class="m-auto my-3 w-[85%] border-b border-(--o)"></div>
			{/each}
			<Button.Root class="m-auto mb-3 block" onclick={assignToAnotherStudent}
				>{m.assign_to()} {m.more_students()}</Button.Root
			>
		</div>
	</div>

	{#snippet editButton(onclick = () => {}, size = 6, img = 4)}
		<Button.Root
			class="ghost-button m-0! inline-flex h-{size}! w-{size}! items-center justify-center rounded-lg! p-1.5!"
			style="max-height: {size / 4}rem !important; max-width: {size / 4}rem !important;"
			{onclick}
		>
			<Edit style="max-width: {img / 4}rem !important; max-height: {img / 4}rem !important" />
		</Button.Root>
	{/snippet}

	<div class="box relative h-140!">
		<div>
			{#if new Date() > new Date(data.assignment.due_date)}
				<p class="badge m-auto w-fit! bg-(--r) px-5!">
					{m.past()}
				</p>
			{:else}
				<p class="badge m-auto w-fit! bg-(--p) px-5! text-(--p-fg)">
					{m.upcoming()}
				</p>
			{/if}
			<p class="mt-2 flex items-center justify-center gap-1 italic">
				{formatDate(data.assignment.due_date)}
				{@render editButton(() => (changeDueDateOpen = true))}
			</p>
			<h3 class="flex items-center justify-center gap-2 text-2xl font-semibold">
				{data.assignment.name}
				{@render editButton(() => (changeNameOpen = true), 7, 5)}
			</h3>
			<p class="mb-8 flex items-center justify-center gap-1 px-8">
				{data.assignment.description}

				{@render editButton(() => (changeDescriptionOpen = true))}
			</p>
			<Button.Root class="red-button m-auto block" onclick={() => (confirmDeleteOpen = true)}
				>{m.delete()} {m.assignment()}</Button.Root
			>
		</div>
	</div>
</div>

<a
	href="/manage/{page.params.org}/{page.params.class}/assignments"
	class="fixed top-22 left-10 hover:underline">← {m.back()}</a
>

{@render children()}

<AlertDialog bind:open={changeNameOpen}>
	<div class="flex h-45 items-center justify-center">
		{#if nameLoading}
			<Loader />
		{:else}
			<form {...changeName.enhance(handleLoadingName)}>
				<h1 class="mb-2 text-center text-3xl font-bold">
					{m.change()}
					{m.le()}{m.name()}
				</h1>

				<div class="m-auto mb-5 w-fit">
					<Label.Root>{m.name()}:</Label.Root><br />
					<input
						placeholder={data.assignment.name}
						bind:value={nameValue}
						name="name"
						class="w-70"
						required
					/>
				</div>

				<div class="flex items-center justify-center gap-4">
					<Button.Root class="gray-button" onclick={() => (changeNameOpen = false)}
						>{m.cancel()}</Button.Root
					>
					<Button.Root type="submit">{m.submit()}</Button.Root>
				</div>

				<p class="absolute bottom-px px-8 text-sm leading-4">
					{changeName.result?.nameMessage}
				</p>

				<input type="hidden" name="assignment" value={page.params.assignment} />
				<input type="hidden" name="class" value={page.params.class} />
			</form>
		{/if}
	</div>
</AlertDialog>

<AlertDialog bind:open={changeDescriptionOpen}>
	<div class="flex h-45 items-center justify-center">
		{#if descriptionLoading}
			<Loader />
		{:else}
			<form {...changeDescription.enhance(handleLoadingDescription)} class="w-full">
				<h1 class="mb-2 text-center text-3xl font-bold">
					{m.change()}
					{m.la()}Description
				</h1>

				<div class="m-auto mb-5 w-full">
					<Label.Root>Description:</Label.Root><br />
					<textarea
						name="description"
						placeholder={data.assignment.description}
						bind:value={descriptionValue}
						class="m-0! mt-1! inline h-20 w-full"
						required></textarea>
				</div>

				<div class="flex items-center justify-center gap-4">
					<Button.Root class="gray-button" onclick={() => (changeDescriptionOpen = false)}
						>{m.cancel()}</Button.Root
					>
					<Button.Root type="submit">{m.submit()}</Button.Root>
				</div>

				<p class="absolute bottom-px px-8 text-sm leading-4">
					{changeDescription.result?.descriptionMessage}
				</p>

				<input type="hidden" name="assignment" value={page.params.assignment} />
				<input type="hidden" name="class" value={page.params.class} />
			</form>
		{/if}
	</div>
</AlertDialog>

<AlertDialog bind:open={changeDueDateOpen}>
	{let dueDateMessage = $state('')}
	<div class="flex h-45 items-center justify-center">
		{#if dueDateLoading}
			<Loader />
		{:else}
			<form {...changeDueDate.enhance(handleLoadingDueDate)}>
				<h1 class="mb-2 text-center text-3xl font-bold">
					{m.change()}
					{m.la()}{m.due_date()}
				</h1>

				<div class="mb-5 px-12">
					<Label.Root>{m.due_date()}:</Label.Root>
					<DatePicker
						name="dueDate"
						defaultValue={changeDueDate.fields.dueDate.value()}
						bind:value={dueDateValue}
					/>
				</div>

				<div class="flex items-center justify-center gap-4">
					<Button.Root onclick={() => (changeDueDateOpen = false)} class="gray-button"
						>{m.cancel()}</Button.Root
					>
					{#if dueDateValue === ''}
						<Button.Root
							onclick={() => (dueDateMessage = m.due_date() + m.is_required())}
							>{m.submit()}</Button.Root
						>
					{:else}
						<Button.Root type="submit" onclick={() => (dueDateMessage = '')}
							>{m.submit()}</Button.Root
						>
					{/if}
				</div>

				<p class="absolute bottom-px px-8 text-sm leading-4">
					{#if dueDateMessage}
						{dueDateMessage}
					{:else}
						{changeDueDate.result?.dueDateMessage}
					{/if}
				</p>

				<input type="hidden" name="assignment" value={page.params.assignment} />
				<input type="hidden" name="class" value={page.params.class} />
			</form>
		{/if}
	</div>
</AlertDialog>

<AlertDialog bind:open={confirmDeleteOpen}>
	<p class="mb-5 w-100 text-center">
		{m.are_you_sure()}
		{m.confirm_delete_assignment({ name: data.assignment.name })}
	</p>
	{#snippet go()}
		<form {...deleteAssignment}>
			<Button.Root type="submit" class="red-button">{m.go()}</Button.Root>

			<input type="hidden" name="assignment" value={page.params.assignment} />
			<input type="hidden" name="class" value={page.params.class} />
		</form>
	{/snippet}
</AlertDialog>

{#if assignToMoreStudentsLoading === true}
	<AlertDialog bind:open={assignToMoreStudentsOpen}>
		<div class="m-auto flex h-31 w-fit items-center">
			<Loader />
		</div>
	</AlertDialog>
{:else}
	<AlertDialog bind:open={assignToMoreStudentsOpen}>
		<div class="m-auto mb-5 h-16 w-48">
			<div class="grid grid-cols-2">
				<p class="text-left">{m.assign_to()}:</p>
				<p class="text-right">
					{selectedStudents.length}
					{m.student()}{selectedStudents.length !== 1 ? 's' : ''}
				</p>
			</div>
			<div class="m-auto w-fit">
				<Combobox options={students} multiple bind:value={selectedStudents} />
			</div>
			<input type="hidden" value={JSON.stringify(selectedStudents)} name="students" />
		</div>
		{#snippet go()}
			<form
				{...assign.enhance(async (form) => {
					assignToMoreStudentsLoading = true;
					await form.submit();
					assignToMoreStudentsOpen = false;
					assignToMoreStudentsLoading = false;
				})}
			>
				<Button.Root type="submit">{m.submit()}</Button.Root>
				<input type="hidden" name="students" value={JSON.stringify(selectedStudents)} />
				<input type="hidden" name="class" value={page.params.class} />
				<input type="hidden" name="assignment" value={page.params.assignment} />
			</form>
		{/snippet}
	</AlertDialog>
{/if}
