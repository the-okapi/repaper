import { redirect, fail } from '@sveltejs/kit';
import resend from '$lib/resend';
import { object, string, safeParse } from 'valibot';
import type { RouteParams } from './$types';
import { UserIdSchema } from '$lib/util';
import { unwrap, unwrapNoData, HttpError } from '$lib/error';
import { m } from '$lib/paraglide/messages';

type ActionData = {
	request: Request;
	params: RouteParams;
	locals: App.Locals;
};

const RenameSchema = object({
	name: string()
});

export const rename = async ({ request, params, locals }: ActionData) => {
	const formData = safeParse(RenameSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return redirect(303, '/error');
	}

	const { name } = formData.output;

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
				.select('organization ( name )')
				.eq('organization', params.org)
				.eq('user', user.id)
				.eq('admin', true),
			40
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		unwrapNoData(
			await locals.supabase
				.from('organizations')
				.update({
					name
				})
				.eq('id', params.org)
				.eq('name', check[0].organization.name),
			41
		);
	} catch {
		return fail(500, { renameError: true, message: m.something_happened() });
	}

	return { success: true };
};

const CreateSchema = object({
	name: string(),
	email: string()
});

export const create = async ({ locals, request, params }: ActionData) => {
	const formData = safeParse(CreateSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return fail(400, { createError: true, message: m.something_happened() });
	}

	const { name, email } = formData.output;

	try {
		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return redirect(303, '/');
		}

		const usersFound = unwrap(
			await locals.supabase.from('users').select('id').eq('email', email),
			42
		);

		const invitationsFound = unwrap(
			await locals.supabase.from('invitations').select('id').eq('email', email),
			43
		);

		const foundData = [...usersFound, ...invitationsFound];

		console.log(foundData);

		if (foundData.length > 0) {
			return fail(409, {
				createError: true,
				message: m.user_exists(),
				email,
				name
			});
		}

		const check = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('organization ( name )')
				.eq('user', user.id)
				.eq('admin', true)
				.eq('organization', params.org),
			44
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		const invitation = unwrap(
			await locals.supabase
				.from('invitations')
				.insert({
					name,
					email,
					organization: params.org
				})
				.select('id'),
			45
		);

		try {
			// Error Code 46
			await resend.emails.send({
				from: 'Repaper <repaper@unlimitedstuffltd.com>',
				to: email,
				template: {
					id: 'invitation-email',
					variables: {
						NAME: name,
						ORGANIZATION: check[0].organization.name,
						LINK:
							'https://repaper.unlimitedstuffltd.com/invitation/' +
							params.org +
							'/' +
							invitation[0].id
					}
				}
			});
		} catch (error: any) {
			console.error(error, 'Error Code 46');
			throw new HttpError(m.something_happened(), 500);
		}
	} catch {
		return fail(500, { createError: true, message: m.something_happened(), email, name });
	}

	return { createSuccess: email, success: true };
};

const RevokeSchema = object({
	invitation: string()
});

export const revoke = async ({ request, locals, params }: ActionData) => {
	const formData = safeParse(RevokeSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return redirect(303, '/error');
	}

	const { invitation } = formData.output;

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
				.eq('admin', true),
			47
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		unwrapNoData(
			await locals.supabase
				.from('invitations')
				.delete()
				.eq('id', invitation)
				.eq('organization', params.org),
			48
		);
	} catch {
		return redirect(303, '/error');
	}

	return { success: true };
};

const RenameMemberSchema = object({
	user: string(),
	name: string()
});

export const renameMember = async ({ request, locals, params }: ActionData) => {
	const formData = safeParse(RenameMemberSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return fail(400, { renameMemberError: true, message: m.something_happened() });
	}

	const { user: userId, name } = formData.output;

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
				.eq('organization', params.org)
				.eq('admin', true),
			49
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		const check2 = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('user')
				.eq('user', userId)
				.eq('organization', params.org),
			50
		);

		if (!check2?.[0]) {
			return fail(400, { renameMemberError: true, message: m.nonexistant_user() });
		}

		unwrapNoData(
			await locals.supabase
				.from('users')
				.update({
					name
				})
				.eq('id', userId),
			51
		);
	} catch {
		return fail(500, { renameMemberError: true, message: m.something_happened() });
	}

	return { success: true };
};

export const deleteMember = async ({ request, params, locals }: ActionData) => {
	const formData = safeParse(UserIdSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return redirect(303, '/error');
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
				.eq('organization', params.org)
				.eq('admin', true)
				.eq('user', user.id),
			52
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		unwrapNoData(
			await locals.supabase
				.from('organization_memberships')
				.delete()
				.eq('organization', params.org)
				.eq('user', userId),
			53
		);

		const date = new Date();

		date.setDate(date.getDate() + 30);

		unwrapNoData(
			await locals.supabase
				.from('users')
				.update({ can_delete: date.toISOString() })
				.eq('id', userId),
			54
		);
	} catch {
		return redirect(303, '/error');
	}

	return { success: true };
};

export const restore = async ({ request, locals, params }: ActionData) => {
	const formData = safeParse(UserIdSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return redirect(303, '/error');
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
				.eq('organization', params.org)
				.eq('user', user.id)
				.eq('admin', true),
			55
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		unwrapNoData(
			await locals.supabase.from('organization_memberships').insert({
				user: userId,
				organization: params.org,
				admin: false
			}),
			56
		);

		unwrapNoData(
			await locals.supabase
				.from('users')
				.update({
					can_delete: null
				})
				.eq('id', userId)
				.eq('organization', params.org),
			57
		);
	} catch {
		return redirect(303, '/error');
	}

	return { success: true };
};

export const promote = async ({ request, locals, params }: ActionData) => {
	const formData = safeParse(UserIdSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return redirect(303, '/error');
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
				.eq('organization', params.org)
				.eq('admin', true)
				.eq('user', user.id),
			58
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		unwrapNoData(
			await locals.supabase
				.from('organization_memberships')
				.update({
					admin: true
				})
				.eq('user', userId)
				.eq('organization', params.org)
				.eq('admin', false),
			59
		);
	} catch {
		return redirect(303, '/error');
	}

	return { success: true };
};

export const demote = async ({ request, params, locals }: ActionData) => {
	const formData = safeParse(UserIdSchema, Object.fromEntries(await request.formData()));

	if (!formData.success) {
		return redirect(303, '/error');
	}

	const { userId } = formData.output;

	try {
		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return redirect(303, '/');
		}

		if (userId === user.id) {
			return fail(400, { demoteFailure: true, message: m.demote_yourself() });
		}

		const check = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('id')
				.eq('organization', params.org)
				.eq('admin', true)
				.eq('user', user.id),
			60
		);

		if (!check?.[0]) {
			return redirect(303, '/home');
		}

		unwrapNoData(
			await locals.supabase
				.from('organization_memberships')
				.update({
					admin: false
				})
				.eq('user', userId)
				.eq('organization', params.org)
				.eq('admin', true),
			61
		);
	} catch {
		return redirect(303, '/error');
	}

	return { success: true };
};
