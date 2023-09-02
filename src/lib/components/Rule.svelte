<script lang="ts">
	import type { Rule } from '$lib/rule';
	import RegularRule from '$lib/components/RegularRule.svelte';
	import IgnoreRule from '$lib/components/IgnoreRule.svelte';
	import ReplaceRule from '$lib/components/ReplaceRule.svelte';

	export let rule: Rule;
	export let onCreation;
	export let state;
</script>

{#if rule.metadata.type === 'regular'}
	<RegularRule id={rule.id} isActive={rule.isActive} rule={rule.metadata} {onCreation} {state} />
{:else if rule.metadata.type === 'ignore'}
	<IgnoreRule id={rule.id} isActive={rule.isActive} rule={rule.metadata} {onCreation} {state} />
{:else if rule.metadata.type === 'replace'}
	<ReplaceRule id={rule.id} isActive={rule.isActive} rule={rule.metadata} {onCreation} {state} />
{/if}
