<script lang="ts">
	import type { PageProps } from './$types';
	import Combobox from '$lib/components/Combobox.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import AlertDialog from '$lib/components/AlertDialog.svelte';
	import { Label, Button } from 'bits-ui';
	import { load } from './load.remote';
	import type { OrganizationMember } from '$lib/util';
	import { m } from '$lib/paraglide/messages';
	import CreateAssignment from './CreateAssignment.svelte';
	import { page } from '$app/state';

	let { data, params, form }: PageProps = $props();

	let showConfirm = $state(false);
	let remove = $state(0);

	function confirmRemove(i: number) {
		remove = i;
		showConfirm = true;
	}

	type User = {
		user: {
			name: string;
			email: string;
		};
		admin: boolean;
	};
</script>

<div class="h-2"></div>
<a href="/home" class="relative ml-10 hover:underline">← {m.back()}</a>
<div class="grid grid-cols-2 gap-7 px-10 pt-2">
	<div class="flex h-[80vh] w-full gap-4">
		<div class="flex h-full w-full flex-col gap-4">
			<div
				class="flex h-full w-full items-center justify-center rounded-xl border border-(--o) bg-(--bg)"
			>
				{#await load(params.org)}
					<div class="flex h-57 items-center justify-center">
						<Loader />
					</div>
				{:then { data: members }}
					<form class="relative h-fit w-full p-5" method="POST" action="?/add">
						<h2
							class="text-center text-2xl
							font-bold"
						>
							{m.add_member()}
						</h2>
						{let options = $derived(
							members
								.filter(
									(user: User) =>
										data.members.find(
											(u: User) => u.user.email === user.user.email
										) === undefined
								)
								.map((user: User) => ({
									value: user.user.name,
									label: user.user.name
								}))
						)}
						{#if options.length === 0}
							<p class="px-5 text-center">{m.no_users()}</p>
						{:else}
							{#if form?.add}
								<div class="absolute left-0 w-full">
									<p class="text-center text-sm text-(--r)">{form.add}</p>
								</div>
							{/if}
							{let memberToAdd = $state(
								form?.user
									? members.find(
											(o: OrganizationMember) => (o.user.id = form.user)
										).user.name
									: ''
							)}
							<div class="m-auto mt-5 mb-1 w-fit">
								<Label.Root class="text-sm">{m.choose_add()}:</Label.Root>
								<Combobox {options} bind:value={memberToAdd} />
							</div>
							{#if memberToAdd !== ''}
								{const member = $derived(
									members.find(
										(o: OrganizationMember) => o.user.name === memberToAdd
									)
								)}
								<input type="hidden" name="email" value={member.user.email} />
								<div class="absolute left-0 w-full">
									<p
										class="m-auto block w-70 overflow-hidden text-center text-sm text-ellipsis whitespace-nowrap"
									>
										{member.user.name} - {member.user.email}
									</p>
								</div>
								<input type="hidden" name="userId" value={member.user.id} />
							{/if}
							<Button.Root type="submit" class="m-auto mt-8 block"
								>{m.submit()}</Button.Root
							>
						{/if}
					</form>
				{/await}
			</div>
			<div class="h-80 w-full rounded-xl border border-(--o) bg-(--bg)">
				<a href={page.url.pathname + '/assignments'}>
					<div
						class="relative flex h-full w-full cursor-pointer items-center justify-center rounded-xl p-5 transition-colors hover:bg-(--a)"
					>
						<div class="w-fit text-center">
							<h2 class="text-center text-2xl font-bold">{m.assignment()}s</h2>
						</div>
						<div class="absolute bottom-2 left-0 w-full text-center">
							<p>{m.go_to()} {m.assignment()}</p>
						</div>
					</div>
				</a>
			</div>
		</div>
		<CreateAssignment />
	</div>
	<div class="relative z-10 h-[80vh] w-full rounded-xl border border-(--o) bg-(--bg) p-5">
		<h2 class="text-center text-3xl font-bold">{m.class_list()}</h2>
		{#each data.members as member, i (member.user.id)}
			<div class="flex h-16 px-5 py-3">
				<div class="flex w-fit items-center">
					{#if member.admin}
						<p class="badge bg-amber-600">
							{m.admin()}
						</p>
					{:else}
						<p class="badge bg-(--p)">{m.student()}</p>
					{/if}
				</div>
				<p class="m-auto mx-4 w-full overflow-x-scroll text-xl whitespace-nowrap">
					<span class="font-bold">{member.user.name}</span>
					{#if member.user.id === data.user}
						<span class="text-base opacity-50">({m.you()})</span>
					{/if} -
					<span class="overflow-hidden text-base">{member.user.email}</span>
				</p>
				{#if member.user.id !== data.user && data.members.length > 1}
					<Button.Root onclick={() => confirmRemove(i)} class="red-button"
						>{m.remove()}</Button.Root
					>
				{/if}
			</div>
			{#if i !== data.members.length - 1}
				<hr class="m-auto w-[80%] border-(--o)" />
			{/if}
		{/each}
	</div>
</div>

<AlertDialog bind:open={showConfirm}>
	<p class="mb-8 w-100 text-center text-lg">
		{m.are_you_sure()}
		{m.remove_from_class({ name: data.members[remove].user.name })}
	</p>
	{#snippet go()}
		<form action="?/remove" method="POST">
			<input type="hidden" value={data.members[remove].user.id} name="userId" />
			<Button.Root type="submit" class="red-button">{m.go()}</Button.Root>
		</form>
	{/snippet}
</AlertDialog>
