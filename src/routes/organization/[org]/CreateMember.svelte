<script lang="ts">
	import { Loader } from '$lib/components';
	import { enhance } from '$app/forms';
	import { Label, Button } from 'bits-ui';
	import { m } from '$lib/paraglide/messages';

	let { form } = $props();

	let loading = $state(false);
</script>

<div
	class="relative flex items-center justify-center rounded-xl border border-(--o) bg-(--bg) px-12"
>
	{#if loading && !form?.createSuccess}
		<Loader />
	{:else if loading}
		<div class="absolute w-60 text-center">
			<p>
				{m.email_sent()}
				{form.email}
				{m.finish_setting_up()}
			</p>
			<Button.Root onclick={() => (loading = false)} class="mt-7"
				>{m.create_another_member()}</Button.Root
			>
		</div>
	{/if}
	<form
		class="h-full w-full {loading ? 'invisible' : ''}"
		action="?/create"
		method="POST"
		use:enhance={() => {
			loading = true;

			return ({ update, result }) => {
				update();
				if (result.status !== 200) {
					loading = false;
				}
			};
		}}
	>
		<h2 class="mt-5 text-center text-3xl font-bold whitespace-nowrap">{m.create_member()}</h2>
		<div class="m-auto mt-3 w-fit">
			<Label.Root>{m.name()}:</Label.Root><br />
			<input name="name" type="text" required />
		</div>
		<div class="m-auto mt-3 w-fit">
			<Label.Root>{m.email()}:</Label.Root><br />
			<input name="email" type="email" required />
		</div>
		<Button.Root type="submit" class="m-auto mt-3 mb-10 block w-fit">{m.go()}</Button.Root>
		{#if form?.createError}
			<p class="absolute bottom-2 left-3 text-sm text-(--red)">{form.message}</p>
		{/if}
	</form>
</div>
