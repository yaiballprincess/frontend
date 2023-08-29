import { fetchProtectedOrRedirect } from '$lib/fetch';
import { processRules } from '$lib/rule';
import { refreshPollTemplates } from '$lib/poll-template';
import { refreshSenders } from '$lib/sender';

export const ssr = false;

export const load = async () => {
	const response = await fetchProtectedOrRedirect('/api/rules');
	const data = await response?.json();
	await refreshPollTemplates();
	await refreshSenders();
	return { rules: processRules(data) };
};
