import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { m } from '$lib/paraglide/messages';

export const load: PageLoad = async ({ parent }) => {
	const data = await parent();
	if (data.loggedIn) {
		return redirect(307, '/home');
	}

	return {
		title: m.sign_up()
	};
};
