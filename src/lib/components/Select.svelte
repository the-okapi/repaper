<script lang="ts">
	import type { SelectItemType } from '$lib/util';
	import { Select } from 'bits-ui';
	import Expand from '@lucide/svelte/icons/chevrons-up-down';
	import Check from '@lucide/svelte/icons/check';
	import { fade } from 'svelte/transition';

	let {
		options,
		value = $bindable(),
		onChange = () => {},
		class: c = '',
		placeholder = '',
		trigger = null,
		check = true,
		...props
	} = $props();

	const selectedOptionLabel = $derived(
		options.find((option: SelectItemType) => option.value === value)
	);

	function onC(v: string) {
		value = v;
		onChange(v);
	}
</script>

<Select.Root bind:value onValueChange={onC} type="single" {...props}>
	{#if trigger}
		{@render trigger(selectedOptionLabel?.label ?? placeholder)}
	{:else}
		<Select.Trigger class={c}
			><div class="flex items-center text-left">
				<div class="flex gap-2">
					{@html selectedOptionLabel?.label ?? placeholder}
				</div>
			</div>
			<div class="text-right">
				<div class="inline-flex h-full items-center">
					<Expand size={20} />
				</div>
			</div></Select.Trigger
		>
	{/if}
	<Select.Portal>
		<Select.Content sideOffset={5} class="z-50" forceMount>
			{#snippet child({ wrapperProps, props, open })}
				{#if open}
					<div {...wrapperProps}>
						<div {...props} transition:fade={{ duration: 100 }}>
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
												{#if check}
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
												{:else}
													{@html option.label}
												{/if}
											</div>
										{/snippet}
									</Select.Item>
								{/each}
							</Select.Viewport>
						</div>
					</div>
				{/if}
			{/snippet}
		</Select.Content>
	</Select.Portal>
</Select.Root>
