<script lang="ts">
	import Expand from '@lucide/svelte/icons/chevrons-up-down';
	import Check from '@lucide/svelte/icons/check';
	import { Combobox } from 'bits-ui';

	let { options, value = $bindable(), multiple = false, ...props } = $props();

	let searchValue = $state('');

	type Option = { label: string; value: string };

	const filteredOptions: Option[] = $derived(
		options
			.filter(
				(o: Option) =>
					o.label.toLowerCase().includes(searchValue.toLowerCase()) ||
					o.value.toLowerCase().includes(searchValue.toLowerCase())
			)
			.slice(0, 10)
	);
</script>

<Combobox.Root
	type={multiple ? 'multiple' : 'single'}
	{...props}
	bind:value
	onOpenChangeComplete={(o) => {
		if (!o) searchValue = '';
	}}
>
	<div class="relative">
		<label>
			<Combobox.Input
				defaultValue={value}
				oninput={(e) => (searchValue = e.currentTarget.value)}
			/>
			<Combobox.Trigger>
				<Expand size={20} />
			</Combobox.Trigger>
		</label>
	</div>
	<Combobox.Portal>
		<Combobox.Content data-select-content class="z-50 mt-2 w-48! border-0!">
			<Combobox.Viewport>
				{#each filteredOptions as option, i (option.value)}
					<Combobox.Item
						data-select-item
						value={option.value}
						label={option.label}
						class="w-48! hover:bg-(--fg)/5! {i === 0
							? 'rounded-t-xl border-t'
							: ''} {i === filteredOptions.length - 1
							? 'rounded-b-xl border-b'
							: ''} border-x border-(--o)"
					>
						{#snippet children({ selected })}
							<div class="z-60! flex w-fit">
								{#if selected}<Check size={20} class="m-auto mr-2" />{:else}<div
										class="mr-2 size-5"
									></div>{/if}
								{option.label}
							</div>
						{/snippet}
					</Combobox.Item>
				{/each}
			</Combobox.Viewport>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
