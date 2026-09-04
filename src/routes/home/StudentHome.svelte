<script lang="ts">
	import Loader from '$lib/components/Loader.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import { loadStudent, loadAssignments } from './load.remote';
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import { formatDate, type Assignment } from '$lib/util';

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
	<div class="grid grid-cols-[1fr_2fr] gap-28 px-20 pt-4 pb-10">
		<div>
			{#if userData.classes.length > 0}
				<h2 class="mb-4 text-center text-3xl font-bold">Classes</h2>
				{#each userData.classes as classMembership (classMembership.id)}
					<div class="box relative p-0!">
						<a
							class="flex h-full w-full cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-(--a)"
							href="/class/{organization}/{classMembership.class.id}"
						>
							<div class="w-fit text-center">
								<h3 class="text-3xl font-bold">{classMembership.class.name}</h3>
								{#if assignments.length !== 0}
									{let numAssignments = $derived(
										assignments.filter((a: Assignment) => a.assignment.class)
											.length
									)}
									<p>
										{numAssignments}
										{m.assignment()}{numAssignments === 1 ? '' : 's'}
									</p>
								{:else}
									<p>0 {m.assignment()}s</p>
								{/if}
							</div>
							<div class="absolute bottom-2 w-full text-center">
								<p>{m.go_to()} {m.class()}</p>
							</div>
						</a>
					</div>
				{/each}
			{/if}
		</div>
		<div class="pb-14">
			<h2 class="mb-4 text-center text-3xl font-bold">{m.assignment()}s</h2>
			{#snippet list(assignmentsFiltered: Assignment[])}
				<div class="grid grid-cols-2 gap-6">
					{#each assignmentsFiltered as a (a.id)}
						{let assignment = {
							subId: a.id,
							id: a.assignment.id,
							name: a.assignment.name,
							description: a.assignment.description,
							due_date: a.assignment.due_date,
							class: a.assignment.class,
							submitted: a.submitted
						}}
						<div class="box relative p-0!">
							<a
								class="flex h-full w-full cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-(--a)"
								href="/assignment/{assignment.subId}"
							>
								<div class="relative w-fit text-center">
									{#if a.submitted}
										<div class="absolute -top-8 w-full">
											<p
												class="badge mx-auto mb-4 w-fit! bg-(--p) px-5! text-(--p-fg)"
											>
												{m.submitted()}
											</p>
										</div>
									{:else if new Date() > new Date(assignment.due_date)}
										<div class="absolute -top-8 w-full">
											<p class="badge mx-auto mb-4 w-fit! bg-(--r) px-5!">
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
			{/snippet}
			{#snippet toDo()}
				{let assignmentsFiltered = $derived(
					assignments.filter((a: Assignment) => a.submitted === null)
				)}
				{@render list(assignmentsFiltered)}
				{#if assignmentsFiltered.length === 0}
					<p class="mt-4 text-center text-lg">{m.no_assignments_here()}</p>
				{/if}
			{/snippet}
			{#snippet submitted()}
				{let assignmentsFiltered = $derived(
					assignments.filter((a: Assignment) => a.submitted !== null)
				)}
				{@render list(assignmentsFiltered)}
				{#if assignmentsFiltered.length === 0}
					<p class="mt-4 text-center text-lg">{m.no_assignments_here()}</p>
				{/if}
			{/snippet}
			<Tabs labels={[m.to_do(), m.submitted()]} snippets={[toDo, submitted]} />
		</div>
	</div>
{/await}
