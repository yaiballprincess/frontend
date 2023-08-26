import { store } from '$lib/store';
import type { Store } from '$lib/store';
import { fetchProtectedOrGoto } from '$lib/fetch';

export type Sender = {
	info: {
		botName?: string;
		name: string;
		id: number;
	};
	receivers: { [id: number]: { peerId: number; name: string } } | undefined;
};

const senders: Store<{ [id: number]: Sender }> = store({});

export async function refreshSenders() {
	const response = await fetchProtectedOrGoto('/api/senders');
	if (!response?.ok) {
		return;
	}
	const data = await response.json();
	for (const sender of data) {
		if (sender.id in senders) {
			senders.update((s) => {
				s[sender.id].info = sender;
				return s;
			});
		} else {
			senders.update((s) => {
				s[sender.id] = { info: sender };
				return s;
			});
		}
	}
}

export async function refreshSender(senderId: number) {
	const response = await fetchProtectedOrGoto(`/api/senders/${senderId}/receivers`);
	if (!response?.ok) {
		return;
	}
	const data = await response.json();
	senders.update((s) => {
		s[senderId].receivers = {};
		return s;
	});
	for (const receiver of data) {
		senders.update((s) => {
			s[senderId].receivers[receiver.peerId] = receiver;
			return s;
		});
	}
}

export async function getSender(senderId: number) {
	if (!(senderId in senders)) {
		await refreshSenders();
	}
	if (senders.get()[senderId].receivers === undefined) {
		await refreshSender(senderId);
	}
	return senders.get()[senderId] as Sender;
}
