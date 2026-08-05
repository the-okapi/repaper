<script lang="ts">
	import { Tabs } from 'bits-ui';

	let { labels = [], snippets = [], ...props } = $props();
</script>

<Tabs.Root value={labels[0]} {...props}>
	<Tabs.List>
		{#each labels as label (label)}
			<Tabs.Trigger value={label}>
				{label}
			</Tabs.Trigger>
		{/each}
	</Tabs.List>
	{#each { length: snippets.length }, i}
		<Tabs.Content value={labels[i]}>
			{@render snippets[i]()}
		</Tabs.Content>
	{/each}
</Tabs.Root>
