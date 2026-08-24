<script lang="ts">
	import { AlertDialog } from '$lib/components';
	import { Button, Label } from 'bits-ui';
	import type { OrganizationMember } from '$lib/util';
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
			{#each members as member, i (member.user.id)}
				<div class="flex px-5 py-3">
					<div class="flex w-fit items-center">
						{#if member.admin}
							<p class="badge bg-amber-600">{m.admin()}</p>
						{:else}
							<p class="badge bg-(--p)">{m.member()}</p>
						{/if}
					</div>
					<p class="m-auto mx-4 w-full overflow-x-scroll text-xl whitespace-nowrap">
						<span class="font-bold">{member.user.name}</span>
						{#if member.user.id === user}
							<span class="text-base opacity-50">({m.you()})</span>
						{/if} -
						<span class="overflow-hidden text-base">{member.user.email}</span>
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
			{#if member.admin}
				<p class="badge m-auto mb-1 bg-amber-600">{m.admin()}</p>
			{:else}
				<p class="badge m-auto mb-1 bg-(--p)">{m.member()}</p>
			{/if}
			<h2 class="text-center text-3xl font-bold">
				{member.user.name}
				{#if member.user.id === user}<span class="text-2xl font-normal opacity-50"
						>({m.you()})</span
					>{/if}
			</h2>
			<h3 class="text-center">{member.user.email}</h3>
			<form action="?/renameMember" method="POST" class="m-auto my-8 w-fit">
				<Label.Root>{m.rename_to()}:</Label.Root>
				<div class="m-auto flex gap-1">
					<input name="name" required />
					<Button.Root type="submit">{m.go()}</Button.Root>
				</div>
				<input type="hidden" name="user" value={member.user.id} />
			</form>
			{#if !member.admin && member.user.id !== user}
				<Button.Root class="m-auto mb-8 block" onclick={promote}>{m.promote()}</Button.Root>
			{/if}
			{#if members.filter((member: OrganizationMember) => member.admin).length > 1 && member.admin && member.user.id !== user}
				<Button.Root class="m-auto mb-8 block" onclick={demote}>{m.demote()}</Button.Root>
			{/if}
			{#if members.length > 0 && member.user.id !== user}
				{#if (member.admin && members.filter((member: OrganizationMember) => member.admin).length > 1) || !member.admin}
					<Button.Root
						class="red-button m-auto block"
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
	<p class="mb-8 w-100 text-center text-lg">
		{m.are_you_sure()}
		{m.confirm_promote({ name: member.user.name })}
	</p>
	{#snippet go()}
		<form action="?/promote" method="POST">
			<input type="hidden" value={member.user.id} name="userId" />
			<Button.Root type="submit">{m.go()}</Button.Root>
		</form>
	{/snippet}
</AlertDialog>

<AlertDialog bind:open={demoteOpen}>
	<p class="mb-8 w-100 text-center text-lg">
		{m.are_you_sure()}
		{m.confirm_demote({ name: member.user.name })}
	</p>
	{#snippet go()}
		<form action="?/demote" method="POST">
			<input type="hidden" value={member.user.id} name="userId" />
			<Button.Root type="submit">{m.go()}</Button.Root>
		</form>
	{/snippet}
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
				{m.please_type()}
				{member.user.email}
				{m.below_confirm()}
			</p>
			<div class="m-auto mt-4 w-fit">
				<Label.Root>{m.email()}:</Label.Root><br />
				<input type="text" class="w-80" bind:value={confirmText} />
			</div>
			<p class="absolute bottom-12 left-20 text-(--red)">{confirmError}</p>
		{:else}
			<p class="mb-8 text-center text-lg">{m.after_delete({ name: member.user.name })}</p>
		{/if}
		<div class="absolute bottom-0 m-auto flex w-full items-center justify-center">
			<div class="flex gap-4">
				{#if confirmPage === 0}
					<Button.Root onclick={cancel}>{m.cancel()}</Button.Root>
				{:else if confirmPage === 1}
					<Button.Root onclick={() => (confirmPage = 0)}>{m.back()}</Button.Root>
				{/if}
				{#if confirmPage === 0}
					<Button.Root class="red-button" onclick={() => (confirmPage = 1)}
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
						<Button.Root class="red-button" type="submit">{m.go()}</Button.Root>
						<input type="hidden" name="userId" value={member.user.id} />
					</form>
				{:else}
					<Button.Root onclick={() => window.location.reload()}>OK</Button.Root>
				{/if}
			</div>
		</div>
	</div>
</AlertDialog>
