<script lang="ts">
	import { Loader } from '$lib/components';
	import { loadStudent } from './load.remote';

	let { form, user } = $props();
</script>

{#await loadStudent(user)}
	<div class="fixed top-0 left-0 flex h-screen w-screen items-center justify-center">
		<Loader />
	</div>
{:then userData}
	{#each userData.classes as classMembership (classMembership.id)}

	{/each}
{/await}
