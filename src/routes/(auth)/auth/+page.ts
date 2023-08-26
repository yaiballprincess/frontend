import { accessToken, tryFetchAndSetNewAccessToken } from '$lib/fetch';
import { redirect } from '@sveltejs/kit';

export const ssr = false;

export async function load() {
    const maybe = await tryFetchAndSetNewAccessToken();
    if (maybe !== undefined) {
        throw redirect(308, '/');
    }
}
