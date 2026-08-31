<script lang="ts">
	import { Button } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';
	import { AlertDialog } from '$lib/components';
</script>

<svelte:window {onbeforeunload} />

<svelte:head>
	<title>{m.something_happened()} | Repaper</title>
</svelte:head>

<div class="flex h-[calc(100vh-5rem)] w-screen items-center justify-center">
	<div class="h-fit text-center">
		<AlertDialog open cancel={false}>
			<p class="mb-5 w-80">{m.something_happened()}</p>
			{#snippet go()}
				<Button.Root href="/home" class="h-fit py-2!">{m.home()}</Button.Root>
			{/snippet}
		</AlertDialog>
	</div>
</div>
