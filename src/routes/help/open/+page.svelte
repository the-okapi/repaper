<script lang="ts">
	import { resolve } from '$app/paths';
	import lang, { languageState as lS } from '$lib/lang.svelte';
</script>

<svelte:head>
	<title
		>{lang(lS, 'How to Open a Document - Repaper', 'Comment Ouvrir un Document - Repaper')}</title
	>
</svelte:head>

<h3>
	<a class="underline underline-offset-2" href={resolve('/help')}>{lang(lS, 'Help', 'Aide')}</a> → {lang(
		lS,
		'Open a Document',
		'Ouvrir un Document'
	)}
</h3>
