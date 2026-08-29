<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
</script>

<div class="h-2"></div>
<a
	href="/manage/{page.params.org}/{page.params.class}/assignments"
	class="fixed top-20 left-6 z-50 cursor-pointer text-sm hover:underline">← {m.back()}</a
>

<p class="absolute right-0 mt-3 w-[calc(100vw-26.25rem)] text-center text-xl">
	{m.select_student()}
</p>
