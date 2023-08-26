import { store } from '$lib/store';
import type { Store } from '$lib/store';
import { fetchProtectedOrGoto } from '$lib/fetch';

export type PollTemplate = {
    endsAt?: Date;
    id: number;
    isAnonymous: boolean;
    isMultiple: boolean;
    question: string;
    options: [{ id: number; value: string }];
};

const pollTemplates: Store<{ [id: number]: PollTemplate }> = store({});

async function refreshPollTemplates() {
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