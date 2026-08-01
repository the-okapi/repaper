import { form, getRequestEvent, query } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { optional, object, string } from 'valibot';
import { unwrap } from '$lib/error';

const CreateAssignmentSchema = object({
	name: string(),
	description: string(),
	everyone: string(),
	students: optional(string())
});

export const createAssignment = form(
	CreateAssignmentSchema,
	async (data: { name: string; description: string; everyone: string; students?: string }) => {
		const everyone = data.everyone === 'true' ? true : false;
		const students = JSON.parse(data.students ?? 'null');
		const { name, description } = data;

		console.log(students, typeof students);

		return {
			success: true,
			name: name,
			description: description,
			everyone
		};
	}
);

export const getStudents = query(string(), async (classId: string) => {
	const { locals } = getRequestEvent();

	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	const check = unwrap(
		await locals.supabase
			.from('class_memberships')
			.select('id')
			.eq('class', classId)
			.eq('owner', true)
			.eq('user', user.id),
		1
	);

	if (!check) {
		return redirect(303, '/home');
	}

	const students = unwrap(
		await locals.supabase
			.from('class_memberships')
			.select('user ( id, name )')
			.eq('class', classId)
			.eq('owner', false),
		6
	);

	return {
		students: students.map((student: { user: { name: string; id: string } }) => ({
			label: student.user.name,
			value: student.user.id
		}))
	};
});
