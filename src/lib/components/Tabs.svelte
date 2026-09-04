<script lang="ts">
	let { labels = [], snippets = [], ...props } = $props();

	let value = $state(0);
</script>

<div {...props}>
	<div data-tabs-list>
		<div
			data-tabs-active
			class="h-9 w-32"
			style={value === 0 ? 'left: 0.25rem' : 'left: 8.25rem'}
		></div>

		{#each labels as label, i (label)}
			<button data-tabs-trigger onclick={() => (value = i)}>
				{label}
			</button>
		{/each}
	</div>
	{@render snippets[value]()}
</div>
