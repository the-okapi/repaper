import { redirect } from '@sveltejs/kit';
import { object, string } from 'valibot';
import { m } from '$lib/paraglide/messages';
import { unwrap, unwrapNoData } from '$lib/error';
import { form, getRequestEvent } from '$app/server';

const NameSchema = object({
	name: string(),
	assignment: string(),
	class: string()
});

export const changeName = form(NameSchema, async ({ name, assignment, class: className }) => {
	console.log('change Name');

	const { locals } = getRequestEvent();

	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/home');
	}

	try {
		const [check] = unwrap(
			await locals.supabase
				.from('class_memberships')
				.select('id')
				.eq('user', user.id)
				.eq('class', className)
				.eq('admin', true),
			19
		);

		if (!check) {
			return { nameMessage: m.something_happened(), status: 403 };
		}

		unwrapNoData(
			await locals.supabase
				.from('assignments')
				.update({
					name
				})
				.eq('id', assignment)
				.eq('class', className),
			20
		);
	} catch {
		return { nameMessage: m.something_happened(), status: 500 };
	}

	return { nameMessage: m.successfully_changed(), status: 200 };
});

const DescriptionSchema = object({
	description: string(),
	assignment: string(),
	class: string()
});

export const changeDescription = form(
	DescriptionSchema,
	async ({ description, assignment, class: className }) => {
		const { locals } = getRequestEvent();

		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return redirect(303, '/');
		}

		try {
			const [check] = unwrap(
				await locals.supabase
					.from('class_memberships')
					.select('id')
					.eq('user', user.id)
					.eq('class', className)
					.eq('admin', true),
				21
			);

			if (!check) {
				return { descriptionMessage: m.something_happened(), status: 403 };
			}

			unwrapNoData(
				await locals.supabase
					.from('assignments')
					.update({
						description
					})
					.eq('id', assignment)
					.eq('class', className),
				22
			);
		} catch {
			return { descriptionMessage: m.something_happened(), status: 500 };
		}

		return {
			descriptionMessage: m.successfully_changed(),
			status: 200
		};
	}
);

const DueDateSchema = object({
	dueDate: string(),
	assignment: string(),
	class: string()
});

export const changeDueDate = form(
	DueDateSchema,
	async ({ dueDate, assignment, class: className }) => {
		const dueDateDate = new Date(dueDate);
		const todayDate = new Date();

		if (dueDateDate < todayDate) {
			return { dueDateMessage: m.please_future_date(), status: 400 };
		} else if (
			dueDateDate >
			new Date(todayDate.getFullYear() + 5, todayDate.getMonth(), todayDate.getDate())
		) {
			return { dueDateMessage: m.date_within_five(), status: 400 };
		}

		const { locals } = getRequestEvent();

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
					.eq('user', user.id)
					.eq('class', className)
					.eq('admin', true),
				23
			);

			if (!check?.[0]) {
				return { dueDateMessage: m.something_happened(), status: 403 };
			}

			unwrapNoData(
				await locals.supabase
					.from('assignments')
					.update({
						due_date: dueDate
					})
					.eq('id', assignment)
					.eq('class', className),
				24
			);
		} catch {
			return { dueDateMessage: m.something_happened(), status: 500 };
		}

		return { dueDateMessage: m.successfully_changed(), status: 200 };
	}
);

const DeleteAssignmentSchema = object({
	assignment: string(),
	class: string()
});

export const deleteAssignment = form(
	DeleteAssignmentSchema,
	async ({ assignment, class: className }) => {
		const { locals } = getRequestEvent();

		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return redirect(303, '/');
		}

		try {
			const [check] = unwrap(
				await locals.supabase
					.from('class_memberships')
					.select('id')
					.eq('class', className)
					.eq('user', user.id)
					.eq('admin', true),
				25
			);

			if (!check) {
				return { deleteMessage: m.something_happened(), status: 403 };
			}

			unwrapNoData(
				await locals.supabase
					.from('assignments')
					.delete()
					.eq('id', assignment)
					.eq('class', className),
				26
			);
		} catch {
			return { deleteMessage: m.something_happened(), status: 500 };
		}

		return { status: 200 };
	}
);

const AssignSchema = object({
	students: string(),
	assignment: string(),
	class: string()
});

export const assign = form(
	AssignSchema,
	async ({ students: studentsString, assignment, class: className }) => {
		const students = JSON.parse(studentsString);

		const { locals } = getRequestEvent();

		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return redirect(303, '/');
		}

		try {
			const [check] = unwrap(
				await locals.supabase
					.from('class_memberships')
					.select('id')
					.eq('class', className)
					.eq('user', user.id)
					.eq('admin', true),
				99
			);

			if (!check) {
				return redirect(303, '/home');
			}

			for (let i = 0; i < students.length; i++) {
				unwrapNoData(
					await locals.supabase.from('assignment_submissions').insert({
						user: students[i],
						assignment,
						class: className
					}),
					100
				);
			}
		} catch {
			return redirect(303, '/error');
		}
	}
);
