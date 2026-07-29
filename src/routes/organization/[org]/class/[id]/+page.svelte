<script lang="ts">
	import type { PageProps } from './$types';
	import { Combobox, Loader, AlertDialog } from '$lib/components';
	import { Label, Button } from 'bits-ui';
	import { load } from './load.remote';
	import { enhance } from '$app/forms';
	import type { OrganizationMember } from '$lib/types';
	import { fade } from 'svelte/transition';
	import { m } from '$lib/paraglide/messages';

	let { data, params, form }: PageProps = $props();

	let showConfirm = $state(false);
	let remove = $state(0);

	function confirmRemove(i: number) {
		remove = i;
		showConfirm = true;
	}
</script>

<svelte:head>
	<title>{data.title} - Repaper</title>
</svelte:head>

<div class="flex gap-7 px-10 pt-25">
	<div class="flex h-[80vh] w-full flex-col gap-4">
		<div class="flex h-70 w-full gap-4">
			<div
				class="flex h-57 w-full items-center justify-center rounded-xl border border-(--o) bg-(--bg)"
			>
				{#await load(params.org)}
					<Loader />
				{:then { data: members }}
					<form class="relative h-full w-full p-5" method="POST" action="?/add">
						<h2
							class="text-center text-2xl
							font-bold"
						>
							{m.add_member()}
						</h2>
						{#if form?.add}
							<div class="absolute left-0 w-full">
								<p class="text-center text-sm text-(--red)">{form.add}</p>
							</div>
						{/if}
						{let memberToAdd = $state(
							form?.user
								? members.find((o: OrganizationMember) => (o.user.id = form.user))
										.user.name
								: ''
						)}
						<div class="m-auto mt-5 mb-1 w-fit">
							<Label.Root class="text-sm">{m.choose_add()}:</Label.Root>
							<Combobox options={members} bind:value={memberToAdd} />
						</div>
						{#if memberToAdd !== ''}
							{const member = $derived(
								members.find((o: OrganizationMember) => o.user.name === memberToAdd)
							)}
							<input type="hidden" name="email" value={member.user.email} />
							<div class="absolute left-0 w-full">
								<p
									class="block overflow-hidden text-center text-sm text-ellipsis whitespace-nowrap"
								>
									{member.user.name} -{member.user.email}
								</p>
							</div>
							<input type="hidden" name="userId" value={member.user.id} />
						{/if}
						<Button.Root type="submit" class="m-auto mt-8 block">{m.go()}</Button.Root>
					</form>
				{/await}
			</div>
			<div class="h-full w-full rounded-xl border border-(--o) bg-(--bg) p-5"></div>
		</div>
		<div class="h-full w-full rounded-xl border border-(--o) bg-(--bg) p-5"></div>
	</div>
	<div class="relative z-10 h-[80vh] w-full rounded-xl border border-(--o) bg-(--bg) p-5">
		<h2 class="text-center text-3xl font-bold">{m.class_list()}</h2>
		{#each data.members as member, i (i)}
			<div class="flex px-5 py-3" in:fade out:fade>
				<div class="flex w-fit items-center">
					{#if member.owner}
						<p class="badge bg-yellow-600">{m.admin()}</p>
					{:else}
						<p class="badge bg-(--p)">{m.member()}</p>
					{/if}
				</div>
				<p class="m-auto mx-4 w-full overflow-x-scroll text-xl whitespace-nowrap">
					<span class="font-bold">{member.user.name}</span>
					{#if member.user.id === data.user}
						<span class="text-base opacity-50">({m.you()})</span>
					{/if} -
					<span class="overflow-hidden text-base">{member.user.email}</span>
				</p>
				<Button.Root onclick={() => confirmRemove(i)} class="red-button"
					>{m.remove()}</Button.Root
				>
			</div>
			{#if i !== data.members.length - 1}
				<hr in:fade out:fade class="m-auto w-[80%] border-(--o)" />
			{/if}
		{/each}
	</div>
</div>

<AlertDialog bind:open={showConfirm}>
	<p class="mb-8 text-center text-lg">
		{m.are_you_sure()}
		{m.remove_from_class({ name: data.members[remove].user.name })}
	</p>
	<div class="m-auto flex w-fit gap-4">
		<Button.Root onclick={() => (showConfirm = false)}>{m.cancel()}</Button.Root>
		<form
			action="?/remove"
			method="POST"
			use:enhance={() => {
				showConfirm = false;
			}}
		>
			<input type="hidden" value={data.members[remove].user.id} name="userId" />
			<Button.Root type="submit" class="red-button">{m.go()}</Button.Root>
		</form>
	</div>
</AlertDialog>
