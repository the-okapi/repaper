import { form, getRequestEvent, query } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { optional, object, string } from 'valibot';
import { unwrap, unwrapNoData } from '$lib/error';
import { m } from '$lib/paraglide/messages';

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

		const { locals, params } = getRequestEvent();

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
					.eq('owner', true)
					.eq('class', params.id),
				10
			);

			if (!check?.[0]) {
				return redirect(303, '/home');
			}

			const assignment = unwrap(
				await locals.supabase
					.from('assignments')
					.insert({
						name,
						description,
						class: params.id
					})
					.select('id'),
				11
			);
			console.log(assignment);

			if (everyone) {
				const allStudents = unwrap(
					await locals.supabase
						.from('class_memberships')
						.select('user ( id )')
						.eq('class', params.id)
						.eq('owner', false),
					12
				);

				for (let i = 0; i < allStudents.length; i++) {
					console.log(assignment);
					unwrapNoData(
						await locals.supabase.from('assignment_submissions').insert({
							user: allStudents[i].user.id,
							assignment: assignment[0].id,
							class: params.id
						}),
						13
					);
				}
			} else {
				for (let i = 0; i < students.length; i++) {
					unwrapNoData(
						await locals.supabase.from('assignment_submissions').insert({
							user: students[i],
							assignment: assignment[0].id,
							class: params.id
						}),
						14
					);
				}
			}

			return {
				success: true
			};
		} catch (error: any) {
			console.log(error);
			return {
				everyone,
				students,
				name,
				description,
				message: m.something_happened()
			};
		}
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
