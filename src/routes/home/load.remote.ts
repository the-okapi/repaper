import { getRequestEvent, query } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { unwrap } from '$lib/error';

export const loadAdmin = query(async () => {
	const { locals } = getRequestEvent();

	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	try {
		const orgData = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('organization ( id, name ), admin')
				.eq('user', user.id)
				.limit(1),
			76
		);

		if (orgData.length === 0) {
			return { organization: null, classes: [] };
		}

		const organization = {
			admin: orgData[0].admin,
			id: orgData[0].organization.id,
			name: orgData[0].organization.name
		};

		const data = unwrap(
			await locals.supabase
				.from('class_memberships')
				.select('class ( id, name )')
				.eq('user', user.id)
				.eq('admin', true),
			77
		);

		const classes = data.map((c: { class: { id: string; name: string } }) => c.class);

		return { classes, organization };
	} catch {
		return redirect(303, '/error');
	}
});

export const loadStudent = query(async () => {
	const { locals } = getRequestEvent();

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
				.select('id, class ( id, name ), admin')
				.eq('user', user.id),
			17
		);

		return {
			classes: classMemberships
		};
	} catch {
		return redirect(303, '/error');
	}
});

type Assignment = {
	id: string;
	assignment: {
		id: string;
		name: string;
		due_date: string;
	};
};

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
				.select('id, assignment ( id, name, due_date ) '),
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
