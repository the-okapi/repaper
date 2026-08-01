<script lang="ts">
	import { Button } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';
</script>

<svelte:head>
	<title>{m.something_happened()} | Repaper</title>
</svelte:head>

<div class="flex h-screen w-screen items-center justify-center">
	<div class="h-fit text-center">
		<h1 class="mb-5">{m.something_happened()}</h1>
		<Button.Root class="m-auto" href="/home">{m.home()}</Button.Root>
	</div>
</div>
