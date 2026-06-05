<script lang="ts">
	import { LinkButton } from '$lib/components';
	import lang, { languageState as lS } from '$lib/lang.svelte';
</script>

<div>
	<h1 class="h1">{lang(lS, 'Repaper Help', 'Aide pour Repaper')}</h1>

	<div class="flex gap-5">
		<LinkButton href="/help/create">{lang(lS, 'Create a Document', 'Créer un Document')}</LinkButton
		>
		<LinkButton href="/help/open">{lang(lS, 'Open a Document', 'Ouvrir un Document')}</LinkButton>
		<LinkButton href="/help/share"
			>{lang(lS, 'Share a Document', 'Partager un Document')}</LinkButton
		>
	</div>
</div>
