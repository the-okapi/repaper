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
	<div class="grid grid-cols-3 gap-7 px-20 pt-24 pb-10">
		{#each userData.classes as classMembership (classMembership.id)}
			<div class="box">
				{classMembership.class.name}
			</div>
		{/each}
	</div>
{/await}
