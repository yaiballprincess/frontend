<script lang="ts">
	import Rule from '$lib/components/Rule.svelte';
	export let data;
</script>

<main class="container">
	<section class="kb-cards">
		{#each Object.entries(data.rules) as [id, rule]}
			<Rule {rule} />
		{/each}
	</section>
</main>

<style>
	.kb-cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		grid-auto-rows: auto;
		grid-gap: 1rem;
	}
</style>
