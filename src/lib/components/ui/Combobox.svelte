<script lang="ts">
	import expand from '$lib/assets/icons/expand.svg';
	import check from '$lib/assets/icons/check.svg';
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
				<img src={expand} alt="Open the select menu" class="size-5 cursor-pointer" />
			</Combobox.Trigger>
		</label>
	</div>
	<Combobox.Portal>
		<Combobox.Content data-select-content class="z-50 mt-2 w-48! border-0!">
			<Combobox.Viewport>
				{#each filteredOptions as option, i (i)}
					<Combobox.Item
						data-select-item
						value={option.label}
						class="w-48! hover:bg-(--fg)/5! {i === 0
							? 'rounded-t-xl border-t'
							: ''} {i === filteredOptions.length - 1
							? 'rounded-b-xl border-b'
							: ''} border-x"
					>
						{#snippet children({ selected })}
							<div class="z-60! flex w-fit">
								{#if selected}<img
										src={check}
										class="my-auto mr-2 size-5"
										alt="A checkmark"
									/>{:else}<img
										src={check}
										class="my-auto mr-2 size-5 opacity-0"
										alt="Nothing"
									/>{/if}
								{option.label}
							</div>
						{/snippet}
					</Combobox.Item>
				{/each}
			</Combobox.Viewport>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
