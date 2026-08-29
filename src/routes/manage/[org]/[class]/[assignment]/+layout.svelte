<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
	import { Label, Button } from 'bits-ui';
	import { DatePicker, AlertDialog, Tabs, Loader } from '$lib/components';
	import { getLocale } from '$lib/paraglide/runtime';
	import {
		changeName,
		changeDescription,
		changeDueDate,
		deleteAssignment
	} from './actions.remote';
	import { goto } from '$app/navigation';
	import type { RemoteFormEnhanceCallback } from '@sveltejs/kit';

	let { data, children } = $props();

	let nameValue = $state('');
	let descriptionValue = $state('');
	let dueDateValue = $state('');

	let confirmDeleteOpen = $state(false);

	let loading = $state(false);

	const handleLoading: RemoteFormEnhanceCallback<any> = async (form) => {
		loading = true;
		await form.submit();
		if (form.result?.status === 200) {
			nameValue = '';
			descriptionValue = '';
			dueDateValue = '';
		}
		loading = false;
	};
</script>

<div class="fixed top-20 left-0 flex h-[calc(100vh-5rem)] flex-col gap-2 py-5 pl-5">
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
			{#each data.submissions as submission (submission.id)}
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
						{/if}
					</div>
					<Button.Root
						class="small-button"
						onclick={() =>
							goto(
								`/manage/${page.params.org}/${page.params.class}/${page.params.assignment}/${submission.id}`,
								{ replaceState: true }
							)}>View</Button.Root
					>
				</div>
				<div class="m-auto my-3 w-[85%] border-b border-(--o)"></div>
			{/each}
		</div>
	</div>

	<div class="box relative h-140!">
		{#if loading}
			<Loader />
		{/if}
		{#snippet name()}
			<form {...changeName.enhance(handleLoading)}>
				<h1 class="mt-4 mb-2 text-center text-3xl font-bold">
					{m.change()}
					{m.name()}
				</h1>
				<div class="m-auto w-fit">
					<Label.Root>{m.name()}:</Label.Root><br />
					<input
						placeholder={data.assignment.name}
						bind:value={nameValue}
						name="name"
						class="w-60"
						required
					/>
				</div>
				<div class="absolute right-0 bottom-5 w-full text-center">
					<Button.Root type="submit">{m.submit()}</Button.Root>
				</div>

				<p class="absolute bottom-px px-8 text-sm">
					{changeName.result?.nameMessage}
				</p>

				<input type="hidden" name="assignment" value={page.params.assignment} />
				<input type="hidden" name="class" value={page.params.class} />
			</form>
		{/snippet}
		{#snippet description()}
			<form {...changeDescription.enhance(handleLoading)}>
				<h1 class="mt-4 mb-2 text-center text-3xl font-bold">
					{m.change()} Description
				</h1>
				<div class="m-auto w-fit">
					<Label.Root>Description:</Label.Root><br />
					<textarea
						name="description"
						placeholder={data.assignment.description}
						bind:value={descriptionValue}
						class="m-0! mt-1! inline h-20 w-60"
						required></textarea>
				</div>
				<div class="absolute right-0 bottom-5 w-full text-center">
					<Button.Root type="submit">{m.submit()}</Button.Root>
				</div>
				<p class="absolute bottom-px px-8 text-sm">
					{changeDescription.result?.descriptionMessage}
				</p>

				<input type="hidden" name="assignment" value={page.params.assignment} />
				<input type="hidden" name="class" value={page.params.class} />
			</form>
		{/snippet}
		{#snippet dueDate()}
			{let dueDateMessage = $state('')}
			<form {...changeDueDate.enhance(handleLoading)}>
				<h1 class="mt-4 mb-2 text-center text-3xl font-bold">
					{m.change()}
					{m.due_date()}
				</h1>
				<div class="px-12">
					<Label.Root>{m.due_date()}:</Label.Root>
					<DatePicker
						name="dueDate"
						defaultValue={changeDueDate.fields.dueDate.value()}
						bind:value={dueDateValue}
					/>
				</div>
				<div class="absolute right-0 bottom-5 w-full text-center">
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
				<p class="absolute bottom-px px-8 text-sm">
					{#if dueDateMessage}
						{dueDateMessage}
					{:else}
						{changeDueDate.result?.dueDateMessage}
					{/if}
				</p>

				<input type="hidden" name="assignment" value={page.params.assignment} />
				<input type="hidden" name="class" value={page.params.class} />
			</form>
		{/snippet}
		<div class="h-full w-full" hidden={loading}>
			<Tabs
				snippets={[name, description, dueDate]}
				labels={[m.name(), m.description(), m.due_date()]}
				value={m.name()}
				triggerClass="w-27"
			/>
		</div>
	</div>
</div>

{@render children()}

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
