<script lang="ts">
	import type { Rule } from '$lib/rule';
	import type { Sender } from '$lib/sender';
	import { getSender } from '$lib/sender';
	import { getPollTemplate } from '$lib/poll-template';
	import type { PollTemplate } from '$lib/poll-template';
	import { onMount } from 'svelte';

	export let rule: Rule;
	const innerRule = rule.metadata.type == 'regular' ? rule.metadata : rule.metadata.regularRule;

	let sender: Sender;
	let pollTemplate: PollTemplate;

	onMount(async () => {
		sender = await getSender(innerRule.senderId);
		pollTemplate = await getPollTemplate(innerRule.pollTemplateId);
	});

	console.log(rule);
</script>

<article>
	<header>
		<p>{innerRule.name}</p>
		<small>{innerRule.schedule}</small>
	</header>

	{#if sender && pollTemplate}
		<p>{sender.info.botName}</p>
    <p>{pollTemplate.question}</p>
	{:else}
		<p aria-busy="true" />
	{/if}
</article>
