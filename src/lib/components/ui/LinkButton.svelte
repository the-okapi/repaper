<script lang="ts">
	let { href, children } = $props();
</script>

<a
	{href}
	class="p-8 border rounded-xl text-xl m-auto block w-fit hover:bg-[#00000005] hover:shadow-xl"
>
	{@render children()}
</a>
