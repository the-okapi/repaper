<script lang="ts">
	import { page } from '$app/state';
	import { getNavBarContext } from '$lib/context';

	let { children, data } = $props();

	const { setContent } = getNavBarContext();

	setContent(navBarContent);
</script>

{#snippet navBarContent()}
	{#if data.organization}
		<a href="/admin/{data.organization.id}" class="nav-bar-link">{data.organization.name}</a>
	{/if}
	<a href="/admin/account" class="nav-bar-link">{data.name}</a>
{/snippet}

<svelte:head>
	<title>{page.data.title} | Repaper</title>
</svelte:head>

{@render children()}
