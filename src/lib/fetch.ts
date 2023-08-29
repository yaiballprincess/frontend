import { store } from '$lib/store';
import { host } from '$lib/config';

import jwtDecode from 'jwt-decode';
import type { JwtPayload } from 'jwt-decode';
import { goto } from '$app/navigation';
import { redirect } from '@sveltejs/kit';

export const accessToken = store('');

export async function fetchProtectedOrGoto(input: RequestInfo | URL, init?: RequestInit) {
	return genericFetchProtected(input, init, () => goto('/auth'));
}

export async function fetchProtectedOrRedirect(input: RequestInfo | URL, init?: RequestInit) {
	return genericFetchProtected(input, init, () => {
		throw redirect(308, '/auth');
	});
}

async function genericFetchProtected(
	input: RequestInfo | URL,
	init: RequestInit | undefined,
	onFailure: () => void
) {
	if (!isValidAccessToken(accessToken.get())) {
		const d = await tryFetchAndSetNewAccessToken();
		if (d === undefined) {
			onFailure();
			return;
		}
	}
	const headers = new Headers(init?.headers);
	headers.append('Authorization', `Bearer ${accessToken.get()}`);
	const theInit = init ?? {};
	theInit.headers = headers;
	return fetch(input, theInit);
}

export async function tryFetchAndSetNewAccessToken() {
	const response = await fetch(`${host}/api/sessions`, {
		method: 'PUT'
	});
	if (response.ok) {
		const newAccessToken = await response.json();
		accessToken.set(newAccessToken);
		return {};
	}
}

interface MyJwtPayload extends JwtPayload {
	dat: {
		userId: number;
	};
}

function isValidAccessToken(value: string) {
	if (!value) {
		return false;
	}
	try {
		const data = jwtDecode<MyJwtPayload>(value);
		if (!data.exp) {
			return false;
		}
		const thatTime = new Date(data.exp * 1000).getTime();
		const curTime = new Date().getTime();
		return curTime < thatTime;
	} catch (_) {
		return false;
	}
}
