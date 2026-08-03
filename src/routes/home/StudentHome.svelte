<script lang="ts">
	import { Loader } from '$lib/components';
	import { loadStudent, loadAssignments } from './load.remote';
</script>

{#await loadStudent()}
	<div class="fixed top-0 left-0 flex h-screen w-screen items-center justify-center">
		<Loader />
	</div>
{:then userData}
	<div class="grid grid-cols-[1fr_2fr] gap-7 px-20 pt-24 pb-10">
		<div>
			{#each userData.classes as classMembership (classMembership.id)}
				<div class="box">
					{classMembership.class.name}
				</div>
			{/each}
		</div>
		{#await loadAssignments()}
			<div class="flex h-full w-full items-center justify-center">
				<Loader />
			</div>
		{:then assignments}
			<div class="grid grid-cols-2 gap-7">
				{#each assignments as assignment (assignment.id)}
					<div class="box">
						<p>{assignment.assignment.name}, {assignment.assignment.due_date}</p>
					</div>
				{/each}
			</div>
		{/await}
	</div>
{/await}
