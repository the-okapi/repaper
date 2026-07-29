<script lang="ts">
	let { open = $bindable(), children } = $props();
</script>

<div class="absolute z-50!">
	{#if open}
		<div data-alert-dialog-overlay></div>
		<div data-alert-dialog-content>
			{@render children?.()}
		</div>
	{/if}
</div>
