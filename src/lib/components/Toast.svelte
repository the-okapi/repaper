<script lang="ts">
	import X from '@lucide/svelte/icons/x';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import CircleX from '@lucide/svelte/icons/circle-x';

	let { state = 'default', message, closeToast } = $props();
</script>

<div
	class="relative flex w-80 items-center gap-2 rounded-xl border border-(--o) bg-(--bg) p-5 shadow-2xl"
>
	{#if state === 'success'}
		<CircleCheck size={20} color="var(--green)" />
	{:else if state === 'error'}
		<CircleX size={20} color="var(--r)" />
	{/if}
	{message}
	<button
		onclick={closeToast}
		class="absolute top-2 right-2 cursor-pointer rounded-md p-1 text-right hover:bg-(--s)"
		><X size={15} /></button
	>
</div>
