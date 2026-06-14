import { success, error } from '$lib/server/db/logs';
import { checkToken } from '$lib/server/db/token';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { documents } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	const userAgent = request.headers.get('user-agent') ?? '';
	const json = await request.json();
	const code: string = json.code;
	const token: string = json.token;
	const oldEditorPassword: string = json.oldPassword;
	const editor: boolean = json.editor;
	const newPassword: string = json.newPassword;

	const tokenCheck = await checkToken(userAgent, token, code, 'editor');
	if (!tokenCheck) {
		return new Response(null, { status: 401 });
	}
	try {
		const document = await db.query.documents.findFirst({
			columns: {
				code: true,
				editorPassword: true
			},
			where: eq(documents.code, code)
		});
		if (code !== document?.code || document?.editorPassword !== oldEditorPassword) {
			return new Response(null, { status: 400 });
		}
		if (editor) {
			await db
				.update(documents)
				.set({
					editorPassword: newPassword
				})
				.where(eq(documents.code, code));
		} else {
			await db
				.update(documents)
				.set({
					viewerPassword: newPassword
				})
				.where(eq(documents.code, code));
		}
	} catch (errorV) {
		error({
			userAgent,
			info: `code:${code},token:${token}`,
			action: 'password-reset-get-doc',
			error: JSON.stringify(errorV)
		});
		return new Response(null, { status: 500 });
	}
	success({
		userAgent,
		info: `code:${code},token:${token}`,
		action: 'password-reset-get-doc'
	});
	return new Response(null, { status: 200 });
};
