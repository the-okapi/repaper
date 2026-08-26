import { fail, redirect } from '@sveltejs/kit';
import type { RouteParams } from './$types';
import { object, string, safeParse } from 'valibot';
import { m } from '$lib/paraglide/messages';
import { unwrap, unwrapNoData } from '$lib/error';

type ActionData = {
	request: Request;
	locals: App.Locals;
	params: RouteParams;
};

const NameSchema = object({
	name: string()
});

export const changeName = async ({ request, locals, params }: ActionData) => {
	const formData = safeParse(NameSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return fail(400, { nameMessage: m.something_happened(), name: '' });
	}

	const { name } = formData.output;

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
				.eq('class', params.class)
				.eq('admin', true),
			19
		);

		if (!check?.[0]) {
			return fail(403, { nameMessage: m.something_happened(), name });
		}

		unwrapNoData(
			await locals.supabase
				.from('assignments')
				.update({
					name
				})
				.eq('id', params.assignment)
				.eq('class', params.class),
			20
		);
	} catch {
		return fail(500, { nameMessage: m.something_happened(), name });
	}

	return { nameMessage: m.successfully_changed(), name: '', success: m.name() };
};

const DescriptionSchema = object({
	description: string()
});

export const changeDescription = async ({ request, locals, params }: ActionData) => {
	const formData = safeParse(DescriptionSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return fail(400, { descriptionMessage: m.something_happened(), description: '' });
	}

	const { description } = formData.output;

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
				.eq('class', params.class)
				.eq('admin', true),
			21
		);

		if (!check?.[0]) {
			return fail(403, { descriptionMessage: m.something_happened(), description });
		}

		unwrapNoData(
			await locals.supabase
				.from('assignments')
				.update({
					description
				})
				.eq('id', params.assignment)
				.eq('class', params.class),
			22
		);
	} catch {
		return fail(500, { descriptionMessage: m.something_happened(), description });
	}

	return {
		descriptionMessage: m.successfully_changed(),
		description: '',
		success: 'Description'
	};
};

const DueDateSchema = object({
	dueDate: string()
});

export const changeDueDate = async ({ request, locals, params }: ActionData) => {
	const formData = safeParse(DueDateSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return fail(400, { dueDateMessage: m.something_happened(), dueDate: '' });
	}

	const { dueDate } = formData.output;

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
				.eq('class', params.class)
				.eq('admin', true),
			23
		);

		if (!check?.[0]) {
			return fail(403, { dueDateMessage: m.something_happened(), dueDate });
		}

		unwrapNoData(
			await locals.supabase
				.from('assignments')
				.update({
					due_date: dueDate
				})
				.eq('id', params.assignment)
				.eq('class', params.class),
			24
		);
	} catch {
		return fail(500, { dueDateMessage: m.something_happened(), dueDate });
	}

	return { dueDateMessage: m.successfully_changed(), dueDate: '', success: m.due_date() };
};
export const deleteAssignment = async ({ locals, params }: ActionData) => {
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
			25
		);

		if (!check?.[0]) {
			return fail(403, { deleteMessage: m.something_happened() });
		}

		unwrapNoData(
			await locals.supabase
				.from('assignments')
				.delete()
				.eq('id', params.assignment)
				.eq('class', params.class),
			26
		);
	} catch {
		return fail(500, { deleteMessage: m.something_happened() });
	}

	return { success: m.delete() };
};
