import { createContext, type Snippet } from 'svelte';

export const [getNavBarContext, setNavBarContext] = createContext<{
	setContent: (snippet: Snippet) => void;
}>();
