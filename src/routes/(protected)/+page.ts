import { fetchProtectedOrRedirect } from '$lib/fetch';
import { processRules } from '$lib/rule';

export const ssr = false;

export const load = async () => {
    const response = await fetchProtectedOrRedirect('/api/rules');
    const data = await response?.json();
    return { rules: processRules(data) };
};
