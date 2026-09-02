<script lang="ts">
	import { PUBLIC_HELP_URL } from '$app/env/public';
	import { m } from '$lib/paraglide/messages';
	import { Button } from 'bits-ui';
</script>

<svelte:head>
	<title>Repaper</title>
</svelte:head>

<div class="h-25"></div>

<h1 class="gradient relative text-center text-[5.5rem] leading-32 font-black">{m.slogan()}</h1>
<h2 class="relative text-center text-3xl">{m.have_trust()}</h2>

<div class="m-auto mt-10 flex w-fit gap-6">
	<Button.Root
		class="gray-button rounded-2xl! px-6.5! py-3.5! text-2xl outline-3! hover:outline-offset-[1.5px]!"
		href={PUBLIC_HELP_URL}>{m.help()}</Button.Root
	>
	<Button.Root
		href="/signup"
		class="rounded-2xl! px-6.5! py-3.5! text-2xl outline-3! hover:outline-offset-[1.5px]!"
		>{m.sign_up()}</Button.Root
	>
</div>

<div class="h-20"></div>

<div class="flex justify-center gap-7">
	<div class="h-80 w-110 rounded-xl border border-(--o) bg-(--bg) p-7 pt-10">
		<h2 class="text-center text-4xl font-bold">{m.word_processing()}</h2>
		<br />
		<ul>
			<li>{m.no_copy_paste_ai()}</li>
			<li>{m.consistent_font_spacing()}</li>
			<li>{m.images_and_links()}</li>
			<li>{m.no_autocorrect_spellchecking()}</li>
			<li>{m.support_accents()}</li>
		</ul>
	</div>

	<div class="h-80 w-110 rounded-xl border border-(--o) bg-(--bg) p-7 pt-10">
		<h2 class="text-center text-4xl font-bold">{m.no_more()}</h2>
		<br />
		<ul>
			<li>{m.losing_homework()}</li>
			<li>{m.illegible_handwriting()}</li>
			<li>{m.wrong_fonts()}</li>
			<li>Attaching the wrong document</li>
			<li>Forgetting the due date</li>
		</ul>
	</div>

	<div class="relative h-80 w-110 rounded-xl border border-(--o) bg-(--bg) p-7 pt-10">
		<h2 class="text-center text-4xl font-bold">Assignments</h2>
		<br />
		<ul>
			<li>Classes, to organize students</li>
			<li>Due dates for assignments</li>
			<li class="my-1.5 leading-6">One document per student for each assignment</li>
			<li class="opacity-30">Gradebook*</li>
		</ul>
		<p class="absolute bottom-2 left-0 w-110 text-center text-sm opacity-30">
			*Feature is still a work in progress.
		</p>
	</div>
</div>

<div class="h-10"></div>

<p class="relative text-center text-2xl">
	{m.contact()} <strong>repaper@unlimitedstuffltd.com</strong>
	{m.if_questions()}
</p>

<div class="h-10"></div>

<style>
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

	li {
		list-style: inside;
		font-size: 1.5rem;
	}
</style>
