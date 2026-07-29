<script lang="ts">
	import { Button, Label } from 'bits-ui';
	import { slide } from 'svelte/transition';
	import { Loader } from '$lib/components';
	import { logIn } from '$lib/actions.remote';
	import { m } from '$lib/paraglide/messages';

	let { class: c, ...props } = $props();

	let email = $state('');
	let password = $state('');

	let error = $state('');

	let loading = $state(false);
</script>

<div
	in:slide
	out:slide
	class="{c} flex items-center justify-center rounded-xl bg-(--bg) p-6 outline outline-(--o)"
	{...props}
>
	{#if loading}
		<Loader />
	{/if}
	<form
		{...logIn.enhance(async (form) => {
			loading = true;
			await form.submit();

			if (form.result?.status === 400 || form.result?.status === 500) {
				error = form.result?.message ?? '';
				loading = false;
			}
		})}
		class={loading ? 'invisible' : 'visible'}
	>
		<div class="mb-5 w-50">
			<Label.Root class={loading ? 'opacity-50' : ''}>{m.email()}:</Label.Root>
			<input type="email" name="email" class="w-50" bind:value={email} required />
		</div>
		<div class="mb-0.5 w-50">
			<Label.Root class={loading ? 'opacity-50' : ''}>{m.password()}:</Label.Root>
			<input type="password" name="password" class="w-50" bind:value={password} required />
		</div>
		<div class="absolute w-50 text-center">
			<p class="text-xs text-(--red)">{error}</p>
		</div>
		<Button.Root type="submit" class="m-auto mt-7 block w-fit">{m.go()}</Button.Root>
	</form>
</div>
