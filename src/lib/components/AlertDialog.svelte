<script lang="ts">
	import { Button } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';
	import { fade } from 'svelte/transition';

	let {
		open = $bindable(),
		children,
		go = null,
		cancel = true,
		message = m.cancel(),
		onclose = () => {},
		cancelOverride = false
	} = $props();

	function close() {
		open = false;
		onclose();
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			close();
		}
	}
</script>

<svelte:window {onkeydown} />

<div class="absolute z-50!">
	{#if open}
		<div data-alert-dialog-overlay transition:fade={{ duration: 100 }}></div>
		<div data-alert-dialog-content transition:fade={{ duration: 100 }}>
			{@render children?.()}
			{#if go}
				<div class="m-auto flex w-fit gap-4">
					{#if cancel}
						<Button.Root onclick={close} class="gray-button">{message}</Button.Root>
					{/if}
					{@render go()}
				</div>
			{:else if cancelOverride}
				<Button.Root onclick={close} class="gray-button m-auto block">{message}</Button.Root
				>
			{/if}
		</div>
	{/if}
</div>
