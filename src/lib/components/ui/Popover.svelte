<script lang="ts">
	import Loader from '@lucide/svelte/icons/loader-circle';
	import Check from '@lucide/svelte/icons/check';
	import { Popover, Button } from 'bits-ui';

	let {
		children,
		bClass = '',
		questionMark = true,
		button = true,
		saving = false,
		message = '',
		...props
	} = $props();
</script>

<Popover.Root>
	{#if questionMark}
		<Popover.Trigger
			tabindex={-1}
			{...props}
			class="m-auto h-6 w-6 cursor-pointer items-center justify-center rounded-[50%] align-baseline hover:bg-(--fg)/10 disabled:cursor-not-allowed disabled:hover:bg-transparent data-[state=open]:bg-(--fg)/10"
			>?</Popover.Trigger
		>
	{:else if button}
		<Popover.Trigger>
			<Button.Root class={bClass}>
				{message}
			</Button.Root>
		</Popover.Trigger>
	{:else}
		<Popover.Trigger
			tabindex={-1}
			{...props}
			class="m-auto h-6 w-6 cursor-pointer items-center justify-center rounded-[50%] align-baseline hover:bg-(--fg)/10 disabled:cursor-not-allowed disabled:hover:bg-transparent data-[state=open]:bg-(--fg)/10"
		>
			{#if saving}
				<Loader class="animate-spin m-auto" size={17} />
			{:else}<Check size={17} class="m-auto" />
			{/if}
		</Popover.Trigger>
	{/if}
	<Popover.Portal>
		<Popover.Content
			class="w-fit z-50 rounded-md border border-(--o) bg-(--bg) px-5 py-3 text-center {bClass}"
			sideOffset={5}
			tabindex={-1}
		>
			<p>{@render children()}</p>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
