<script lang="ts">
	import { page } from '$app/state';
	import { Settings, Login, AlertDialog } from '$lib/components';
	import { slide } from 'svelte/transition';
	import { Button } from 'bits-ui';
	import { signOut } from '$lib/actions.remote';
	import { m } from '$lib/paraglide/messages';
	import { goto } from '$app/navigation';

	let { loggedIn } = $props();

	let shown = $state(true);
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

	function show() {
		shown = !shown;
		if (!shown) {
			settings = false;
			login = false;
		}
	}

	let logOutOpen = $state(false);

	async function signOutForm(event: Event) {
		event.preventDefault();
		logOutOpen = false;
		login = false;
		const response = await signOut();

		if (response.status === 200) {
			return goto('/', { replaceState: true });
		} else {
			return goto('/error', { replaceState: true });
		}
	}

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
</script>

<svelte:window {onkeydown} />

<AlertDialog bind:open={logOutOpen}>
	<p class="mb-8 text-center text-lg">{m.are_you_sure()} {m.confirm_log_out()}</p>
	{#snippet go()}
		<form onsubmit={signOutForm}>
			<Button.Root type="submit">{m.go()}</Button.Root>
		</form>
	{/snippet}
</AlertDialog>

<button
	class="fixed top-5 left-5 z-50! inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-(--o) font-[Times_New_Roman] text-2xl font-black"
	onclick={show}
>
	R
</button>
{#if shown}
	<div
		in:slide={{ axis: 'x' }}
		out:slide={{ axis: 'x' }}
		class="fixed top-5 left-17 z-40! flex h-10 rounded-xl px-3 py-1.5 outline outline-(--o)"
	>
		{#if loggedIn}
			<a class="m-auto mx-2 h-fit hover:underline" href="/home">{m.home()}</a>
			<button
				class="mx-2 cursor-pointer whitespace-nowrap hover:underline"
				onclick={() => (logOutOpen = true)}
			>
				{m.log_out()}
			</button>
		{:else}
			<a class="m-auto mx-2 h-fit hover:underline" href="/">{m.home()}</a>
			<a class="m-auto mx-2 h-fit whitespace-nowrap hover:underline" href="/signup"
				>{m.sign_up()}</a
			>
			<div class="cardButton m-auto h-fit {login ? 'z-50!' : 'z-40!'}">
				<button
					class="mx-2 cursor-pointer whitespace-nowrap hover:underline"
					onclick={showLogin}>{m.log_in()}</button
				>
				{#if login}
					<Login class="card" />
				{/if}
			</div>
		{/if}
		<div class="cardButton m-auto h-fit {settings ? 'z-50!' : 'z-40!'}">
			<button
				class="mx-2 cursor-pointer whitespace-nowrap hover:underline"
				onclick={showSettings}>{m.settings()}</button
			>
			{#if settings}
				<Settings class="card" />
			{/if}
		</div>
	</div>
{/if}
<h1
	class="fixed top-0 w-screen border-b border-(--o) bg-(--bg) py-5 text-center text-4xl font-bold"
>
	{page.data.title ?? 'Repaper'}
</h1>

<style>
	.cardButton {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
