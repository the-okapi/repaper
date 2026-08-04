<script lang="ts">
	import type { PageProps } from './$types';
	import AdminHome from './AdminHome.svelte';
	import StudentHome from './StudentHome.svelte';
	import { m } from '$lib/paraglide/messages';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>{m.home()} | Repaper</title>
</svelte:head>

{#if data.admin}
	<AdminHome {form} />
{:else}
	<StudentHome organization={data.organization} />
{/if}
