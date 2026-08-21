<script lang="ts">
	import { Slider } from 'bits-ui';

	let { value = $bindable(50), ...props } = $props();
</script>

<Slider.Root type="single" class="relative flex w-80 items-center" {...props} bind:value>
	<span class="h-2 w-full cursor-pointer rounded-full bg-(--s)">
		<Slider.Range class="absolute h-2 rounded-full bg-(--p)" />
	</span>
	<Slider.Thumb index={0} class="block h-5 w-6 cursor-pointer rounded-xl bg-(--p)" />
</Slider.Root>
