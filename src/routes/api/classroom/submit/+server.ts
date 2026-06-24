import { db } from '$lib/server/db';
import { documents, sessions } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { error, success } from '$lib/server/db/logs';

export const POST: RequestHandler = async ({ request }) => {
	const userAgent = request.headers.get('user-agent') ?? '';
	const json = await request.json();
	const code = json.code;
	const editorPassword = json.code;
	const documentList = await db
		.select({
			classroom: documents.classroom
		})
		.from(documents)
		.where(and(eq(documents.code, code), eq(documents.editorPassword, editorPassword)))
		.limit(1);
	if (documentList.length === 0) {
		return new Response(null, { status: 400 });
	}
	const document = documentList[0];
	if (!document.classroom) {
		return new Response(null, { status: 401 });
	}
	try {
		await db.delete(sessions).where(eq(sessions.documentCode, code));
		await db
			.update(documents)
			.set({
				editorPassword: null
			})
			.where(
				and(
					eq(documents.code, code),
					eq(documents.editorPassword, editorPassword),
					eq(documents.classroom, true)
				)
			);
	} catch (errorV) {
		error({
			userAgent,
			info: `code:${code}`,
			action: 'set-read-only',
			error: JSON.stringify(errorV)
		});
		return new Response(null, { status: 500 });
	}
	success({
		userAgent,
		info: `code:${code}`,
		action: 'set-read-only'
	});
	return new Response(null, { status: 200 });
};
