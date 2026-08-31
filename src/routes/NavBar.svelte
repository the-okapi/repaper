<script lang="ts">
	import { page } from '$app/state';
	import { AlertDialog } from '$lib/components';
	import { Button } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';
	import showIcon from '$lib/assets/icons/show.svg';
	import hideIcon from '$lib/assets/icons/hide.svg';
	import { barHidden } from '$lib/state.svelte';
	import Settings from './Settings.svelte';
	import LogIn from './LogIn.svelte';
	import { getLocale } from '$lib/paraglide/runtime';

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
				<a class="m-auto mx-2 h-fit hover:underline" href="/home" onclick={closeAll}
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
					href="https://help.repaper.unlimitedstuffltd.com/{getLocale()}"
					target="_blank">{m.help()}</a
				>
			{:else}
				<a class="m-auto mx-2 h-fit hover:underline" href="/" onclick={closeAll}
					>{m.home()}</a
				>
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
					href="https://help.repaper.unlimitedstuffltd.com/{getLocale()}"
					target="_blank">{m.help()}</a
				>
			{/if}
		</div>
		<h1 class="text-4xl font-bold whitespace-nowrap">
			{page.data.title ?? 'Repaper'}
		</h1>
		<div class="w-full text-right">
			{#if page.route.id === '/assignment/[assignment]'}
				{#if name}
					<p>{name}</p>
				{/if}
				<button
					class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-(--o) bg-(--bg) p-2!
			"
					onclick={() => (barHidden.value = true)}
				>
					<img src={showIcon} alt="Hide" class="size-4.5" />
				</button>
			{:else if name}
				<p>{name}</p>
			{/if}
		</div>
	</div>

	<div class="h-20"></div>
{:else if barHidden.value}
	<button
		class="fixed top-5 right-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-(--o) bg-(--bg) p-2!"
		onclick={() => (barHidden.value = false)}
	>
		<img src={hideIcon} alt="Show" class="size-4.5" />
	</button>
{/if}
