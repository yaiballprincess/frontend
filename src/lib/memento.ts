import { writable } from 'svelte/store';

export function memento(init, old?) {
	const storage = writable({ current: structuredClone(init), old: structuredClone(old ?? init) });
	function commit() {
		storage.update((tmp) => {
			return { current: tmp.current, old: structuredClone(tmp.current) };
		});
	}

	function rollback() {
		storage.update((tmp) => {
			return { current: structuredClone(tmp.old), old: tmp.old };
		});
	}
	return { ...storage, commit, rollback };
}
