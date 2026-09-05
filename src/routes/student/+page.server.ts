import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { unwrap } from '$lib/error';
import { m } from '$lib/paraglide/messages';

export const load: PageServerLoad = async ({ locals }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	try {
		const classMemberships = unwrap(
			await locals.supabase
				.from('class_memberships')
				.select('id, class ( id, name, organization ), admin')
				.eq('user', user.id),
			17
		);

		return {
			classes: classMemberships,
			title: m.home()
		};
	} catch {
		return redirect(303, '/error');
	}
};
