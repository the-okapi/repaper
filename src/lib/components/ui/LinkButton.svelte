<script lang="ts">
	// Translated
	let { href, children } = $props();
</script>

<a {href} class="p-8 border border-(--o) rounded-xl text-xl m-auto block w-fit hover:bg-(--fg)/5">
	{@render children()}
</a>
