<svelte:head>
	<title>Repaper</title>
</svelte:head>

<div class="relative flex h-[calc(100vh-5rem)] w-screen items-stretch justify-center px-7">
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
</div>

<style>
	h1 {
		font-size: 9rem;
		font-weight: 900;
		line-height: 8rem;
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

	.gradient1 {
		background: linear-gradient(
			90deg,
			var(--red),
			var(--yellow),
			var(--green),
			var(--turquoise),
			var(--blue),
			var(--purple)
		);
	}

	.gradient2 {
		background: linear-gradient(
			90deg,
			var(--purple),
			var(--blue),
			var(--turquoise),
			var(--green),
			var(--yellow),
			var(--red)
		);
	}

	.gradient {
		background-size: 400% 100%;
		background-clip: text;
		color: transparent;
		animation: gradient 50s linear infinite;
	}

	.gradient3 {
		animation: gradient 30s linear infinite !important;
	}

	li {
		list-style: inside;
	}
</style>
