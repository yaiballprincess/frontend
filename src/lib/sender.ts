import { store } from '$lib/store';
import type { Store } from '$lib/store';
import { fetchProtectedOrGoto } from '$lib/fetch';

type Receiver = {
	peerId: number;
	name: string;
};

export type Sender = {
	botName?: string;
	name: string;
	id: number;
	receivers: { [peerId: number]: { peerId: number; name: string } };
};

export const senders: Store<{ [id: number]: Sender }> = store({});

export async function refreshSenders() {
	const response = await fetchProtectedOrGoto('/api/senders');
	if (!response?.ok) {
		return;
	}
	const data = await response.json();
	senders.set({});
	for (const sender of data) {
		senders.update((s) => {
			s[sender.id] = sender;
			const m = new Map<number, Receiver>();
			sender.receivers.forEach((x) => {
				m.set(x.peerId, x);
			});
			s[sender.id].receivers = m;
			return s;
		});
	}
}

export async function getSender(senderId: number) {
	if (!(senderId in senders.get())) {
		await refreshSenders();
	}
	return senders.get()[senderId] as Sender;
}

export async function deleteReceiver(senderId: number, peerId: number) {
	const response = await fetchProtectedOrGoto(`/api/senders/${senderId}/receivers/${peerId}`, {
		method: 'DELETE'
	});
	if (!response.ok) {
		return await response.json();
	}
}

export async function addReceiver(senderId: number, peerId: number) {
	const response = await fetchProtectedOrGoto(`/api/senders/${senderId}/receivers`, {
		method: 'POST',
		body: JSON.stringify({ peerId: peerId })
	});
	if (!response.ok) {
		return await response.json();
	}
}

export async function addSender(accessToken: string, botAccessToken: string | undefined) {
	const response = await fetchProtectedOrGoto(`/api/senders`, {
		method: 'POST',
		body: JSON.stringify({ accessToken: accessToken, botAccessToken: botAccessToken })
	});

	if (!response.ok) {
		return await response.json();
	}
}

export async function deleteSender(senderId: number) {
	const response = await fetchProtectedOrGoto(`/api/senders/${senderId}`, {
		method: 'DELETE'
	});

	if (!response.ok) {
		return await response.json();
	}
}
