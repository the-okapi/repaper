<script lang="ts">
	import type { PageProps } from './$types';
	import { Button, Label } from 'bits-ui';
	import { fade } from 'svelte/transition';
	import { load } from './load.remote';
	import { Loader } from '$lib/components';
	import { m } from '$lib/paraglide/messages';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>{m.home()} | Repaper</title>
</svelte:head>

{#await load(data.user)}
	<div class="fixed top-0 left-0 flex h-screen w-screen items-center justify-center">
		<Loader />
	</div>
{:then d}
	<div class="grid grid-cols-3 gap-7 px-20 pt-24 pb-10">
		{#if d.organization}
			{#if d.organization.owner}
				<div class="box">
					<button
						class="box absolute cursor-pointer transition-colors hover:bg-(--fg)/5!"
						onclick={() => window.location.assign('/organization/' + d.organization.id)}
					>
						<div>
							<h2 class="text-center text-4xl font-bold">{d.organization.name}</h2>
							<h3 class="mt-3 text-center">{m.manage()} {m.organization()}</h3>
						</div>
					</button>
				</div>
				<div class="box" in:fade>
					<form method="POST" action="?/create">
						<h2 class="mb-10 text-center text-3xl font-bold">{m.create_class()}</h2>
						<Label.Root>{m.class_name()}:</Label.Root><br />
						<input type="text" name="className" class="h-10" required />
						<Button.Root type="submit">{m.go()}</Button.Root>
						{#if form?.createFailure}
							<p class="absolute text-(--red)">{form?.message}</p>
						{/if}
						<input type="hidden" name="organization" value={d.organization.id} />
					</form>
				</div>
			{/if}

			{#each d.classes as classData, i (i)}
				<div class="box">
					<button
						class="box absolute cursor-pointer transition-colors hover:bg-(--fg)/5!"
						onclick={() =>
							window.location.assign(
								'/organization/' + d.organization.id + '/class/' + classData.id
							)}
					>
						<div>
							<h2 class="text-center text-4xl font-bold">{classData.name}</h2>
							<h3 class="mt-3 text-center">{m.manage_class()}</h3>
						</div>
					</button>
				</div>
			{/each}
		{:else}
			<div class="box" out:fade>
				<form method="POST" action="?/organization">
					<h2 class="mb-10 text-center text-2xl font-bold">{m.create_organization()}</h2>
					<Label.Root>{m.organization_name()}:</Label.Root><br />
					<input type="text" name="orgName" class="h-10" required />
					<Button.Root type="submit">{m.go()}</Button.Root>
					{#if form?.orgFailure}
						<p class="absolute text-(--red)">{form.message}</p>
					{/if}
				</form>
			</div>
		{/if}
	</div>
{/await}
