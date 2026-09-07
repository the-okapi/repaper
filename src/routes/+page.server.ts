import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { error500 } from '$lib/error';

export const load: PageServerLoad = async ({ parent }) => {
	const data = await parent();
	if (data.loggedIn) {
		return redirect(307, '/student');
	}

	return {
		title: 'Repaper'
	};
};

export const actions = {
	signOut: async ({ locals }) => {
		const { error: e } = await locals.supabase.auth.signOut();

		if (e) {
			console.error(e, 'Error Code 84');
			return error500();
		}

		return redirect(303, '/');
	}
} satisfies Actions;
