<script lang="ts">
	import { memento } from '$lib/memento';
	import { senders } from '$lib/sender';
	import { pollTemplates } from '$lib/poll-template';
	import * as rapi from '$lib/rule';
	export let id;
	export let isActive;
	export let rule;
	export let onCreation;

	export let state: 'view' | 'edit' = 'view';
	let errorMessage;
	$: mem = memento(rule);
	$: currentSender = $senders[$mem.current.senderId];

	async function createOrUpdate() {
		const isNew = id === undefined;
		const payload = {
			isActive: isActive,
			metadata: {
				regular: $mem.current
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

	function onCancelEdit() {
		state = 'view';
		mem.rollback();
	}

	async function deleteRule() {
		const maybeError = await rapi.deleteRule(id);
		if (maybeError) {
			errorMessage = maybeError.message;
		} else {
			await rapi.refreshRules();
		}
	}
</script>

<article>
	<header>
		<h5>
			<input bind:value={$mem.current.name} placeholder="Name" disabled={state === 'view'} />
		</h5>
		<button on:click={onModeChange}>{state === 'view' ? 'edit' : 'save'}</button>
		{#if state === 'edit' && id !== undefined}
			<span on:click={onCancelEdit}>❌</span>
		{:else if id !== undefined}
			<button on:click={deleteRule}>del</button>
		{/if}
	</header>
	<div>
		<label>
			Schedule:
			<input type="text" bind:value={$mem.current.schedule} disabled={state === 'view'} />
		</label>
	</div>
	<div>
		<label>
			Sender:
			<select bind:value={$mem.current.senderId} disabled={state === 'view'}>
				{#each Object.entries($senders) as [_, sender]}
					<option value={sender.id}>{`${sender.name} ${sender.botName ?? ''}`}</option>
				{/each}
			</select>
		</label>
	</div>
	<div>
		<label>
			Receiver:
			<select bind:value={$mem.current.peerId} disabled={state === 'view'}>
				{#each currentSender?.receivers ?? [] as [peerId, name]}
					<option value={peerId}>{name.name}</option>
				{/each}
			</select>
		</label>
	</div>
	<div>
		<label>
			Poll template:
			<select bind:value={$mem.current.pollTemplateId} disabled={state === 'view'}>
				{#each Object.entries($pollTemplates) as [_, pollTemplate]}
					<option value={pollTemplate.id}>{pollTemplate.question}</option>
				{/each}
			</select>
		</label>
	</div>
	<div>
		<label>
			Active:
			<input bind:checked={isActive} type="checkbox" disabled={state === 'view'} />
		</label>
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
