<script lang="ts">
	import { Loader, Switch, Combobox, DatePicker } from '$lib/components';
	import { createAssignment, getStudents } from './server.remote';
	import { Label, Button } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';

	let loading = $state(false);
	let everyone = $derived(createAssignment.result?.everyone ?? true);

	let students: { label: string; value: string }[] = $state(
		createAssignment.result?.students ?? []
	);

	async function loadStudents() {
		if (everyone === false && students.length === 0) {
			const result = await getStudents(page.params.class ?? '');
			students = result.students;
		}
	}

	let selectedStudents = $state([]);

	let errorText = $state('');

	let showSuccess = $state(false);

	function createAnother() {
		day = null;
		showSuccess = false;
	}

	let dateTime = $state('');
	let day = $state(null);
</script>

<div
	class="relative flex h-full w-full items-center justify-center rounded-xl border border-(--o) bg-(--bg) p-5"
>
	{#if loading}
		<Loader />
	{:else if createAssignment.result?.success && showSuccess}
		<div>
			<p>{m.created_assignment()}</p>
			<Button.Root class="m-auto mt-10 block" onclick={createAnother}
				>{m.create_another()}</Button.Root
			>
		</div>
	{:else}
		<div class="flex h-full w-full flex-col items-center">
			<h1 class="mb-1 text-center text-2xl font-bold">{m.create_assignment()}</h1>
			<form
				{...createAssignment.enhance(async (form: any) => {
					if (!everyone && selectedStudents.length === 0) {
						errorText = m.please_select_student();
						return;
					}
					if (dateTime === '') {
						errorText = m.date_not_selected();
						return;
					}
					errorText = '';
					loading = true;
					await form.submit();
					if (createAssignment.result?.success) {
						showSuccess = true;
					}
					loading = false;
				})}
				class="w-60"
			>
				<div class="mb-3 w-fit">
					<Label.Root>{m.name()}:</Label.Root><br />
					<input
						value={createAssignment.result?.name ?? ''}
						class="w-60"
						name="name"
						required
					/>
				</div>
				<div class="mb-5">
					<Label.Root>Description:</Label.Root>
					<textarea
						value={createAssignment.result?.description ?? ''}
						class="h-20 w-60"
						maxlength={500}
						name="description"></textarea>
				</div>
				<div class="mb-5">
					<Label.Root>{m.due_date()}:</Label.Root>
					<DatePicker name="dueDate" bind:day bind:value={dateTime} />
				</div>
				<div class="m-auto flex w-fit justify-center gap-4">
					<Switch
						class="my-auto"
						bind:checked={everyone}
						onCheckedChange={loadStudents}
					/>
					<Label.Root class="my-auto whitespace-nowrap"
						>{m.assign_to_everyone()}</Label.Root
					>
					<input type="hidden" value={everyone} name="everyone" />
				</div>
				<div class="mt-8 flex h-15 w-full items-center justify-center">
					{#if !everyone}
						{#if students.length > 0}
							<div>
								<div class="grid grid-cols-2">
									<p class="text-left">{m.assign_to()}:</p>
									<p class="text-right">
										{selectedStudents.length}
										{m.student()}{selectedStudents.length !== 1 ? 's' : ''}
									</p>
								</div>
								<Combobox
									options={students}
									multiple
									bind:value={selectedStudents}
								/>
								<input
									type="hidden"
									value={JSON.stringify(selectedStudents)}
									name="students"
								/>
							</div>
						{:else}
							<Loader />
						{/if}
					{/if}
				</div>
				<Button.Root type="submit" class="m-auto mt-3 block">{m.submit()}</Button.Root>
				<div class="absolute bottom-1 left-0 w-full">
					<p class="mb-2 px-2 text-center leading-4 text-(--red)">
						{createAssignment.result?.message}{errorText}
					</p>
				</div>
			</form>
		</div>
	{/if}
</div>
