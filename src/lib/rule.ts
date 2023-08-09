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
	regularRule: RegularRule;
	sendAt: Date;
};

export type ReplaceRule = {
	type: 'replace';
	regularRuleId: number;
	regularRule: RegularRule;
	newPollTemplateId: number;
	sendAt: Date;
};

export function processRules(rules: any[]): { [id: number]: Rule } {
	const regularRules: { [id: number]: RegularRule } = {};
	for (const rule of rules) {
		if ('regular' in rule.metadata) {
			regularRules[rule.id] = { ...rule.metadata.regular, type: 'regular' } as RegularRule;
		}
	}

	const ret: { [id: number]: Rule } = {};

	for (const rule of rules) {
		if ('regular' in rule.metadata) {
			ret[rule.id] = {
				id: rule.id,
				isActive: rule.isActive,
				metadata: regularRules[rule.id]
			} satisfies Rule;
		} else if ('ignore' in rule.metadata) {
			const m = rule.metadata.ignore;
			ret[rule.id] = {
				id: rule.id,
				isActive: rule.isActive,
				metadata: {
					type: 'ignore',
					regularRuleId: m.regularRuleId as number,
					regularRule: regularRules[m.regularRuleId],
					sendAt: new Date(m.sendAt)
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
					regularRule: regularRules[m.regularRuleId],
					newPollTemplateId: m.newPollTemplateId as number,
					sendAt: new Date(m.sendAt)
				} satisfies ReplaceRule
			} satisfies Rule;
		}
	}

	return ret;
}
