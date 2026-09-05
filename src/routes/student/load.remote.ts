import { query, getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import type { Assignment } from '$lib/util';
import { unwrap } from '$lib/error';

export const loadAssignments = query(async () => {
	const { locals } = getRequestEvent();

	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/error');
	}

	try {
		const assignments: Assignment[] = unwrap(
			await locals.supabase
				.from('assignment_submissions')
				.select('id, assignment ( id, name, description, due_date, class ), submitted '),
			18
		);

		const assignmentsSorted = assignments.sort((a, b) =>
			new Date(a.assignment.due_date) > new Date(b.assignment.due_date) ? 1 : -1
		);

		return assignmentsSorted;
	} catch {
		return redirect(303, '/error');
	}
});
