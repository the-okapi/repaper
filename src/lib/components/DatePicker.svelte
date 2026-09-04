<script lang="ts">
	import Calendar from '@lucide/svelte/icons/calendar-days';
	import { Button, Popover } from 'bits-ui';
	import { fly } from 'svelte/transition';
	import { getLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages';
	import { formatDate } from '$lib/util';
	import { onMount } from 'svelte';

	let { value = $bindable(''), day = $bindable(null), defaultValue = null, ...props } = $props();

	const today = $state(new Date());

	let month = $state(today.getMonth());
	let monthName = $derived(
		new Date(2026, month, 1).toLocaleString(getLocale(), { month: 'long' })
	);
	let year = $state(today.getFullYear());

	let firstDayOfMonth = $derived(new Date(year, month, 1).getDay());

	let canGoBack = $derived(
		year > today.getFullYear() ||
			(year === today.getFullYear() &&
				((today.getDate() !== getNumDays(today.getMonth()) && month > today.getMonth()) ||
					month > today.getMonth() + 1))
	);

	let canGoForward = $derived(
		year < today.getFullYear() + 5 ||
			(year === today.getFullYear() + 5 && month < today.getMonth())
	);

	let open = $state(false);

	function click(num: number) {
		if (day?.year === year && day?.month === month && day?.day === num) {
			day = null;
			value = '';
		} else {
			day = {
				year,
				month,
				day: num
			};
			value = new Date(day.year, day.month, day.day, 0, 1).toISOString();
			setTimeout(() => {
				open = false;
			}, 100);
		}
	}

	function previousMonth() {
		if (canGoBack) {
			if (month === 0) {
				month = 11;
				year--;
			} else {
				month = month - 1;
			}
		}
	}

	function nextMonth() {
		if (canGoForward) {
			if (month === 11) {
				month = 0;
				year++;
			} else {
				month = month + 1;
			}
		}
	}

	function getNumDays(m: number) {
		switch (m) {
			case 1:
				return year % 4 === 0 ? 29 : 28;
			case 3:
			case 5:
			case 8:
			case 10:
				return 30;
			default:
				return 31;
		}
	}

	onMount(() => {
		if (today.getDate() === getNumDays(today.getMonth())) {
			if (month !== 11) {
				month++;
			} else {
				month = 0;
			}
		}
		if (defaultValue) {
			const d = new Date(defaultValue);
			day = {
				year: d.getFullYear(),
				month: d.getMonth(),
				day: d.getDate()
			};
		}
	});
</script>

<input {value} type="hidden" {...props} />

<Popover.Root bind:open>
	<div class="mt-1 flex">
		<div class="w-10">
			<Popover.Trigger
				data-button-root
				class="flex size-10 items-center justify-center p-0!"
				type="button"
			>
				<Calendar size={20} />
			</Popover.Trigger>
		</div>
		<p class="my-auto ml-3 text-sm">
			{#if value !== ''}
				{formatDate(value)}
			{:else}
				{m.date_not_selected()}
			{/if}
		</p>
	</div>
	<Popover.Portal>
		<Popover.Content side="right" sideOffset={10} class="p-4!" forceMount>
			{#snippet child({ wrapperProps, props, open })}
				{#if open}
					<div {...wrapperProps}>
						<div {...props} transition:fly={{ x: -10 }}>
							<div class="flex w-70">
								<Button.Root
									class="ghost-button"
									disabled={!canGoBack}
									onclick={previousMonth}>←</Button.Root
								>
								<h2 class="w-full text-center text-xl font-bold">
									{monthName}
									{year}
								</h2>
								<Button.Root
									class="ghost-button"
									onclick={nextMonth}
									disabled={!canGoForward}>→</Button.Root
								>
							</div>
							<div class="grid grid-cols-7">
								<div class="calendar-day" data-disabled>{m.sun()}</div>
								<div class="calendar-day" data-disabled>{m.mon()}</div>
								<div class="calendar-day" data-disabled>{m.tue()}</div>
								<div class="calendar-day" data-disabled>{m.wed()}</div>
								<div class="calendar-day" data-disabled>{m.thu()}</div>
								<div class="calendar-day" data-disabled>{m.fri()}</div>
								<div class="calendar-day" data-disabled>{m.sat()}</div>

								{#each { length: 37 }, i}
									{const num = $derived(i - firstDayOfMonth + 1)}
									{const numDays = $derived(getNumDays(month))}
									{#if num > 0 && num <= numDays}
										{#if month === today.getMonth() && year === today.getFullYear() && num <= today.getDate()}
											<Button.Root class="calendar-day" disabled>
												{num}
											</Button.Root>
										{:else}
											<Button.Root
												class="calendar-day {day?.year === year &&
												day?.month === month &&
												day?.day === num
													? 'bg-(--p)! text-(--p-fg)!'
													: ''}"
												onclick={() => click(num)}
											>
												{num}
											</Button.Root>
										{/if}
									{:else}
										<div class="w-8"></div>
									{/if}
								{/each}
							</div>
						</div>
					</div>
				{/if}
			{/snippet}
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>

<style>
	.shadow {
		&:hover {
			box-shadow:
				0 0 0 1.5px var(--bg),
				0 0 0 3.5px var(--p) !important;
		}
		&::selection {
			background-color: var(--p) !important;
		}
	}
</style>
