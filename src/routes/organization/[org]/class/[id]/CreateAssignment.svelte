<script lang="ts">
	import { Loader, Switch, Combobox } from '$lib/components';
	import { createAssignment, getStudents } from './server.remote';
	import { Label, Button } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';

	let loading = $state(false);
	let everyone = $derived(createAssignment.result?.everyone ?? true);

	let students: { label: string; value: string }[] = $state([]);

	async function loadStudents() {
		if (everyone === false && students.length === 0) {
			const result = await getStudents(page.params.id ?? '');
			students = result.students;
		}
	}

	let selectedStudents = $state([]);

	let errorText = $state('');
</script>

<div
	class="relative flex h-full w-full items-center justify-center rounded-xl border border-(--o) bg-(--bg) p-5"
>
	{#if loading}
		<Loader />
	{:else}
		<div class="flex h-full w-full flex-col items-center">
			<h1 class="mb-5 text-center text-2xl font-bold">{m.create_assignment()}</h1>
			<form
				{...createAssignment.enhance(async (form: any) => {
					if (!everyone && selectedStudents.length === 0) {
						errorText = m.please_select_student();
						return;
					}
					loading = true;
					await form.submit();
					loading = false;
				})}
				class="w-60"
			>
				<div class="mb-3 w-fit">
					<Label.Root>{m.name()}:</Label.Root><br />
					<input
						value={createAssignment.result?.name}
						class="w-60"
						name="name"
						required
					/>
				</div>
				<div class="mb-3">
					<Label.Root>Description:</Label.Root>
					<textarea
						value={createAssignment.result?.description}
						class="h-40 w-60"
						maxlength={500}
						name="description"
						required></textarea>
				</div>
				<div class="flex w-fit justify-center gap-4">
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
				<div class="mt-4 flex h-25 w-full items-center justify-center">
					{#if !everyone}
						{#if students.length > 0}
							<div>
								<Combobox
									options={students}
									multiple
									bind:value={selectedStudents}
								/>
								<p class="text-center">
									{selectedStudents.length}
									{m.students_selected({
										s: selectedStudents.length !== 1 ? 's' : ''
									})}
								</p>
								<input
									type="hidden"
									value={JSON.stringify(selectedStudents)}
									name="students"
								/>
								<div class="absolute left-0 w-full text-center">
									<p class="text-(--red)">{errorText}</p>
								</div>
							</div>
						{:else}
							<Loader />
						{/if}
					{/if}
				</div>
				<div class="absolute bottom-7 left-0 w-full">
					<Button.Root type="submit" class="m-auto block">{m.go()}</Button.Root>
				</div>
			</form>
		</div>
	{/if}
</div>
