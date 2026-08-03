import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { unwrap } from '$lib/error';
import { m } from '$lib/paraglide/messages';

export const load: PageServerLoad = async ({ locals, params }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	try {
		const check = unwrap(
			await locals.supabase
				.from('class_memberships')
				.select('class ( name )')
				.eq('user', user.id)
				.eq('admin', true)
				.eq('class', params.class),
			15
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		const assignments = unwrap(
			await locals.supabase
				.from('assignments')
				.select('id, name, description')
				.eq('class', params.class),
			16
		);

		return {
			assignments,
			title: check[0].class.name + ' - ' + m.assignments()
		};
	} catch {
		return redirect(303, '/error');
	}
};
