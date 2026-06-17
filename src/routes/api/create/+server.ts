import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { documents } from '$lib/server/db/schema';
import { success, error } from '$lib/server/db/logs';

const codeCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789-';

function check(code: string, editorPassword: string, viewerPassword: string) {
	for (let i = 0; i < code.length; i++) {
		if (!codeCharacters.includes(code[i])) {
			return false;
		}
	}
	if (editorPassword === viewerPassword) {
		return false;
	}
	return true;
}

export const POST: RequestHandler = async ({ request }) => {
	const requestJson = await request.json();
	const title = requestJson.title;
	const code = requestJson.code;
	const editorPassword = requestJson.editorPassword;
	const viewerPassword = requestJson.viewerPassword;
	const passwordRequired = requestJson.passwordRequired;
	const autosave = requestJson.autosave;
	const userAgent = request.headers.get('user-agent') ?? 'not-found';
	if (!check(code, editorPassword, viewerPassword)) {
		return new Response('', { status: 400 });
	}
	try {
		if (passwordRequired) {
			await db.insert(documents).values({
				title,
				code,
				editorPassword,
				viewerPassword,
				passwordRequired: true,
				autosave
			});
		} else {
			await db.insert(documents).values({
				title,
				code,
				editorPassword,
				passwordRequired: false,
				autosave
			});
		}
	} catch (errorO) {
		error({
			action: 'create-document',
			info: `title:${title}`,
			error: JSON.stringify(errorO),
			userAgent
		});
		return new Response(JSON.stringify({ error: errorO }), { status: 409 });
	}
	success({
		action: 'create-document',
		info: `title:${title}`,
		userAgent
	});
	return new Response(JSON.stringify({ success: true }), { status: 201 });
};
