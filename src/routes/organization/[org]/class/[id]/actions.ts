import { fail, redirect } from '@sveltejs/kit';
import type { RouteParams } from './$types';
import { object, string, safeParse } from 'valibot';
import { HttpError, unwrap, unwrapNoData } from '$lib/error';
import { UserIdSchema } from '$lib/types';
import { m } from '$lib/paraglide/messages';

type ActionData = {
	request: Request;
	locals: App.Locals;
	params: RouteParams;
};

const AddSchema = object({
	userId: string(),
	email: string()
});

export const add = async ({ request, locals, params }: ActionData) => {
	const formData = safeParse(AddSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return fail(400, { add: m.something_happened(), user: '' });
	}

	const { userId, email } = formData.output;

	try {
		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return redirect(303, '/');
		}

		const check = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('id')
				.eq('organization', params.org)
				.eq('user', user.id)
				.eq('owner', true),
			2
		);

		if (!check?.[0]) {
			throw new HttpError(m.invalid_permissions(), 403);
		}

		const check2 = unwrap(
			await locals.supabase
				.from('classes')
				.select('organization')
				.eq('id', params.id)
				.eq('organization', params.org),
			9
		);

		if (!check2 || check2[0].organization !== params.org) {
			throw new HttpError(m.class_not_found(), 404);
		}

		const check3 = unwrap(
			await locals.supabase
				.from('users')
				.select('id')
				.eq('id', userId)
				.eq('email', email)
				.eq('organization', params.org),
			3
		);

		if (!check3?.[0]) {
			throw new HttpError(m.user_not_found(), 400);
		}

		const check4 = unwrap(
			await locals.supabase
				.from('class_memberships')
				.select('class ( organization )')
				.eq('class', params.id)
				.eq('user', userId),
			4
		);

		if (check4?.[0]) {
			throw new HttpError(m.user_already_class(), 409);
		}

		unwrapNoData(
			await locals.supabase.from('class_memberships').insert({
				user: userId,
				class: params.id,
				owner: false
			}),
			5
		);
	} catch (error: any) {
		if (error.statusCode !== 500) {
			return fail(error.statusCode, { add: error.message, user: userId });
		} else {
			return fail(500, { add: m.something_happened(), user: userId });
		}
	}

	return { success: true };
};

export const remove = async ({ request, locals, params }: ActionData) => {
	const formData = safeParse(UserIdSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return fail(400, { remove: m.something_happened() });
	}

	const { userId } = formData.output;

	try {
		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return redirect(303, '/');
		}

		const check = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('id')
				.eq('user', user.id)
				.eq('owner', true)
				.eq('organization', params.org),
			7
		);

		if (!check?.[0]) {
			return new HttpError(m.invalid_permissions(), 403);
		}

		unwrapNoData(
			await locals.supabase
				.from('class_memberships')
				.delete()
				.eq('user', userId)
				.eq('class', params.id),
			8
		);
	} catch (error: any) {
		if (error.statusCode !== 500) {
			return fail(error.statusCode, { remove: error.message, userId });
		} else {
			return fail(500, { remove: m.something_happened(), userId });
		}
	}

	return { success: true };
};
