<script lang="ts">
	import { resolve } from '$app/paths';
	import lang, { languageState as lS } from '$lib/lang.svelte';
</script>

<svelte:head>
	<title
		>{lang(
			lS,
			'How to Share a Document - Repaper',
			'Comment Partager un Document - Repaper'
		)}</title
	>
</svelte:head>

<h3>
	<a class="underline underline-offset-2" href={resolve('/help')}>{lang(lS, 'Help', 'Aide')}</a> → {lang(
		lS,
		'Share a Document',
		'Partager un Document'
	)}
</h3>
