<script lang="ts">
	import { Label, Button } from 'bits-ui';
	import type { PageProps } from './$types';
	import CreateMember from './CreateMember.svelte';
	import OrganizationMembers from './OrganizationMembers.svelte';
	import { AlertDialog } from '$lib/components';
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';

	let { data, form }: PageProps = $props();

	let invitation = $state(0);
	let confirmRevoke = $state(false);

	function revokeInvitation(i: number) {
		invitation = i;
		confirmRevoke = true;
	}

	let restore = $state(0);
	let restoreOpen = $state(false);

	function restoreMember(i: number) {
		restore = i;
		restoreOpen = true;
	}
</script>

<div class="h-2"></div>
<a href="/home" class="relative ml-10 hover:underline">← {m.back()}</a>
<div class="flex gap-4 px-10 pt-2">
	<OrganizationMembers {...data} />
	<div class="flex h-[80vh] w-full gap-4">
		<div class="flex h-full w-full flex-col gap-4">
			<div
				class="h-full w-full overflow-scroll overscroll-none rounded-xl border border-(--o) bg-(--bg) p-5"
			>
				<h2 class="mb-5 text-center text-3xl font-bold">Invitations</h2>
				{#if data.invitations.length === 0}
					<p class="w-80">{m.no_invitations()}</p>
				{/if}
				{#each data.invitations as invitation, i (invitation.id)}
					<div class="mb-2.5 flex w-80">
						<p class="my-auto w-70 overflow-hidden text-ellipsis">
							{invitation.email}
						</p>
						<Button.Root
							onclick={() => revokeInvitation(i)}
							class="red-button ml-1 rounded-[0.625rem]! px-3! py-1.5!"
							>{m.revoke()}</Button.Root
						>
					</div>
				{/each}
			</div>
			<div
				class="h-full w-full overflow-scroll overscroll-none rounded-xl border border-(--o) bg-(--bg) p-5"
			>
				<h2 class="mb-5 text-center text-3xl font-bold">{m.deletions()}</h2>
				{#if data.deletions.length === 0}
					<p class="w-80">{m.no_deletions()}</p>
				{/if}
				{#each data.deletions as deletion, i (deletion.id)}
					<div class="mb-2.5 flex w-80">
						<p class="my-auto w-70 overflow-x-scroll whitespace-nowrap">
							<span class="font-mono text-sm"
								>{new Date(deletion.can_delete).toLocaleDateString('en-CA')}</span
							>
							- {deletion.name}
						</p>
						<Button.Root
							onclick={() => restoreMember(i)}
							class="ml-1 rounded-[0.625rem]! px-3! py-1.5! text-sm"
							>{m.restore()}</Button.Root
						>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex h-full flex-col gap-4">
			<div
				class="flex h-full w-full items-center rounded-xl border border-(--o) bg-(--bg) p-5"
			>
				<form action="?/rename" method="POST" class="m-auto">
					<h2 class="text-center text-2xl font-bold">{m.rename_organization()}</h2>
					<div class="mx-auto my-5 w-fit">
						<Label.Root>{m.rename_to()}:</Label.Root><br />
						<input type="text" name="name" required />
					</div>
					<Button.Root type="submit" class="m-auto block">{m.go()}</Button.Root>
					{#if form?.renameError}
						<p class="absolute text-(--red)">{form.message}</p>
					{/if}
				</form>
			</div>
			<CreateMember {form} />
		</div>
	</div>
</div>

<AlertDialog bind:open={confirmRevoke}>
	<p class="mb-8 w-100 text-center text-lg">
		{m.are_you_sure()}
		{m.confirm_revoke()} <span class="font-bold">{data.invitations[invitation].name}</span>,
		{data.invitations[invitation].email}?
	</p>
	{#snippet go()}
		<form
			action="?/revoke"
			method="POST"
			use:enhance={() => {
				confirmRevoke = false;
			}}
		>
			<input type="hidden" value={data.invitations[invitation].id} name="invitation" />
			<Button.Root type="submit" class="red-button">{m.go()}</Button.Root>
		</form>
	{/snippet}
</AlertDialog>

<AlertDialog bind:open={restoreOpen}>
	<p class="mb-8 w-100 text-center text-lg">
		{m.are_you_sure()}
		{m.confirm_restore()} <span class="font-bold">{data.deletions[restore].name}</span>?
	</p>
	{#snippet go()}
		<form action="?/restore" method="POST">
			<input type="hidden" value={data.deletions[restore].id} name="userId" />
			<Button.Root type="submit">{m.go()}</Button.Root>
		</form>
	{/snippet}
</AlertDialog>
