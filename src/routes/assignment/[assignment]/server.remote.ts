import { command, getRequestEvent } from '$app/server';
import { object, string } from 'valibot';
import { unwrap, unwrapNoData } from '$lib/error';

const SaveSchema = object({
	assignment: string(),
	content: string()
});

export const saveDocument = command(SaveSchema, async (data) => {
	const { assignment, content } = data;

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
			59
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
			60
		);
	} catch {
		return { status: 500 };
	}

	return { status: 201 };
});
