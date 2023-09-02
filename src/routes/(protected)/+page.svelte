<script lang="ts">
	import Rule from '$lib/components/Rule.svelte';
	import PollTemplate from '$lib/components/PollTemplate.svelte';
	import Sender from '$lib/components/Sender.svelte';
	import AddSender from '$lib/components/AddSender.svelte';
	import { rules, refreshRules } from '$lib/rule';
	import { pollTemplates } from '$lib/poll-template';
	import { senders } from '$lib/sender';
	import { store } from '$lib/store';
	import { onMount } from 'svelte';

	let newRules = {};
	let newRuleIdx = 0;

	function addNewRule(ruleType) {
		newRules[newRuleIdx] = {
			isActive: true,
			metadata: {
				type: ruleType
			}
		};
		newRules = newRules;

		newRuleIdx += 1;
	}

	function onCreationFactory(id) {
		return async () => {
			const tmp = Object.entries(newRules).filter(([k, _]) => k !== id);
			newRules = Object.fromEntries(tmp);
			await refreshRules();
		};
	}

	let newPollTemplate;
	function resetNewPollTemplate() {
		newPollTemplate = {
			question: '',
			options: '',
			isMultiple: false,
			isAnonymous: false
		};
	}
	resetNewPollTemplate();
</script>

<main class="container">
	<section id="poll-templates">
		<h1>Poll templates</h1>
		<div class="kb-cards">
			{#each Object.entries($pollTemplates) as [id, pollTemplate]}
				<PollTemplate state="view" data={pollTemplate} />
			{/each}
			<PollTemplate state="edit" data={newPollTemplate} onCreation={resetNewPollTemplate} />
		</div>
	</section>

	<section id="senders">
		<h1>Senders</h1>
		<div class="kb-cards">
			{#each Object.entries($senders) as [id, sender]}
				<Sender data={sender} />
			{/each}
			<AddSender />
		</div>
	</section>

	<section id="rules">
		<h1>Rules</h1>
		<div class="kb-cards">
			{#each Object.entries($rules) as [id, rule]}
				<Rule {rule} />
			{/each}
			{#each Object.entries(newRules) as [id, newRule]}
				<Rule rule={newRule} onCreation={onCreationFactory(id)} state="edit" />
			{/each}
			<article id="new-rules">
				<button on:click={() => addNewRule('regular')}>Add regular rule</button>
				<button on:click={() => addNewRule('ignore')}>Add ignore rule</button>
				<button on:click={() => addNewRule('replace')}>Add replace rule</button>
			</article>
		</div>
	</section>
</main>

<style>
	main.container {
		max-width: 1280px;
		margin: 0 auto;
	}
	.kb-cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		grid-auto-rows: auto;
		grid-gap: 1rem;
	}

	#new-rules button {
		display: block;
		margin: 1rem auto;
		height: 2.5rem;
	}
</style>
