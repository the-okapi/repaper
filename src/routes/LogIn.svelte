<script lang="ts">
	import { Button, Label } from 'bits-ui';
	import { fade } from 'svelte/transition';
	import Loader from '$lib/components/Loader.svelte';
	import { logIn } from './actions.remote';
	import { m } from '$lib/paraglide/messages';
	import { goto } from '$app/navigation';
	import { Popover } from 'bits-ui';

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
			return goto('/student', { replaceState: true });
		} else {
			error = response.message ?? '';
			loading = false;
		}
	}
</script>

<Popover.Root>
	<Popover.Trigger class="nav-bar-link">{m.log_in()}</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content sideOffset={10} forceMount>
			{#snippet child({ wrapperProps, props, open })}
				{#if open}
					<div {...wrapperProps}>
						<div {...props} transition:fade={{ duration: 100 }}>
							<div class="flex h-65 w-67 items-center justify-center">
								{#if loading}
									<Loader />
								{:else}
									<form {onsubmit}>
										<div class="mb-5 w-60">
											<Label.Root
												for="email"
												class={loading ? 'opacity-50' : ''}
												>{m.email()}:</Label.Root
											>
											<input
												type="email"
												id="email"
												class="w-60"
												bind:value={email}
												required
											/>
										</div>
										<div class="mb-0.5 w-60">
											<Label.Root
												for="password"
												class={loading ? 'opacity-50' : ''}
												>{m.password()}:</Label.Root
											>
											<input
												id="password"
												type="password"
												class="w-60"
												bind:value={password}
												required
											/>
										</div>
										<div class="absolute w-60 text-center">
											<p class="text-xs text-(--r)">{error}</p>
										</div>
										<Button.Root type="submit" class="m-auto mt-7 block w-fit"
											>{m.submit()}</Button.Root
										>
									</form>
								{/if}
							</div>
						</div>
					</div>
				{/if}
			{/snippet}
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
