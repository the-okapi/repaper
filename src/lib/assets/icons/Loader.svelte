<script lang="ts">
	import loader from '$lib/assets/icons/loader.svg';

	let { size = 8 } = $props();
</script>

<img src={loader} alt="Loading Circle" class="absolute m-auto size-{size} animate-spin" />
