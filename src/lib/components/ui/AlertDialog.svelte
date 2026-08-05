<script lang="ts">
	import { Button } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';

	let { open = $bindable(), children, go } = $props();

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
			{#if go !== null}
				<div class="m-auto flex w-fit gap-4">
					<Button.Root onclick={() => (open = false)}>{m.cancel()}</Button.Root>
					{@render go()}
				</div>
			{/if}
		</div>
	{/if}
</div>
