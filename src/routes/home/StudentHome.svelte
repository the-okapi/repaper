<script lang="ts">
	import { Loader } from '$lib/components';
	import { loadStudent, loadAssignments } from './load.remote';
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import type { Assignment } from '$lib/util';
	import { formatDate } from '$lib/util';

	let { organization } = $props();

	let assignments: Assignment[] = $state([]);

	onMount(async () => {
		const a = await loadAssignments();
		assignments = a;
	});
</script>

{#await loadStudent()}
	<div class="fixed top-0 left-0 flex h-screen w-screen items-center justify-center">
		<Loader />
	</div>
{:then userData}
	<div class="grid grid-cols-[1fr_2fr] gap-28 px-20 pt-24 pb-10">
		<div>
			<h2 class="mb-4 text-center text-3xl font-bold">Classes</h2>
			{#each userData.classes as classMembership (classMembership.id)}
				<div class="box relative p-0!">
					<a
						class="flex h-full w-full cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-(--fg)/10"
						href="/class/{organization}/{classMembership.class.id}"
					>
						<div class="w-fit text-center">
							<h3 class="text-3xl font-bold">{classMembership.class.name}</h3>
							{#if assignments.length !== 0}
								{let numAssignments = assignments.filter(
									(a: Assignment) => a.assignment.class
								).length}
								<p>{numAssignments} {m.assignments()}</p>
							{:else}
								<p>_ {m.assignments()}</p>
							{/if}
						</div>
						<div class="absolute bottom-2 w-full text-center">
							<p>{m.go_to()} {m.class()}</p>
						</div>
					</a>
				</div>
			{/each}
		</div>
		<div class="pb-14">
			{#if assignments.length === 0}
				<div class="flex h-full w-full items-center justify-center">
					<Loader />
				</div>
			{:else}
				<div>
					<h2 class="mb-4 text-center text-3xl font-bold">{m.assignments()}</h2>
					<div class="grid grid-cols-2 gap-7">
						{#each assignments as a (a.id)}
							{let { assignment } = a}
							<div class="box relative p-0!">
								<a
									class="flex h-full w-full cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-(--fg)/10"
									href="/assignment/{assignment.id}"
								>
									<div class="relative w-fit text-center">
										{#if new Date() > new Date(assignment.due_date)}
											<div class="absolute -top-8 w-full">
												<p
													class="badge mx-auto mb-4 w-fit! bg-(--red) px-5!"
												>
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
				</div>
			{/if}
		</div>
	</div>
{/await}
