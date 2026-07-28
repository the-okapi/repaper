<!-- Translated -->
<script lang="ts">
	import { AlertDialog } from '$lib/components';
	import { Button, Label } from 'bits-ui';
	import type { OrganizationMember } from '$lib/types';
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';

	let { members, user } = $props();

	let focus = $state(-1);

	let member = $derived(members[focus]);

	let confirmDeleteOpen = $state(false);

	let confirmPage = $state(0);

	let confirmText = $state('');
	let confirmError = $state('');

	function cancel() {
		confirmDeleteOpen = false;
		confirmPage = 0;
	}

	let promoteOpen = $state(false);

	function promote() {
		promoteOpen = true;
	}

	let demoteOpen = $state(false);

	function demote() {
		demoteOpen = true;
	}
</script>

<div
	class="flex h-[80vh] w-full items-center justify-center overflow-scroll overscroll-none rounded-xl border border-(--o) bg-(--bg) p-5"
>
	{#if focus === -1}
		<div class="h-full w-full">
			<h2 class="mb-5 text-center text-3xl font-bold">{m.list_members()}</h2>
			{#each members as member, i (i)}
				<div class="flex px-5 py-3">
					<div class="flex w-fit items-center">
						{#if member.owner}
							<p class=" badge bg-violet-500">{m.admin()}</p>
						{:else}
							<p class="badge bg-(--p)">{m.member()}</p>
						{/if}
					</div>
					<p class="m-auto mx-4 w-full overflow-x-scroll text-xl whitespace-nowrap">
						<span class="font-bold">{member.user.name}</span>
						{#if member.user.id === user}
							<span class="text-base opacity-50">({m.you()})</span>
						{/if} -
						<span class="overflow-hidden font-mono text-base">{member.user.email}</span>
					</p>
					<Button.Root onclick={() => (focus = i)}>{m.manage()}</Button.Root>
				</div>
				{#if i !== members.length - 1}
					<hr class="m-auto w-[90%] border-(--o)" />
				{/if}
			{/each}
		</div>
	{:else}
		<div class="relative h-full w-full">
			{#if member.owner}
				<p class="badge m-auto mb-1 bg-violet-500">{m.admin()}</p>
			{:else}
				<p class="badge m-auto mb-1 bg-(--p)">{m.member()}</p>
			{/if}
			<h2 class="text-center text-3xl font-bold">
				{member.user.name}
				{#if member.user.id === user}<span class="text-2xl font-normal opacity-50"
						>({m.you()})</span
					>{/if}
			</h2>
			<h3 class="text-center font-mono text-lg">{member.user.email}</h3>
			<form action="?/renameMember" method="POST" class="m-auto my-8 w-fit">
				<Label.Root for="name">{m.rename_to()}:</Label.Root>
				<div class="m-auto flex gap-1">
					<input name="name" id="name" required />
					<Button.Root type="submit">{m.go()}</Button.Root>
				</div>
				<input type="hidden" name="user" value={member.user.id} />
			</form>
			{#if !member.owner && member.user.id !== user}
				<Button.Root class="m-auto mb-8 block" onclick={promote}>{m.promote()}</Button.Root>
			{/if}
			{#if members.filter((member: OrganizationMember) => member.owner).length > 1 && member.owner && member.user.id !== user}
				<Button.Root class="m-auto mb-8 block" onclick={demote}>{m.demote()}</Button.Root>
			{/if}
			{#if members.length > 0 && member.user.id !== user}
				{#if (member.owner && members.filter((member: OrganizationMember) => member.owner).length > 1) || !member.owner}
					<Button.Root
						class="m-auto block bg-(--red)!"
						onclick={() => (confirmDeleteOpen = true)}>{m.delete_user()}</Button.Root
					>
				{/if}
			{/if}
			<div class="absolute bottom-5 w-full">
				<Button.Root onclick={() => (focus = -1)} class="m-auto block"
					>{m.back()}</Button.Root
				>
			</div>
		</div>
	{/if}
</div>

<AlertDialog bind:open={promoteOpen}>
	<p class="mb-8 text-center text-lg">
		{m.are_you_sure()}
		{m.confirm_promote({ name: member.user.name })}
	</p>
	<div class="m-auto flex w-fit gap-4">
		<Button.Root onclick={() => (promoteOpen = false)}>{m.cancel()}</Button.Root>
		<form action="?/promote" method="POST">
			<input type="hidden" value={member.user.id} name="userId" />
			<Button.Root type="submit">{m.go()}</Button.Root>
		</form>
	</div>
</AlertDialog>

<AlertDialog bind:open={demoteOpen}>
	<p class="mb-8 text-center text-lg">
		{m.are_you_sure()}
		{m.confirm_demote({ name: member.user.name })}
	</p>
	<div class="m-auto flex w-fit gap-4">
		<Button.Root onclick={() => (demoteOpen = false)}>{m.cancel()}</Button.Root>
		<form action="?/demote" method="POST">
			<input type="hidden" value={member.user.id} name="userId" />
			<Button.Root type="submit">{m.go()}</Button.Root>
		</form>
	</div>
</AlertDialog>

<AlertDialog bind:open={confirmDeleteOpen}>
	<div class="relative h-46 w-120">
		{#if confirmPage === 0}
			<p class="mb-8 text-center text-lg">
				{m.are_you_sure()}
				{m.confirm_delete({ name: member.user.name })}
			</p>
		{:else if confirmPage === 1}
			<p class="text-center">
				{m.please_type()} <span class="font-mono">{member.user.email}</span>
				{m.below_confirm()}
			</p>
			<div class="m-auto mt-4 w-fit">
				<Label.Root for="confirm">{m.email()}:</Label.Root><br />
				<input type="text" id="confirm" class="w-80 font-mono" bind:value={confirmText} />
			</div>
		{:else}
			<p class="mb-8 text-center text-lg">{m.after_delete({ name: member.user.name })}</p>
		{/if}
		<p class="absolute bottom-14 left-20 text-(--red)">{confirmError}</p>
		<div class="absolute bottom-0 m-auto flex w-full items-center justify-center">
			<div class="flex gap-4">
				{#if confirmPage !== 2}
					<Button.Root onclick={cancel}>{m.cancel()}</Button.Root>
				{/if}
				{#if confirmPage === 0}
					<Button.Root class="bg-(--red)!" onclick={() => (confirmPage = 1)}
						>{m.next()}</Button.Root
					>
				{:else if confirmPage === 1}
					<form
						action="?/delete"
						method="POST"
						use:enhance={({ cancel }) => {
							if (confirmText !== member.user.email) {
								cancel();
								confirmError = m.email_incorrect();
								return;
							}

							confirmPage = 2;
						}}
					>
						<Button.Root class="bg-(--red)!" type="submit">{m.go()}</Button.Root>
						<input type="hidden" name="userId" value={member.user.id} />
					</form>
				{:else}
					<Button.Root
						onclick={() => {
							confirmDeleteOpen = false;
							confirmPage = 0;
						}}>OK</Button.Root
					>
				{/if}
			</div>
		</div>
	</div>
</AlertDialog>
