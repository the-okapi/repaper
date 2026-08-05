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
	name: string(),
	assignment: string()
});

export const changeName = async ({ request, locals, params }: ActionData) => {
	const formData = safeParse(NameSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return fail(400, { nameMessage: m.something_happened(), name: '' });
	}

	const { name, assignment } = formData.output;

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
				.eq('class', params.class),
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
				.eq('id', assignment)
				.eq('class', params.class),
			20
		);
	} catch {
		return fail(500, { nameMessage: m.something_happened(), name });
	}

	return { nameMessage: m.successfully_changed(), name: '' };
};

const DescriptionSchema = object({
	description: string(),
	assignment: string()
});

export const changeDescription = async ({ request, locals, params }: ActionData) => {
	const formData = safeParse(DescriptionSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return fail(400, { descriptionMessage: m.something_happened(), description: '' });
	}

	const { description, assignment } = formData.output;

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
				.eq('class', params.class),
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
				.eq('id', assignment)
				.eq('class', params.class),
			22
		);
	} catch {
		return fail(500, { descriptionMessage: m.something_happened(), description });
	}

	return { descriptionMessage: m.successfully_changed(), description: '' };
};

const DueDateSchema = object({
	dueDate: string(),
	assignment: string()
});

export const changeDueDate = async ({ request, locals, params }: ActionData) => {
	const formData = safeParse(DueDateSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return fail(400, { dueDateMessage: m.something_happened(), dueDate: '' });
	}

	const { dueDate, assignment } = formData.output;

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
				.eq('class', params.class),
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
				.eq('id', assignment)
				.eq('class', params.class),
			24
		);
	} catch {
		return fail(500, { dueDateMessage: m.something_happened(), dueDate });
	}

	return { dueDateMessage: m.successfully_changed(), dueDate: '' };
};
