<script lang="ts">
	import { PUBLIC_HELP_URL } from '$app/env/public';
	import { m } from '$lib/paraglide/messages';

	import { Button } from 'bits-ui';
</script>

<svelte:head>
	<title>Repaper</title>
</svelte:head>

<!-- <div class="relative flex h-[calc(100vh-5rem)] w-screen items-stretch justify-center px-7">
	<div class="ml-5 flex h-full w-full flex-col justify-center overflow-hidden">
		<h1 class="gradient gradient1">Real</h1>
		<h1>People</h1>
		<div class="h-15"></div>
		<h1 class="gradient gradient2">Real</h1>
		<h1>Writing</h1>
	</div>
	<div class="w-20"></div>
	<div class="flex w-200 flex-col">
		<div class="h-7"></div>
		<div class="h-full w-180 rounded-3xl border border-(--o) bg-(--bg) p-7">
			<h2 class="gradient gradient2 gradient3 mb-3 text-center text-5xl font-bold">
				Repaper
			</h2>
			<div class="h-5"></div>
			<ul class="text-xl">
				<li>No Copy/Paste from AI</li>
				<li>Assignments</li>
			</ul>
		</div>
		<div class="h-7"></div>
	</div>
</div> -->

<div class="h-15"></div>
<h1 class="gradient relative text-center">{m.slogan()}</h1>
<h2 class="relative text-center text-3xl">{m.have_trust()}</h2>

<div class="m-auto mt-15 flex w-fit gap-6">
	<Button.Root
		class="gray-button rounded-2xl! px-7! py-4! text-2xl outline-3!"
		href={PUBLIC_HELP_URL}>{m.help()}</Button.Root
	>
	<Button.Root href="/signup" class="rounded-2xl! px-7! py-4! text-2xl outline-3!"
		>{m.sign_up()}</Button.Root
	>
</div>

<div class="h-20"></div>

<div class="flex justify-center gap-7">
	<div class="h-100 w-150 rounded-xl border border-(--o) bg-(--bg) p-7">
		<h2 class="text-center text-3xl font-bold">Why Repaper?</h2>
	</div>

	<div class="h-100 w-150 rounded-xl border border-(--o) bg-(--bg) p-7">
		<h2 class="text-center text-3xl font-bold">About Repaper</h2>
	</div>
</div>

<div class="h-10"></div>

<style>
	h1 {
		font-size: 6rem;
		font-weight: 900;
	}

	@keyframes gradient {
		0% {
			background-position: left;
		}
		50% {
			background-position: right;
		}
		100% {
			background-position: left;
		}
	}

	.gradient {
		background: linear-gradient(
			90deg,
			var(--red),
			20%,
			var(--yellow),
			35%,
			var(--green),
			50%,
			var(--turquoise),
			65%,
			var(--blue),
			85%,
			var(--purple)
		);
		background-size: 400% 100%;
		background-clip: text;
		color: transparent;
		animation: gradient 50s linear infinite;
	}
</style>
