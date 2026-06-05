<script lang="ts">
	import { Loading } from '$lib/components';
	import { onMount } from 'svelte';
	import type { DocumentLink } from '$lib';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import lang, { languageState as lS } from '$lib/lang.svelte';

	let { size = 'w-80 h-fit', limit = 10, empty = false } = $props();

	let loading = $state(true);

	let recents: DocumentLink[] = $state([]);

	onMount(() => {
		const recentDocuments = localStorage.getItem('repaper-recent-documents');
		if (recentDocuments) {
			recents = JSON.parse(recentDocuments);
		}
		if (recents.length > limit) {
			recents = recents.slice(0, limit);
		}
		loading = false;
	});

	function click(index: number) {
		const document = recents[index];
		localStorage.setItem('repaper-token', document.token);
		goto(resolve(document.link));
	}

	function remove(index: number) {
		recents.splice(index, 1);
		localStorage.setItem('repaper-recent-documents', JSON.stringify(recents));
	}
</script>

<Loading show={loading} />

<div class="m-auto w-fit">
	{#if recents.length < 1}
		{#if empty}
			<p class="text-center text-lg">
				{lang(lS, 'Open a document to get started.', 'Ouvrir un document pour commencer.')}
			</p>
		{/if}
	{:else}
		<div class="{size} flex">
			{#each recents as document, i (i)}
				<button
					onclick={() => click(i)}
					class="m-auto w-full cursor-pointer border-(--o) p-3 hover:bg-(--fg)/5 {i === 0
						? 'rounded-t-lg'
						: ''} {i === recents.length - 1 ? 'rounded-b-lg border' : ' border-x border-t'}"
					><span class="font-semibold">{document.title}</span> - {document.mode === 'viewer'
						? 'View'
						: 'Edit'}</button
				>
				<button
					onclick={() => remove(i)}
					class="m-auto font-black ml-1.5 cursor-pointer border border-[#00000000] hover:border-(--o) h-9 w-10 rounded-md"
					>X</button
				>
			{/each}
		</div>
	{/if}
</div>
