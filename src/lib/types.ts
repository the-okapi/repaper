import { object, string } from 'valibot';

export const UserIdSchema = object({
	userId: string()
});

export type SelectItemType = {
	label: string;
	value: string;
};

export type OrganizationMember = {
	user: {
		id: string;
		name: string;
		email: string;
	};
	admin: boolean;
};

export type Assignment = {
	id: string;
	assignment: {
		id: string;
		name: string;
		description: string;
		due_date: string;
		class: string;
	};
};
