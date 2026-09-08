<script lang="ts">
	import { page } from '$app/state';
	import { DropdownMenu } from 'bits-ui';
	import { getNavBarContext } from '$lib/context';
	import { m } from '$lib/paraglide/messages';
	import Expand from '@lucide/svelte/icons/chevrons-up-down';
	import Dropdown from '$lib/components/Dropdown.svelte';

	let { children, data, params } = $props();

	const { setContent } = getNavBarContext();

	setContent(navBarContent);

	const options = $derived([
		...data.classes,
		{
			value: 'create',
			label: '<em>' + m.create_class() + '</em>'
		}
	]);
</script>

{#snippet navBarContent()}
	{#if data.organization}
		<div class="flex items-center gap-2">
			<p>
				{(options.find((a) => a.value === params.class) ?? { label: m.select_a_class() })
					.label}
			</p>
			<Dropdown>
				{#snippet trigger()}
					<DropdownMenu.Trigger>
						<Expand size={20} />
					</DropdownMenu.Trigger>
				{/snippet}
				{#each options as option, i (option.value)}
					<DropdownMenu.Item
						data-select-item
						class="border-x border-(--o) hover:bg-(--a)! {i === 0
							? 'rounded-t-xl border-t'
							: ''} {i === options.length - 1 ? 'rounded-b-xl border-b' : ''}"
						><a href="/admin/{data.organization.id}/{option.value}"
							>{@html option.label}</a
						></DropdownMenu.Item
					>
				{/each}
			</Dropdown>
		</div>
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
