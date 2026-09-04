<script lang="ts">
	import Loader from '@lucide/svelte/icons/loader-circle';

	let { size = 30 } = $props();
</script>

<div class="m-auto animate-spin">
	<Loader {size} color="var(--p)" />
</div>
