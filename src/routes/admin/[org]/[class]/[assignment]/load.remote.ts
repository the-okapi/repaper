import { getRequestEvent, query } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { unwrap } from '$lib/error';
import { string } from 'valibot';

export const loadStudents = query(string(), async (className) => {
	const { locals } = getRequestEvent();

	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	try {
		const students = unwrap(
			await locals.supabase
				.from('class_memberships')
				.select('user ( id, name )')
				.eq('class', className)
				.eq('admin', false),
			98
		);

		return {
			students: students.map((a: { user: { id: string; name: string } }) => ({
				value: a.user.id,
				label: a.user.name
			}))
		};
	} catch {
		return redirect(303, '/error');
	}
});
