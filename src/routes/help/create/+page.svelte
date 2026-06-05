<script lang="ts">
	import { resolve } from '$app/paths';
	import lang, { languageState as lS } from '$lib/lang.svelte';
</script>

<h3>
	<a class="underline underline-offset-2" href={resolve('/help')}>{lang(lS, 'Help', 'Aide')}</a> → {lang(
		lS,
		'Create a Document',
		'Créer un Document'
	)}
</h3>
