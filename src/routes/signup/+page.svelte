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
	<title>{m.sign_up()} | Repaper</title>
</svelte:head>

<div class="m-auto flex h-[calc(100vh-5rem)] w-screen items-center justify-center">
	{#if loading}
		<Loader />
	{:else}
		<div class="m-auto rounded-2xl border border-(--o) bg-(--bg) px-15 py-10">
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
					<Label.Root>{m.your()} {m.name()}:</Label.Root><br />
					<input type="text" value={form?.name} name="name" class="w-70" required />
				</div>
				<div class="mb-5 text-left">
					<Label.Root>{m.your()} {m.email()}:</Label.Root><br />
					<input type="email" value={form?.email} name="email" class="w-70" required />
				</div>
				<div class="mb-5 text-left">
					<Label.Root>{m.password()}:</Label.Root><br />
					<input
						type="password"
						name="password"
						bind:value={password}
						class="w-70"
						required
					/>
				</div>
				<div class="text-left">
					<Label.Root>{m.confirm()} {m.password()}:</Label.Root><br />
					<input type="password" bind:value={confirmPassword} class="w-70" required />
				</div>
				{#if form?.fail || error}
					<div class="flex w-50 justify-center bg-red-500">
						<p class="absolute text-(--r)">{form?.message || error}</p>
					</div>
				{/if}
				<Button.Root type="submit" class="mt-10 w-fit">{m.submit()}</Button.Root>
			</form>
		</div>
	{/if}
</div>
