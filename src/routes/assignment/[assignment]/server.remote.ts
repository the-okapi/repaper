import { command, getRequestEvent } from '$app/server';
import { object, string, file } from 'valibot';
import { unwrap, unwrapNoData } from '$lib/error';

const SaveSchema = object({
	assignment: string(),
	content: string()
});

export const saveDocument = command(SaveSchema, async ({ assignment, content }) => {
	const { locals } = getRequestEvent();

	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return { status: 401 };
	}

	try {
		const [assignmentSubmission] = unwrap(
			await locals.supabase
				.from('assignment_submissions')
				.select('document, class')
				.eq('id', assignment)
				.eq('user', user.id),
			34
		);

		if (!assignmentSubmission) {
			return { status: 404 };
		}

		unwrapNoData(
			await locals.supabase
				.from('documents')
				.update({
					content
				})
				.eq('id', assignmentSubmission.document)
				.eq('class', assignmentSubmission.class),
			87
		);
	} catch {
		return { status: 500 };
	}

	return { status: 200 };
});

export const submitDocument = command(string(), async (assignment) => {
	const { locals } = getRequestEvent();

	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return { status: 401 };
	}

	try {
		const [assignmentSubmission] = unwrap(
			await locals.supabase
				.from('assignment_submissions')
				.select('submitted')
				.eq('id', assignment)
				.eq('user', user.id),
			88
		);

		if (!assignmentSubmission) {
			return { status: 401 };
		} else if (assignmentSubmission.submitted !== null) {
			return { status: 409 };
		}

		unwrapNoData(
			await locals.supabase
				.from('assignment_submissions')
				.update({
					submitted: new Date().toISOString()
				})
				.eq('id', assignment)
				.eq('user', user.id),
			89
		);

		return { status: 200 };
	} catch {
		return { status: 500 };
	}
});

const UploadFileSchema = object({
	assignment: string(),
	file: file()
});

export const uploadFile = command(UploadFileSchema, async ({ assignment, file }) => {
	const { locals } = getRequestEvent();

	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return { status: 401 };
	}

	try {
		const [check] = unwrap(
			await locals.supabase
				.from('assignment_submissions')
				.select('document')
				.eq('id', assignment)
				.eq('user', user.id),
			90
		);

		if (!check) {
			return { status: 403 };
		}

		const id = crypto.randomUUID();
		const path = `${user.id}/${assignment}/${id}.${file.type.split('/')[1]}`;

		unwrapNoData(await locals.supabase.storage.from('images').upload(path, file), 91);

		const {
			data: { publicUrl: url }
		} = locals.supabase.storage.from('images').getPublicUrl(path);

		unwrapNoData(
			await locals.supabase.from('images').insert({
				id,
				url,
				path,
				document: check.document
			}),
			92
		);

		return { status: 200, url };
	} catch {
		return { status: 500 };
	}
});

const DeleteFileSchema = object({
	assignment: string(),
	url: string()
});

export const deleteFile = command(DeleteFileSchema, async ({ assignment, url }) => {
	const { locals } = getRequestEvent();

	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return { status: 401 };
	}

	try {
		const [check] = unwrap(
			await locals.supabase
				.from('assignment_submissions')
				.select('document')
				.eq('id', assignment)
				.eq('user', user.id),
			93
		);

		if (!check) {
			return { status: 400 };
		}

		const [image] = unwrap(
			await locals.supabase
				.from('images')
				.delete()
				.eq('document', check.document)
				.eq('url', url)
				.select('path'),
			94
		);

		unwrapNoData(await locals.supabase.storage.from('images').remove(image.path), 95);

		return { status: 200 };
	} catch {
		return { status: 500 };
	}
});
