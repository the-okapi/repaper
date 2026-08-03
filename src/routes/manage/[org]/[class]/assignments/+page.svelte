<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { Button } from 'bits-ui';
	import { page } from '$app/state';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.title} | Repaper</title>
</svelte:head>

{#if data.assignments.length === 0}
	<div class="flex h-screen w-screen flex-col items-center justify-center">
		<p class="mb-10 w-100 text-center text-xl">{m.no_assignments()}</p>
		<Button.Root href={page.url.pathname.split('/assignments')[0]}>{m.back()}</Button.Root>
	</div>
{:else}
	<div class="grid grid-cols-3 gap-8 px-10 pt-25">
		{#each data.assignments as assignment (assignment.id)}
			<div class="rounded-xl border border-(--o) bg-(--bg)">{assignment.title}</div>
		{/each}
	</div>
{/if}
