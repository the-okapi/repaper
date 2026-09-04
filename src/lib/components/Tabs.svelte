<script lang="ts">
	let { labels = [], snippets = [], width = 32, height = 9, ...props } = $props();

	let value = $state(0);
</script>

<div {...props}>
	<div data-tabs-list>
		<div
			data-tabs-active
			class="h-{height} w-{width}"
			style={value === 0 ? 'left: 0.25rem' : 'left: ' + (width + 1) / 4 + 'rem'}
		></div>

		{#each labels as label, i (label)}
			<button data-tabs-trigger class="w-{width}" onclick={() => (value = i)}>
				{label}
			</button>
		{/each}
	</div>
	{@render snippets[value]()}
</div>
