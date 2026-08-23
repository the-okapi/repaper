import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { HttpError, unwrap, unwrapNoData } from '$lib/error';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	try {
		const [a] = unwrap(
			await locals.supabase
				.from('assignment_submissions')
				.select(
					'assignment ( id, name, description, due_date, class ), document ( id, content ), submitted'
				)
				.eq('id', params.assignment)
				.eq('user', user.id),
			29
		);

		if (a === undefined || a === null) {
			throw new HttpError('/home', 404);
		}

		const assignment = {
			...a.assignment,
			submitted: a.submitted
		};

		if (a.document) {
			return {
				title: assignment.name,
				assignment,
				document: a.document
			};
		}

		const [document] = unwrap(
			await locals.supabase
				.from('documents')
				.insert({
					user: user.id,
					assignment: assignment.id,
					class: assignment.class
				})
				.select('id'),
			30
		);

		unwrapNoData(
			await locals.supabase
				.from('assignment_submissions')
				.update({
					document: document.id
				})
				.eq('id', params.assignment)
				.eq('user', user.id),
			33
		);

		return {
			title: assignment.name,
			assignment,
			document: {
				id: document.id,
				content: ''
			}
		};
	} catch (error: any) {
		if (error.statusCode === 500) {
			return redirect(303, '/error');
		} else if (error.statusCode === 404) {
			return redirect(303, '/home');
		}
	}
};

export const actions = {
	submit: async ({ locals, params }) => {
		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return redirect(303, '/');
		}

		try {
			const [assignmentSubmission] = unwrap(
				await locals.supabase
					.from('assignment_submissions')
					.select('submitted')
					.eq('id', params.assignment)
					.eq('user', user.id),
				31
			);

			if (!assignmentSubmission) {
				return redirect(303, '/home');
			} else if (assignmentSubmission.submitted !== null) {
				return fail(409);
			}

			unwrapNoData(
				await locals.supabase
					.from('assignment_submissions')
					.update({
						submitted: new Date().toISOString()
					})
					.eq('id', params.assignment)
					.eq('user', user.id),
				32
			);
		} catch {
			return fail(500);
		}
	},
	undo: async ({ locals, params }) => {
		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return redirect(303, '/');
		}

		try {
			const [assignmentSubmission] = unwrap(
				await locals.supabase
					.from('assignment_submissions')
					.select('submitted')
					.eq('id', params.assignment)
					.eq('user', user.id),
				33
			);

			if (!assignmentSubmission) {
				return redirect(303, '/home');
			} else if (assignmentSubmission.submitted === null) {
				return fail(409);
			}

			unwrapNoData(
				await locals.supabase
					.from('assignment_submissions')
					.update({
						submitted: null
					})
					.eq('id', params.assignment)
					.eq('user', user.id),
				34
			);
		} catch {
			return fail(500);
		}
	}
} satisfies Actions;
