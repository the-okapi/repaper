<script lang="ts">
	import { Slider, Document } from '$lib/components';
	import { m } from '$lib/paraglide/messages';
	import { formatDate } from '$lib/util';

	let { content, children, submitted } = $props();

	let zoom = $state(95);
</script>

<div class="relative mx-auto flex w-fit items-center gap-5 pt-10">
	<p>{m.submitted()} <strong>{formatDate(submitted)}</strong></p>
	<div class="relative mx-auto">
		<p class="absolute -top-7">Zoom:</p>
		<Slider bind:value={zoom} min={10} max={200} />
	</div>
	{@render children()}
</div>

<Document {zoom} {content} />
