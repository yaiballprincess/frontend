import { refreshRules } from '$lib/rule';
import { refreshPollTemplates } from '$lib/poll-template';
import { refreshSenders } from '$lib/sender';

export const ssr = false;

export const load = async () => {
	await refreshPollTemplates();
	await refreshSenders();
	await refreshRules();
};
