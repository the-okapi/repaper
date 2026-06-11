<script lang="ts">
	import { Popover, Button } from 'bits-ui';

	let { children, bClass = '', questionMark = true, message = '', ...props } = $props();
</script>

<Popover.Root>
	{#if questionMark}
		<Popover.Trigger
			tabindex={-1}
			{...props}
			class="m-auto h-6 w-6 cursor-pointer items-center justify-center rounded-[50%] align-baseline hover:bg-(--fg)/10 disabled:cursor-not-allowed disabled:hover:bg-transparent data-[state=open]:bg-(--fg)/10"
			>?</Popover.Trigger
		>
	{:else}
		<Popover.Trigger>
			<Button.Root class="{bClass} h-full">
				{message}
			</Button.Root>
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
