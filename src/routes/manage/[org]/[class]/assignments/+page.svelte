<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { Button } from 'bits-ui';
	import { page } from '$app/state';
	import { formatDate } from '$lib/util';

	let { data } = $props();
</script>

{#if data.assignments.length === 0}
	<div class="flex h-screen w-screen flex-col items-center justify-center">
		<p class="mb-10 w-100 text-center text-xl">{m.no_assignments()}</p>
		<Button.Root href="/manage/{page.params.org}/{page.params.class}">{m.back()}</Button.Root>
	</div>
{:else}
	<div class="h-22"></div>
	<a href="/manage/{page.params.org}/{page.params.class}" class="relative ml-10 hover:underline"
		>← {m.back()}</a
	>
	<div class="mt-2 grid grid-cols-3 gap-8 px-2">
		{#each data.assignments as assignment (assignment.id)}
			<div class="box relative p-0!">
				<a
					class="flex h-full w-full cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-(--fg)/10"
					href="/manage/{page.params.org}/{page.params.class}/assignments/{assignment.id}"
				>
					<div class="relative w-fit text-center">
						{#if new Date() > new Date(assignment.due_date)}
							<div class="absolute -top-8 w-full">
								<p class="badge mx-auto mb-4 w-fit! bg-(--red) px-5!">
									{m.late()}
								</p>
							</div>
						{/if}
						<p class="italic">{formatDate(assignment.due_date)}</p>
						<h3 class="text-center text-2xl font-semibold">
							{assignment.name}
						</h3>
						<p class="px-8">{assignment.description}</p>
					</div>
					<div class="absolute bottom-2 left-0 w-full text-center">
						<p>
							{m.go_to_m()}
							{m.assignment()}
						</p>
					</div>
				</a>
			</div>
		{/each}
	</div>
{/if}
