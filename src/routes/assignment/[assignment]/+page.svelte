<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { formatDate } from '$lib/util';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.title} | Repaper</title>
</svelte:head>

<div class="h-22"></div>
<a href="/home" class="relative ml-10 hover:underline">← {m.back()}</a>
{#if !data.assignment.submitted}
	<div class="relative m-auto w-fit">
		<div class="flex">
			{#if new Date() > new Date(data.assignment.due_date)}
				<div class="badge w-fit! bg-(--red) px-5!">{m.late()}</div>
			{/if}
			<p class="my-auto ml-3">
				{m.due_date()}: <i>{formatDate(data.assignment.due_date)}</i>
			</p>
		</div>
	</div>
{/if}
