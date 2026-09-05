import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { unwrap } from '$lib/error';
import { type Assignment } from '$lib/util';

export const load: PageServerLoad = async ({ locals, params }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/error');
	}

	try {
		const [classMembership] = unwrap(
			await locals.supabase
				.from('class_memberships')
				.select('class ( name )')
				.eq('class', params.class)
				.eq('user', user.id),
			64
		);

		const assignments: Assignment[] = unwrap(
			await locals.supabase
				.from('assignment_submissions')
				.select('id, assignment ( id, name, description, due_date, class ), submitted ')
				.eq('user', user.id)
				.eq('class', params.class),
			65
		);

		const assignmentsSorted = assignments.sort((a, b) =>
			new Date(a.assignment.due_date) > new Date(b.assignment.due_date) ? 1 : -1
		);

		const upcomingAssignments = assignmentsSorted.filter(
			(a: Assignment) => a.submitted === null
		);
		const submittedAssignments = assignmentsSorted.filter(
			(a: Assignment) => a.submitted !== null
		);

		return { upcomingAssignments, submittedAssignments, title: classMembership.class.name };
	} catch {
		return redirect(303, '/error');
	}
};
