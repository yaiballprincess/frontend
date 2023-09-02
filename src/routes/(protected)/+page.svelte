<script lang="ts">
	import Rule from '$lib/components/Rule.svelte';
	import PollTemplate from '$lib/components/PollTemplate.svelte';
    import Sender from '$lib/components/Sender.svelte';
    import AddSender from '$lib/components/AddSender.svelte';
	import { pollTemplates } from '$lib/poll-template';
	import { senders } from '$lib/sender';
	import { store } from '$lib/store';
	import { onMount } from 'svelte';
	export let data;

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
    <!--
	<section id="rules">
		<h1>Rules</h1>
		<div class="kb-cards">
			{#each Object.entries(data.rules) as [id, rule]}
				<Rule {rule} />
			{/each}
		</div>
	</section> -->
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
</style>
