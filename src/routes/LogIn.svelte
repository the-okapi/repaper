<script lang="ts">
	import { Button, Label } from 'bits-ui';
	import { slide } from 'svelte/transition';
	import Loader from '$lib/components/Loader.svelte';
	import { logIn } from './actions.remote';
	import { m } from '$lib/paraglide/messages';
	import { goto } from '$app/navigation';

	let { class: c, ...props } = $props();

	let email = $state('');
	let password = $state('');

	let error = $state('');

	let loading = $state(false);

	async function onsubmit(event: Event) {
		event.preventDefault();

		loading = true;

		const response = await logIn({
			email,
			password
		});

		if (response.status === 200) {
			return goto('/home', { replaceState: true });
		} else {
			error = response.message ?? '';
			loading = false;
		}
	}
</script>

<div
	transition:slide
	class="{c} flex h-70 w-75 items-center justify-center rounded-xl bg-(--bg) p-6 outline outline-(--o)"
	{...props}
>
	{#if loading}
		<Loader />
	{:else}
		<form {onsubmit}>
			<div class="mb-5 w-60">
				<Label.Root class={loading ? 'opacity-50' : ''}>{m.email()}:</Label.Root>
				<input type="email" class="w-60" bind:value={email} required />
			</div>
			<div class="mb-0.5 w-60">
				<Label.Root class={loading ? 'opacity-50' : ''}>{m.password()}:</Label.Root>
				<input type="password" class="w-60" bind:value={password} required />
			</div>
			<div class="absolute w-60 text-center">
				<p class="text-xs text-(--r)">{error}</p>
			</div>
			<Button.Root type="submit" class="m-auto mt-7 block w-fit">{m.submit()}</Button.Root>
		</form>
	{/if}
</div>
