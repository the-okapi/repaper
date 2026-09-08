<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import { fade } from 'svelte/transition';

	let { trigger, children } = $props();
</script>

<DropdownMenu.Root>
	{@render trigger()}
	<DropdownMenu.Portal>
		<DropdownMenu.Content sideOffset={10} forceMount data-select-content>
			{#snippet child({ wrapperProps, props, open })}
				{#if open}
					<div {...wrapperProps}>
						<div {...props} transition:fade={{ duration: 100 }}>
							{@render children()}
						</div>
					</div>
				{/if}
			{/snippet}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
