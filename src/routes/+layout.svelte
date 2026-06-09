<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import { resolve } from '$app/paths';
	import { ModeWatcher } from 'mode-watcher';
	import { goto } from '$app/navigation';
	import { changed } from '$lib';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import lang, { languageState, setLanguage } from '$lib/lang.svelte';
	import { Loading } from '$lib/components';

	let { children } = $props();

	function oncontextmenu(event: Event) {
		event.preventDefault();
	}

	let fullscreen: string[] = $state([]);

	function go(where: any) {
		if ($changed) {
			if (
				confirm(
					lang(
						languageState,
						'Are you sure you want to leave this page? Changes may not be saved.',
						'Vous êtes certains que vous voulez partir cette page. Vos changements peut-être ne seront pas enregistrés.'
					)
				)
			) {
				changed.set(false);
				goto(resolve(where));
			}
		} else {
			goto(resolve(where));
		}
	}

	let loading = $state(true);

	onMount(() => {
		let lang = localStorage.getItem('repaper-lang');
		if (lang === 'en' || lang === 'fr') {
			setLanguage(lang);
		}
		loading = false;

		if (page.params.document != null) {
			fullscreen = page.url.searchParams.getAll('fullscreen');
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Repaper</title>
</svelte:head>

<svelte:window {oncontextmenu} />

<Loading show={loading} />

<ModeWatcher
	lightClassNames={['light']}
	darkClassNames={['dark']}
	defaultTheme="default-georgia"
	defaultMode="light"
/>

<main class="h-screen w-screen">
	{#if fullscreen.length === 0}
		<nav class="fixed z-50 h-screen w-70 border-r border-(--o) bg-(--bg) pt-9 flex flex-wrap">
			<div class="w-full">
				<a href={resolve('/')}><h2 class="text-center text-4xl font-black">Repaper</h2></a>
				<div class="pt-4 px-7">
					<button class="a" onclick={() => go('/create')}
						>{lang(languageState, 'Create a Document', 'Créer un Document')}</button
					><br />
					<button class="a" onclick={() => go('/open')}
						>{lang(languageState, 'Open a Document', 'Ouvrir un Document')}</button
					><br />
					<button class="a" onclick={() => go('/recents')}
						>{lang(languageState, 'Recent Documents', 'Documents Récents')}</button
					><br />
					<button class="a" onclick={() => go('/settings')}
						>{lang(languageState, 'Settings', 'Paramètres')}</button
					><br />
					<div class="w-full border-(--o) border-b my-2"></div>
					<button class="a" onclick={() => go('/help')}
						>{lang(languageState, 'Help', 'Aide')}</button
					><br />
					<button class="a" onclick={() => go('/about')}
						>{lang(languageState, 'About', 'À Propos')}</button
					><br />
				</div>
			</div>
			<br />
			<div class="text-center pb-3 flex flex-col relative justify-end w-full">
				<div>
					<p class="text-[0.8rem]">repaper@unlimitedstuffltd.com</p>
					<a
						class="a text-center text-[0.8rem] underline underline-offset-2"
						href="https://github.com/the-okapi/repaper"
						target="_blank"
					>
						https://github.com/the-okapi/repaper
					</a>
				</div>
			</div>
		</nav>
		<div class="flex">
			<div class="w-70"></div>
			<div class="flex h-screen items-center justify-center" style="width: calc(100vw - 17.5rem)">
				{@render children()}
			</div>
		</div>
	{:else}
		<div class="flex h-screen items-center justify-center">
			{@render children()}
		</div>
	{/if}
</main>
