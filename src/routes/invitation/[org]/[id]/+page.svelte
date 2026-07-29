<script lang="ts">
	import type { PageProps } from './$types';
	import { Label, Button } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>{m.create_account()} - Repaper</title>
</svelte:head>

<div class="flex h-screen w-screen items-center justify-center">
	<form class="relative rounded-xl border border-(--o) bg-(--bg) p-10" method="POST">
		<h2 class="mb-5 text-center text-3xl font-bold">{m.create_account()}</h2>
		<div class="m-auto w-fit">
			<Label.Root>{m.email()}:</Label.Root><br />
			<input type="email" name="email" class="w-60" value={form?.email} required />
		</div>
		<p class="m-auto mb-5 w-60 text-center text-xs">
			{m.email_sent_to()}
		</p>
		<div class="m-auto mb-2 w-fit">
			<Label.Root>{m.password()}:</Label.Root><br />
			<input type="password" name="password" class="w-60" required />
		</div>
		<div class="m-auto mb-5 w-fit">
			<Label.Root>{m.confirm()} {m.password()}:</Label.Root><br />
			<input type="password" name="confirmPassword" class="w-60" required />
		</div>
		<Button.Root type="submit" class="m-auto block">{m.go()}</Button.Root>
		{#if form?.fail}
			<p class="absolute bottom-1 left-2 leading-none text-(--red)">{form.message}</p>
		{/if}
	</form>
</div>
