<script lang="ts">
	import { page } from '$app/state';
	import { Loading } from '$lib/components';
	import { onMount } from 'svelte';
	import fullscreenState from '$lib/fullscreen';
	import { goto } from '$app/navigation';

	onMount(async () => {
		const code = page.params.documentCode ?? '';
		const token = page.params.token ?? '';
		localStorage.setItem('repaper-token', token);
		let fullscreen = page.url.searchParams.getAll('fullscreen');
		if (fullscreen.length > 0) {
			fullscreenState.set(true);
		}
		goto(`/document/${code}?mode=editor`);
	});
</script>

<svelte:head>
	<title>Repaper</title>
</svelte:head>

<Loading show={true} />
