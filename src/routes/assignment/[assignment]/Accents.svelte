<script lang="ts">
	import { Button } from 'bits-ui';
	import { Tabs } from '$lib/components';

	let { addAccent } = $props();
</script>

{#snippet button(accent: string)}
	<Button.Root class="icon-button" onclick={() => addAccent(accent)}>{accent}</Button.Root>
{/snippet}

{#snippet a()}
	{@render button('À')}
	{@render button('à')}
	{@render button('Â')}
	{@render button('â')}
{/snippet}
{#snippet c()}
	{@render button('Ç')}
	{@render button('ç')}
{/snippet}
{#snippet e()}
	{@render button('È')}
	{@render button('è')}
	{@render button('É')}
	{@render button('é')}
	{@render button('Ê')}
	{@render button('ê')}
	{@render button('Ë')}
	{@render button('ë')}
{/snippet}
{#snippet i()}
	{@render button('Î')}
	{@render button('î')}
	{@render button('Ï')}
	{@render button('ï')}
{/snippet}
{#snippet o()}
	{@render button('Ô')}
	{@render button('ô')}
{/snippet}
{#snippet u()}
	{@render button('Ù')}
	{@render button('ù')}
	{@render button('Û')}
	{@render button('û')}
	{@render button('Ü')}
	{@render button('ü')}
{/snippet}

<Tabs
	labels={['A', 'C', 'E', 'I', 'O', 'U']}
	value="A"
	class="w-100"
	contentClass="flex justify-center gap-2"
	snippets={[a, c, e, i, o, u]}
/>
<div class="h-5"></div>
