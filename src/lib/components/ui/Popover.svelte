<script lang="ts">
	import { Popover } from 'bits-ui';
	import { fade } from 'svelte/transition';

	let { trigger, children, border = true, open = $bindable(false) } = $props();
</script>

<div class="relative">
	<Popover.Root bind:open>
		<Popover.Trigger openDelay={400} openOnHover={true}>{@render trigger()}</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content
				class={border ? '' : 'border-none! bg-transparent! px-4 py-2'}
				forceMount
				side="right"
				sideOffset={border ? 10 : 1}
			>
				{#snippet child({ wrapperProps, props, open })}
					{#if open}
						<div {...wrapperProps}>
							<div {...props} transition:fade={{ duration: 50 }}>
								{@render children()}
							</div>
						</div>
					{/if}
				{/snippet}
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
</div>
