<script lang="ts">
	import { resolve } from '$app/paths';
	import lang, { languageState as lS } from '$lib/lang.svelte';
</script>

<div>
	<h3 class="text-center">
		<a class="underline underline-offset-2" href={resolve('/help')}>{lang(lS, 'Help', 'Aide')}</a> → {lang(
			lS,
			'Create a Document',
			'Créer un Document'
		)}
	</h3>

	<h1 class="h1">{lang(lS, 'How to Create a Document', 'Comment Créer un Document')}</h1>
	{@html lang(
		lS,
		`
	<p>First, head to <b><i>Create a Document</i></b> in the sidebar.</p>
	`,
		`
	<p>En premier, allez à <b><i>Créer un Document</i></b> dans l'encadré.</p>
	`
	)}
</div>
