<script lang="ts">
	import { page } from '$app/state';
	import SelectComponent from '$lib/components/Select.svelte';
	import { Select } from 'bits-ui';
	import { getNavBarContext } from '$lib/context';
	import { m } from '$lib/paraglide/messages';
	import Expand from '@lucide/svelte/icons/chevrons-up-down';

	let { children, data } = $props();

	const { setContent } = getNavBarContext();

	setContent(navBarContent);
</script>

{#snippet navBarContent()}
	{#if data.organization}
		<SelectComponent
			options={[
				{
					value: 'a',
					label: 'a'
				}
			]}
			placeholder={m.select_a_class()}
		>
			{#snippet trigger(text: string)}
				<Select.Trigger
					class="m-0! flex! w-fit! items-center gap-2 border-none! p-0! shadow-none!"
				>
					<p>{text}</p>
					<Expand size={20} />
				</Select.Trigger>
			{/snippet}
		</SelectComponent>
		<p>—</p>
		<a href="/admin/{data.organization.id}" class="nav-bar-link">{data.organization.name}</a>
		<p>—</p>
	{/if}
	<a href="/admin/account" class="nav-bar-link">{data.name}</a>
{/snippet}

<svelte:head>
	<title>{page.data.title} | Repaper</title>
</svelte:head>

{@render children()}
