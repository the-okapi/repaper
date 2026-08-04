<script lang="ts">
	import { Loader } from '$lib/components';
	import { loadStudent, loadAssignments } from './load.remote';
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import type { Assignment } from '$lib/types';
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
	<div class="grid grid-cols-[1fr_2fr] gap-20 px-20 pt-24 pb-10">
		<div>
			<h2 class="mb-4 text-center text-3xl font-bold">Classes</h2>
			{#each userData.classes as classMembership (classMembership.id)}
				<div class="box p-0!">
					<a
						class="flex h-full w-full cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-(--fg)/10"
						href="/class/{organization}/{classMembership.class.id}"
					>
						<div class="w-fit text-center">
							<h3 class="text-2xl font-bold">{classMembership.class.name}</h3>
							<p>{m.go_to()} {m.class()}</p>
							<br />
							{#if assignments.length !== 0}
								{let numAssignments = assignments.filter(
									(a: Assignment) => a.assignment.class
								).length}
								<p>{numAssignments} {m.assignments()}</p>
							{:else}
								<p>_ {m.assignments()}</p>
							{/if}
						</div>
					</a>
				</div>
			{/each}
		</div>
		<div class="relative pb-14">
			<div class="absolute -left-10.5 h-full border-r border-(--o)"></div>
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
							<div class="box p-0!">
								<a
									class="flex h-full w-full cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-(--fg)/10"
									href="/assignment/{assignment.id}"
								>
									<div class="relative w-fit text-center">
										<p>
											{m.due()}:
											<strong
												>{formatDate(assignment.due_date)}
												{#if new Date() > new Date(assignment.due_date)}
													<span class="text-(--red)">
														{m.late()}
													</span>
												{/if}
											</strong>
										</p>
										<h3 class="text-center text-2xl font-bold">
											{assignment.name}
										</h3>
										<p>
											{m.go_to_m()}
											{m.assignment()}
										</p>
										<br />
										<p class="px-8">{assignment.description}</p>
										<br />
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
