<script lang="ts">
	import { Recents } from '$lib/components';
	import { resolve } from '$app/paths';
	import lang, { languageState as lS } from '$lib/lang.svelte';
</script>

<div>
	<h1 class="h1">{lang(lS, 'Recent Documents', 'Documents Récents')}</h1>
	<Recents empty={true} />
	<p class="m-auto mt-6 w-fit text-center">
		{lang(
			lS,
			"If the document you're looking for is not here, try opening it",
			"Si le document que vous cherchez n'est pas ici, essayez de l'ouvrir"
		)}
		<a href={resolve('/open')} class="text-center underline underline-offset-2"
			>{lang(lS, 'here', 'ici')}</a
		>.
	</p>
</div>
