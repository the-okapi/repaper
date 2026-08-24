<script lang="ts">
	import space from '$lib/assets/space.jpg';

	let { ...props } = $props();
</script>

<div {...props}>
	<img src={space} alt="Space" class="h-screen w-screen opacity-20" />
</div>
