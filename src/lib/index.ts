import { writable } from 'svelte/store';

export const changed = writable(false);

export type DocumentLink = {
	title: string;
	code: string;
	mode: string;
	link: any;
	token: string;
};

export type SelectItemType = {
	value: string;
	label: string;
};
