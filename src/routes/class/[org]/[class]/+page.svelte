<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { Tabs } from '$lib/components';
	import { formatDate, type Assignment } from '$lib/util';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.title} | Repaper</title>
</svelte:head>

<div class="h-2"></div>
<a href="/home" class="relative ml-10 hover:underline">← {m.back()}</a>

<div class="relative">
	<div>
		<h2 class="mb-4 text-center text-4xl font-bold">{m.assignments()}</h2>
		{#snippet list(assignments: Assignment[])}
			<div class="mx-auto mt-4 grid w-fit grid-cols-3 gap-6">
				{#each assignments as a (a.id)}
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
		{/snippet}
		{#snippet toDo()}
			{@render list(data.upcomingAssignments)}
			{#if data.upcomingAssignments.length === 0}
				<p class="mt-4 text-center text-lg">{m.no_assignments_here()}</p>
			{/if}
		{/snippet}
		{#snippet submitted()}
			{@render list(data.submittedAssignments)}
			{#if data.submittedAssignments.length === 0}
				<p class="mt-4 text-center text-lg">{m.no_assignments_here()}</p>
			{/if}
		{/snippet}
		<Tabs
			labels={[m.to_do(), m.submitted()]}
			value={m.to_do()}
			snippets={[toDo, submitted]}
			class="assignment-tabs"
		/>
	</div>
</div>
