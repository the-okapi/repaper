<script lang="ts">
	let { open = $bindable(), children } = $props();

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			open = false;
		}
	}
</script>

<svelte:window {onkeydown} />

<div class="absolute z-50!">
	{#if open}
		<div data-alert-dialog-overlay></div>
		<div data-alert-dialog-content>
			{@render children?.()}
		</div>
	{/if}
</div>
