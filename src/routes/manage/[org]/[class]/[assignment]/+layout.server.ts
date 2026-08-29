import { unwrap } from '$lib/error';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params, locals }) => {
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
				.select('id')
				.eq('class', params.class)
				.eq('user', user.id)
				.eq('admin', true),
			27
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		const [assignment] = unwrap(
			await locals.supabase
				.from('assignments')
				.select('id, name, description, due_date')
				.eq('id', params.assignment)
				.eq('class', params.class),
			28
		);

		const submissions = unwrap(
			await locals.supabase
				.from('assignment_submissions')
				.select('id, user ( name ), submitted, document')
				.eq('assignment', params.assignment),
			34
		);

		return { assignment, title: assignment.name, submissions };
	} catch {
		return redirect(303, '/error');
	}
};
