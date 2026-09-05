<script lang="ts">
	import Loader from '@lucide/svelte/icons/loader-circle';

	let { size = 30, color = 'var(--p)' } = $props();
</script>

<div class="m-auto animate-spin">
	<Loader {size} {color} />
</div>
