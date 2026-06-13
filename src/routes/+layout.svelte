<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import { resolve } from '$app/paths';
	import { ModeWatcher } from 'mode-watcher';
	import { goto } from '$app/navigation';
	import { changed } from '$lib';
	import { onMount } from 'svelte';
	import lang, { languageState as lS, setLanguage } from '$lib/lang.svelte';
	import { ContextMenu, Loading } from '$lib/components';
	import fullscreen from '$lib/fullscreen';

	let { children } = $props();

	function oncontextmenu(event: Event) {
		event.preventDefault();
	}

	function go(where: any) {
		if ($changed) {
			if (
				confirm(
					lang(
						lS,
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
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:window {oncontextmenu} />

<Loading show={loading} />

<ModeWatcher
	lightClassNames={['light']}
	darkClassNames={['dark']}
	defaultTheme="default-georgia"
	defaultMode="light"
/>

<main class="h-screen w-screen text-center">
	<nav
		class="fixed z-40 text-left h-screen w-70 border-r border-(--o) bg-(--bg) pt-9 flex flex-wrap"
		class:hidden={$fullscreen}
	>
		<div class="w-full">
			<a href={resolve('/')}><h2 class="text-center text-4xl font-black">Repaper</h2></a>
			<div class="pt-4 px-7">
				<ContextMenu
					class="w-fit"
					actions={[
						{
							label: lang(lS, 'Open in New Tab', 'Ouvrir dans un Nouvel Onglet'),
							action: () => window.open('/create', '_blank')
						}
					]}
				>
					<button class="a" onclick={() => go('/create')}
						>{lang(lS, 'Create a Document', 'Créer un Document')}</button
					>
				</ContextMenu>
				<ContextMenu
					class="w-fit"
					actions={[
						{
							label: lang(lS, 'Open in New Tab', 'Ouvrir dans un Nouvel Onglet'),
							action: () => window.open('/open', '_blank')
						}
					]}
				>
					<button class="a" onclick={() => go('/open')}
						>{lang(lS, 'Open a Document', 'Ouvrir un Document')}</button
					>
				</ContextMenu>
				<ContextMenu
					class="w-fit"
					actions={[
						{
							label: lang(lS, 'Open in New Tab', 'Ouvrir dans un Nouvel Onglet'),
							action: () => window.open('/recents', '_blank')
						}
					]}
				>
					<button class="a" onclick={() => go('/recents')}
						>{lang(lS, 'Recent Documents', 'Documents Récents')}</button
					>
				</ContextMenu>
				<ContextMenu
					class="w-fit"
					actions={[
						{
							label: lang(lS, 'Open in New Tab', 'Ouvrir dans un Nouvel Onglet'),
							action: () => window.open('/settings', '_blank')
						}
					]}
				>
					<button class="a" onclick={() => go('/settings')}
						>{lang(lS, 'Settings', 'Paramètres')}</button
					>
				</ContextMenu>
				<div class="w-full border-(--o) border-b my-2"></div>
				<ContextMenu
					class="w-fit"
					actions={[
						{
							label: lang(lS, 'Open in New Tab', 'Ouvrir dans un Nouvel Onglet'),
							action: () => window.open('/help', '_blank')
						}
					]}
				>
					<button class="a" onclick={() => go('/help')}>{lang(lS, 'Help', 'Aide')}</button>
				</ContextMenu>
				<ContextMenu
					class="w-fit"
					actions={[
						{
							label: lang(lS, 'Open in New Tab', 'Ouvrir dans un Nouvel Onglet'),
							action: () => window.open('/about', '_blank')
						}
					]}
				>
					<button class="a" onclick={() => go('/about')}>{lang(lS, 'About', 'À Propos')}</button>
				</ContextMenu>
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
	<div class="{$fullscreen ? '' : 'ml-70'} inline-flex h-screen items-center justify-center w-fit">
		{@render children()}
	</div>
</main>
