<script lang="ts">
	import { Popover } from 'bits-ui';
	import { fade } from 'svelte/transition';

	let { trigger, children, border = true, open = $bindable(false) } = $props();
</script>

<div class="relative">
	<Popover.Root bind:open>
		<Popover.Trigger openDelay={400} openOnHover>{@render trigger()}</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content
				class={border ? '' : 'border-none! bg-transparent! p-0! shadow-none!'}
				forceMount
				side="right"
				sideOffset={10}
			>
				{#snippet child({ wrapperProps, props, open })}
					{#if open}
						<div {...wrapperProps}>
							<div {...props} transition:fade={{ duration: 100 }}>
								{@render children()}
							</div>
						</div>
					{/if}
				{/snippet}
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
</div>
