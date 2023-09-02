<script lang="ts">
	import * as sapi from '$lib/sender';
	export let data;

	let errorMessage;

	let newPeerId;

	async function deleteSender() {
		const maybeError = await sapi.deleteSender(data.id);
		if (maybeError) {
			errorMessage = maybeError.message;
		} else {
			await sapi.refreshSenders();
		}
	}

	async function deleteReceiver(peerId: number) {
		const maybeError = await sapi.deleteReceiver(data.id, peerId);
		if (maybeError) {
			errorMessage = maybeError.message;
		} else {
			await sapi.refreshSenders();
		}
	}

	async function addReceiver() {
		if (!newPeerId) {
			return;
		}
		const maybeError = await sapi.addReceiver(data.id, parseInt(newPeerId));
		if (maybeError) {
			errorMessage = maybeError.message;
		} else {
			newPeerId = undefined;
			await sapi.refreshSenders();
		}
	}
</script>

<article>
	<header>
		<hgroup class="headings">
			<h5>{data.name}</h5>
			{#if data.botName}
				<h6>{data.botName}</h6>
			{/if}
		</hgroup>
		<button on:click={deleteSender}>del</button>
	</header>
	<ul>
		{#each data.receivers as [index, receiver]}
			<li>
				<span>{receiver.name}</span>
				<span class="kb-cursor" title="Delete" on:click={() => deleteReceiver(index)}>❌</span>
			</li>
		{/each}
		<li>
			<input type="text" bind:value={newPeerId} placeholder="Peer Id" /><button
				on:click={addReceiver}>add</button
			>
		</li>
	</ul>
	{#if errorMessage}
		<div>{errorMessage}</div>
	{/if}
</article>

<style>
	article header .headings {
		display: inline-block;
		margin-top: -1rem;
	}
	article header > button {
		float: right;
	}
</style>
