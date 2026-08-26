import { unwrap } from '$lib/error';
import type { Actions, PageServerLoad } from './$types';
import { changeName, changeDescription, changeDueDate, deleteAssignment } from './actions';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
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

		return { assignment, title: assignment.name };
	} catch {
		return redirect(303, '/error');
	}
};

export const actions = {
	changeName,
	changeDescription,
	changeDueDate,
	deleteAssignment
} satisfies Actions;
