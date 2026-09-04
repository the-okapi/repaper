<script lang="ts">
	import type { SelectItemType } from '$lib/util';
	import { Select } from 'bits-ui';
	import Expand from '@lucide/svelte/icons/chevrons-up-down';
	import Check from '@lucide/svelte/icons/check';

	let { options, value = $bindable(), onChange = () => {} } = $props();

	const selectedOptionLabel = $derived(
		options.find((option: SelectItemType) => option.value === value)
	);

	function onC(v: string) {
		value = v;
		onChange();
	}
</script>

<Select.Root bind:value onValueChange={onC} type="single">
	<Select.Trigger
		><div class="flex items-center text-left">
			<div class="flex gap-2">
				{@html selectedOptionLabel?.label}
			</div>
		</div>
		<div class="text-right">
			<div class="inline-flex h-full items-center">
				<Expand size={20} />
			</div>
		</div></Select.Trigger
	>
	<Select.Portal>
		<Select.Content sideOffset={5} class="z-50">
			<Select.Viewport>
				{#each options as option, i (i + option.value)}
					<Select.Item
						value={option.value}
						label={option.label}
						class="z-50 {i === 0 ? 'rounded-t-xl border-t' : ''} {i ===
						options.length - 1
							? 'rounded-b-xl border-b'
							: ''} border-x border-(--o) bg-(--bg) hover:bg-(--fg)/5!"
					>
						{#snippet children({ selected })}
							<div class="relative flex">
								{#if selected}
									<Check size={20} class="my-auto mr-2" />
									<div class="flex gap-2">
										{@html option.label}
									</div>
								{:else}
									<div class="relative left-7 flex gap-2">
										{@html option.label}
									</div>
								{/if}
							</div>
						{/snippet}
					</Select.Item>
				{/each}
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
