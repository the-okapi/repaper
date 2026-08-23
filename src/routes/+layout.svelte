<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import favicon from '$lib/assets/favicon.png';
	import NavBar from './NavBar.svelte';
	import Background from './Background.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<Background class="fixed top-0 left-0" />

<ModeWatcher
	darkClassNames={['dark']}
	lightClassNames={['light']}
	defaultTheme="turquoise"
	defaultMode="dark"
/>

<div class="nav-bar"><NavBar loggedIn={data.loggedIn} /></div>
<main class="bg-(--bg) transition-colors">{@render children()}</main>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
