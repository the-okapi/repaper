<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { Label, Button } from 'bits-ui';
	import { fade } from 'svelte/transition';

	let { data, form } = $props();
</script>

<div class="grid grid-cols-3 gap-7 px-20 pt-4 pb-10">
	{#if data.organization}
		{#if data.organization.admin}
			<div class="box">
				<button
					class="box absolute cursor-pointer transition-colors hover:bg-(--fg)/5!"
					onclick={() => window.location.assign('/manage/' + data.organization.id)}
				>
					<div>
						<h2 class="text-center text-4xl font-bold">
							{data.organization.name}
						</h2>
					</div>
					<div class="absolute bottom-2 left-0 w-full">
						<p>{m.manage()} {m.organization()}</p>
					</div>
				</button>
			</div>
			<div class="box" in:fade>
				<form method="POST" action="?/create">
					<h2 class="mb-10 text-center text-3xl font-bold">{m.create_class()}</h2>
					<Label.Root>{m.class_name()}:</Label.Root><br />
					<input type="text" name="className" class="mr-1 h-10" required />
					<Button.Root type="submit">{m.submit()}</Button.Root>
					{#if form?.createFailure}
						<p class="absolute text-(--r)">{form?.message}</p>
					{/if}
					<input type="hidden" name="organization" value={data.organization.id} />
				</form>
			</div>
		{/if}

		{#each data.classes as classData (classData.id)}
			<div class="box">
				<button
					class="box absolute cursor-pointer transition-colors hover:bg-(--fg)/5!"
					onclick={() =>
						window.location.assign(
							'/manage/' + data.organization.id + '/' + classData.id
						)}
				>
					<div>
						<h2 class="text-center text-4xl font-bold">{classData.name}</h2>
					</div>
					<div class="absolute bottom-2 left-0 w-full">
						<p>{m.manage_class()}</p>
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
				<Button.Root type="submit">{m.submit()}</Button.Root>
				{#if form?.orgFailure}
					<p class="absolute text-(--r)">{form.message}</p>
				{/if}
			</form>
		</div>
	{/if}
</div>
