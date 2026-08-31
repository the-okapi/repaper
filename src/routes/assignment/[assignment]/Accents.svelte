<script lang="ts">
	import { Button } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';

	let { addAccent } = $props();
</script>

{#snippet button(accent: string)}
	<Button.Root class="icon-button ghost-button" onclick={() => addAccent(accent)}
		>{accent}</Button.Root
	>
{/snippet}

<h1 class="mb-4 text-center text-3xl font-bold">{m.accents()}</h1>

<div class="grid w-100 grid-cols-8">
	{@render button('À')}
	{@render button('à')}
	{@render button('Â')}
	{@render button('â')}
	{@render button('Ç')}
	{@render button('ç')}
	{@render button('È')}
	{@render button('è')}
	{@render button('É')}
	{@render button('é')}
	{@render button('Ê')}
	{@render button('ê')}
	{@render button('Ë')}
	{@render button('ë')}
	{@render button('Î')}
	{@render button('î')}
	{@render button('Ï')}
	{@render button('ï')}
	{@render button('Ô')}
	{@render button('ô')}
	{@render button('Ù')}
	{@render button('ù')}
	{@render button('Û')}
	{@render button('û')}
	{@render button('Ü')}
	{@render button('ü')}
</div>
<div class="h-5"></div>
