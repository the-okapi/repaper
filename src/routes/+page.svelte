<svelte:head>
	<title>Repaper</title>
</svelte:head>

<div class="relative flex h-[calc(100vh-5rem)] w-screen items-stretch justify-center px-10 py-7">
	<div class="flex h-full w-full flex-col items-center justify-center overflow-hidden">
		<h1>AI BE</h1>
		<h1 class="gone">GONE</h1>
	</div>
	<div class="w-20"></div>
	<div class="h-full w-200 rounded-3xl border border-(--o) bg-(--bg) p-7">
		<h2 class="mb-3 text-center text-5xl font-bold">Repaper</h2>
		<p class="text-center text-2xl">Real Writing, Real People</p>
		<div class="h-5"></div>
		<ul class="text-xl">
			<li>No Copy/Paste from AI</li>
			<li>Assignments</li>
		</ul>
	</div>
</div>

<style>
	h1 {
		font-size: 16rem;
		font-weight: 900;
		line-height: 14rem;
		letter-spacing: -0.5rem;
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

	.gone {
		background: linear-gradient(
			90deg,
			var(--red),
			var(--red),
			var(--yellow),
			var(--green),
			var(--turquoise),
			var(--blue),
			var(--purple),
			var(--purple)
		);
		background-size: 400% 100%;
		width: fit-content;
		background-clip: text;
		color: transparent;
		animation: gradient 30s linear infinite;
	}

	li {
		list-style: inside;
	}
</style>
