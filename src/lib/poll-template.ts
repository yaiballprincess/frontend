import { store } from '$lib/store';
import type { Store } from '$lib/store';
import { fetchProtectedOrGoto } from '$lib/fetch';

export type PollTemplate = {
	endsAt?: Date;
	id: number;
	isAnonymous: boolean;
	isMultiple: boolean;
	question: string;
	options: string[];
};

export const pollTemplates: Store<{ [id: number]: PollTemplate }> = store({});

export async function refreshPollTemplates() {
	const response = await fetchProtectedOrGoto('/api/poll-templates');
	if (!response?.ok) {
		return;
	}
	const data = await response.json();
	for (const pollTemplate of data) {
		const prepared = {
			endsAt: pollTemplate.endsAt !== undefined ? new Date(pollTemplate.endsAt) : undefined,
			id: pollTemplate.id,
			isAnonymous: pollTemplate.isAnonymous,
			isMultiple: pollTemplate.isMultiple,
			options: pollTemplate.options,
			question: pollTemplate.question
		} as PollTemplate;
		pollTemplates.update((s) => {
			s[prepared.id] = prepared;
			return s;
		});
	}
}

export async function getPollTemplate(id: number) {
	if (!(id in pollTemplates)) {
		await refreshPollTemplates();
	}
	return pollTemplates.get()[id];
}

export async function updatePollTemplate(pt: PollTemplate) {
	const response = await fetchProtectedOrGoto(`/api/poll-templates/${pt.id}`, {
		method: 'PUT',
		body: JSON.stringify(pt)
	});
	if (response.ok) {
		pollTemplates.update((s) => {
			s[pt.id] = pt;
			return s;
		});
	} else {
		return await response.json();
	}
}

export async function insertPollTemplate(pt: PollTemplate) {
	const response = await fetchProtectedOrGoto('/api/poll-templates', {
		method: 'POST',
		body: JSON.stringify(pt)
	});
	if (response.ok) {
		const id = await response.json();
		pt.id = id;
		pollTemplates.update((s) => {
			s[pt.id] = pt;
			return s;
		});
	} else {
		return await response.json();
	}
}

export async function deletePollTemplate(id: number) {
	const response = await fetchProtectedOrGoto(`/api/poll-templates/${id}`, {
		method: 'DELETE'
	});
	if (response.ok) {
		pollTemplates.update((s) => {
			s.delete(id);
			return s;
		});
	} else {
		return await response.json();
	}
}
