<script lang="ts">
	import { memento } from '$lib/memento';
	import { senders } from '$lib/sender';
	import { rules } from '$lib/rule';
	import { pollTemplates } from '$lib/poll-template';
	import * as rapi from '$lib/rule';
	import DateTimeInput from '$lib/components/DateTimeInput.svelte';

	export let id;
	export let isActive;
	export let rule;
	export let onCreation;

	export let state: 'view' | 'edit' = 'view';
	let errorMessage;
	$: mem = memento(rule);
	$: regularRule = $rules[$mem.current.regularRuleId]?.metadata;

	function onCancelEdit() {
		mem.rollback();
		state = 'view';
	}

	async function deleteRule() {
		const maybeError = await rapi.deleteRule(id);
		if (maybeError) {
			errorMessage = maybeError.message;
		} else {
			await rapi.refreshRules();
		}
	}

	async function createOrUpdate() {
		const isNew = id === undefined;
		const payload = {
			isActive: isActive,
			metadata: {
				replace: $mem.current
			}
		};
		const maybeError = !isNew ? await rapi.updateRule(id, payload) : await rapi.addRule(payload);
		if (maybeError) {
			errorMessage = maybeError.message;
			return;
		}
		if (isNew && onCreation) {
			onCreation();
		}
		mem.commit();
		state = 'view';
	}
	async function onModeChange() {
		if (state === 'view') {
			state = 'edit';
		} else {
			await createOrUpdate();
		}
	}
</script>

<article>
	<header>
		<h5>[Replace] {regularRule?.name}</h5>
		<button on:click={onModeChange}>{state === 'view' ? 'edit' : 'save'}</button>
		{#if state === 'edit' && id !== undefined}
			<span on:click={onCancelEdit}>❌</span>
		{:else if id !== undefined}
			<button on:click={deleteRule}>del</button>
		{/if}
	</header>
	<div>
		<label for="regular-rule">Regular rule:</label>
		<select id="regular-rule" bind:value={$mem.current.regularRuleId} disabled={state === 'view'}>
			{#each Object.entries($rules) as [_, rule]}
				{#if rule.metadata.type === 'regular'}
					<option value={rule.id}>{rule.metadata.name}</option>
				{/if}
			{/each}
		</select>
	</div>
	<div>
		<label for="starts-at">Starts at:</label>
		<DateTimeInput bind:value={$mem.current.startsAt} id="starts-at" disabled={state === 'view'} />
	</div>
	<div>
		<label for="ends-at">Ends at:</label>
		<DateTimeInput bind:value={$mem.current.endsAt} id="ends-at" disabled={state === 'view'} />
	</div>
	<div>
		<label for="new-poll-template">New poll template:</label>
		<select bind:value={$mem.current.newPollTemplateId} disabled={state === 'view'}>
			{#each Object.entries($pollTemplates) as [_, pollTemplate]}
				<option value={pollTemplate.id}>{pollTemplate.question}</option>
			{/each}
		</select>
	</div>
	<div>
		<label for="is-active">Active:</label>
		<input type="checkbox" bind:checked={isActive} />
	</div>
</article>

<style>
	article header h5 {
		display: inline;
	}
	article header {
		margin-bottom: 1rem;
	}
</style>
