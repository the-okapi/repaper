<script lang="ts">
	import { Button, Label } from 'bits-ui';
	import type { PageProps } from './$types';
	import { Loader } from '$lib/components';
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';

	let { form }: PageProps = $props();

	let loading = $state(false);

	let password = $state('');
	let confirmPassword = $state('');

	let error: string | null = $state(null);
</script>

<svelte:head>
	<title>{m.sign_up()} - Repaper</title>
</svelte:head>

<div class="m-auto flex h-screen w-screen items-center justify-center p-20">
	{#if loading}
		<Loader />
	{:else}
		<div class="m-auto rounded-xl border border-(--o) bg-(--bg) px-20 py-15">
			<form
				method="POST"
				class="flex w-fit flex-col items-center"
				use:enhance={({ cancel }) => {
					loading = true;
					error = null;
					if (password !== confirmPassword) {
						loading = false;
						cancel();
						error = m.password_confirm_dont_match();
					}

					return ({ update, result }) => {
						if (result.status === 400) {
							loading = false;
						}
						update();
					};
				}}
			>
				<div class="mb-5 text-left">
					<Label.Root for="name">{m.your()} {m.name()}:</Label.Root><br />
					<input
						id="name"
						type="text"
						value={form?.name}
						name="name"
						class="w-50"
						required
					/>
				</div>
				<div class="mb-5 text-left">
					<Label.Root for="email">{m.your()} {m.email()}:</Label.Root><br />
					<input
						id="email"
						type="email"
						value={form?.email}
						name="email"
						class="w-50"
						required
					/>
				</div>
				<div class="mb-5 text-left">
					<Label.Root for="password">{m.password()}:</Label.Root><br />
					<input
						id="password"
						type="password"
						name="password"
						bind:value={password}
						class="w-50"
						required
					/>
				</div>
				<div class="text-left">
					<Label.Root for="password">{m.confirm()} {m.password()}:</Label.Root><br />
					<input
						id="confirm-password"
						type="password"
						bind:value={confirmPassword}
						class="w-50"
						required
					/>
				</div>
				{#if form?.fail || error}
					<div class="flex w-50 justify-center bg-red-500">
						<p class="absolute text-(--red)">{form?.message || error}</p>
					</div>
				{/if}
				<Button.Root type="submit" class="mt-10 w-fit">{m.go()}</Button.Root>
			</form>
		</div>
	{/if}
</div>
