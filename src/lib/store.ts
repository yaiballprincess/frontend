import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

// https://github.com/sveltejs/svelte/issues/2060#issuecomment-741776507
export type Store<T> = Writable<T> & { get(): T };

export function store<T>(value: T): Store<T> {
	const originalWritable = writable<T>(value);
	function set(newValue: T) {
		return originalWritable.set((value = newValue));
	}
	function update(fn: (originalValue: T) => T) {
		originalWritable.update((oldValue: T) => (value = fn(oldValue)));
	}
	function get() {
		return value;
	}
	return { set, update, subscribe: originalWritable.subscribe, get };
}
