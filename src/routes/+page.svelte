<script>
	import { text } from '$lib/background';
	import { Recents } from '$lib/components';
	import lang, { languageState } from '$lib/lang.svelte';
	import { onMount } from 'svelte';

	let length = $state(0);

	onMount(() => {
		const recentDocuments = localStorage.getItem('repaper-recent-documents');
		if (recentDocuments) {
			length = JSON.parse(recentDocuments).length;
		} else {
			length = 0;
		}
	});
</script>

<div class="fixed inset-0 left-70 z-40 flex items-center justify-center">
	<div>
		<h1 class="rounded-2xl p-5 text-8xl font-black">Repaper</h1>
		{#if length > 0}
			<div class="m-auto mt-6.5 h-fit w-fit rounded-xl border border-(--fg)/30 bg-(--bg) p-4">
				<h2 class="mb-3 text-center text-lg font-bold">
					{lang(languageState, 'Recent Documents', 'Documents Récents')}
				</h2>
				<Recents limit={4} />
			</div>
		{/if}
	</div>
</div>
<div class="block h-screen w-full overflow-hidden text-justify opacity-50">
	<p class="w-full">{text(lang(languageState, 'a', 'b'))}</p>
</div>
