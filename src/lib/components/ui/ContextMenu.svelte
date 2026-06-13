<script lang="ts">
	import { ContextMenu } from 'bits-ui';

	let { children, actions, ...props } = $props();
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger {...props}>
		{@render children()}
	</ContextMenu.Trigger>

	{#if actions.length > 0}
		<ContextMenu.Portal>
			<ContextMenu.Content class="z-50 bg-(--bg) border-(--o) border rounded-md">
				{#each actions as action, i (i)}
					<ContextMenu.Item
						onclick={action.action}
						class="px-2 py-0.5 cursor-pointer m-1 hover:bg-(--fg)/5"
						>{action.label}</ContextMenu.Item
					>
				{/each}
			</ContextMenu.Content>
		</ContextMenu.Portal>
	{/if}
</ContextMenu.Root>
