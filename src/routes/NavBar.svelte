<script lang="ts">
	import { page } from '$app/state';
	import AlertDialog from '$lib/components/AlertDialog.svelte';
	import { Button } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';
	import Show from '@lucide/svelte/icons/eye';
	import Hide from '@lucide/svelte/icons/eye-closed';
	import { barHidden } from '$lib/state.svelte';
	import Settings from './Settings.svelte';
	import LogIn from './LogIn.svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import { PUBLIC_HELP_URL } from '$app/env/public';

	let { loggedIn, name } = $props();

	let settings = $state(false);
	let login = $state(false);

	function showSettings() {
		login = false;
		settings = !settings;
	}

	function showLogin() {
		settings = false;
		login = !login;
	}

	let logOutOpen = $state(false);

	function onkeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape') {
			return;
		}

		if (settings) {
			settings = false;
		} else if (login) {
			login = false;
		}
	}

	function closeAll() {
		settings = false;
		login = false;
	}
</script>

<svelte:window {onkeydown} />

<AlertDialog bind:open={logOutOpen}>
	<p class="mb-8 text-center text-lg">{m.are_you_sure()} {m.confirm_log_out()}</p>
	{#snippet go()}
		<form method="POST" action="/?/signOut">
			<Button.Root type="submit">{m.go()}</Button.Root>
		</form>
	{/snippet}
</AlertDialog>
{#if !barHidden.value && page.route.id !== '/error'}
	<div class="fixed top-0 flex w-screen items-center border-b border-(--o) bg-(--bg) p-5">
		<div class="flex w-full">
			{#snippet settingsSnippet()}
				<div class="cardButton h-fit {settings ? 'z-50!' : 'z-40!'}">
					<button
						class="mx-2 cursor-pointer whitespace-nowrap hover:underline"
						onclick={showSettings}>{m.settings()}</button
					>
					{#if settings}
						<Settings class="card" />
					{/if}
				</div>
			{/snippet}
			{#if loggedIn}
				{#if name}
					<a href="/account" class="m-auto mx-2 h-fit hover:underline">{name}</a>
					<p class="mx-1">—</p>
				{/if}
				<a class="m-auto mx-2 h-fit hover:underline" href="/student" onclick={closeAll}
					>{m.home()}</a
				>
				{@render settingsSnippet()}
				<button
					class="mx-2 cursor-pointer whitespace-nowrap hover:underline"
					onclick={() => {
						settings = false;
						logOutOpen = true;
					}}
				>
					{m.log_out()}
				</button>
				<a
					class="m-auto mx-2 h-fit hover:underline"
					href="{PUBLIC_HELP_URL}/{getLocale()}"
					target="_blank">{m.help()}</a
				>
			{:else}
				<a class="m-auto mx-2 h-fit hover:underline" href="/" onclick={closeAll}>Repaper</a>
				<a
					class="m-auto mx-2 h-fit whitespace-nowrap hover:underline"
					href="/signup"
					onclick={closeAll}>{m.sign_up()}</a
				>
				{@render settingsSnippet()}
				<div class="cardButton h-fit {login ? 'z-50!' : 'z-40!'}">
					<button
						class="mx-2 cursor-pointer whitespace-nowrap hover:underline"
						onclick={showLogin}>{m.log_in()}</button
					>
					{#if login}
						<LogIn class="card" />
					{/if}
				</div>
				<a
					class="m-auto mx-2 h-fit hover:underline"
					href="{PUBLIC_HELP_URL}/{getLocale()}"
					target="_blank">{m.help()}</a
				>
			{/if}
		</div>
		<h1 class="text-4xl font-bold whitespace-nowrap">
			{page.data.title ?? 'Repaper'}
		</h1>
		<div class="flex w-full items-center justify-end gap-4 text-right">
			{#if page.route.id === '/student/assignment/[assignment]'}
				<button
					class="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-(--o) bg-(--bg) p-2!
			"
					onclick={() => (barHidden.value = true)}
				>
					<Show size={20} />
				</button>
			{/if}
		</div>
	</div>

	<div class="h-20"></div>
{:else if barHidden.value}
	<button
		class="fixed top-5 right-5 flex size-10 cursor-pointer items-center justify-center rounded-xl border border-(--o) bg-(--bg) p-2! hover:bg-(--s)"
		onclick={() => (barHidden.value = false)}
	>
		<Hide size={20} />
	</button>
{/if}
