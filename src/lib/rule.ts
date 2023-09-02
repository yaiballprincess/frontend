import { store } from '$lib/store';
import type { Store } from '$lib/store';
import { fetchProtectedOrGoto } from '$lib/fetch';

export type Rule = {
	id: number;
	isActive: boolean;
	metadata: RuleMetadata;
};

export type RuleMetadata = RegularRule | IgnoreRule | ReplaceRule;

export type RegularRule = {
	type: 'regular';
	name: string;
	peerId: number;
	pollTemplateId: number;
	schedule: string;
	senderId: number;
};

export type IgnoreRule = {
	type: 'ignore';
	regularRuleId: number;
	startsAt: Date;
	endsAt: Date;
};

export type ReplaceRule = {
	type: 'replace';
	regularRuleId: number;
	newPollTemplateId: number;
	startsAt: Date;
	endsAt: Date;
};

export const rules: Store<{ [id: number]: Rule }> = store({});

export async function refreshRules() {
	const response = await fetchProtectedOrGoto('/api/rules');
	const data = await response.json();
	const ret: { [id: number]: Rule } = {};

	for (const rule of data) {
		if ('regular' in rule.metadata) {
			ret[rule.id] = {
				id: rule.id,
				isActive: rule.isActive,
				metadata: { ...rule.metadata.regular, type: 'regular' }
			} satisfies Rule;
		} else if ('ignore' in rule.metadata) {
			const m = rule.metadata.ignore;
			ret[rule.id] = {
				id: rule.id,
				isActive: rule.isActive,
				metadata: {
					type: 'ignore',
					regularRuleId: m.regularRuleId as number,
					startsAt: new Date(m.startsAt),
					endsAt: new Date(m.endsAt)
				} satisfies IgnoreRule
			} satisfies Rule;
		} else if ('replace' in rule.metadata) {
			const m = rule.metadata.replace;
			ret[rule.id] = {
				id: rule.id,
				isActive: rule.isActive,
				metadata: {
					type: 'replace',
					regularRuleId: m.regularRuleId as number,
					newPollTemplateId: m.newPollTemplateId as number,
					startsAt: new Date(m.startsAt),
					endsAt: new Date(m.endsAt)
				} satisfies ReplaceRule
			} satisfies Rule;
		}
	}
	rules.set(ret);
}

export async function deleteRule(id: number) {
	const response = await fetchProtectedOrGoto(`/api/rules/${id}`, { method: 'DELETE' });
	if (!response.ok) {
		return await response.json();
	}
}

export async function updateRule(id: number, payload) {
	const response = await fetchProtectedOrGoto(`/api/rules/${id}`, {
		method: 'PUT',
		body: JSON.stringify(payload)
	});
	if (!response.ok) {
		return await response.json();
	}
}

export async function addRule(payload) {
	const response = await fetchProtectedOrGoto(`/api/rules`, {
		method: 'POST',
		body: JSON.stringify(payload)
	});
	if (!response.ok) {
		return await response.json();
	}
}
