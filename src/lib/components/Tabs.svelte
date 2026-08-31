<script lang="ts">
	import { Tabs } from 'bits-ui';

	let { labels = [], snippets = [], triggerClass = '', contentClass = '', ...props } = $props();
</script>

<Tabs.Root {...props}>
	<Tabs.List>
		{#each labels as label (label)}
			<Tabs.Trigger class={triggerClass} value={label}>
				{label}
			</Tabs.Trigger>
		{/each}
	</Tabs.List>
	{#each { length: snippets.length }, i}
		<Tabs.Content value={labels[i]} class={contentClass}>
			{@render snippets[i]()}
		</Tabs.Content>
	{/each}
</Tabs.Root>
