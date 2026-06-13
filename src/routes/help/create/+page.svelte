<script lang="ts">
	import { resolve } from '$app/paths';
	import lang, { languageState as lS } from '$lib/lang.svelte';
	import English from '$lib/help/create/English.svelte';
	import French from '$lib/help/create/French.svelte';
</script>

<div>
	<h3 class="text-center">
		<a class="underline underline-offset-2" href={resolve('/help')}>{lang(lS, 'Help', 'Aide')}</a> → {lang(
			lS,
			'Create a Document',
			'Créer un Document'
		)}
	</h3>

	{#if lS.lang === 'en'}
		<English />
	{:else}
		<French />
	{/if}
</div>
