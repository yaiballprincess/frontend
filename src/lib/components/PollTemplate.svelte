<script lang="ts">
	import * as ptapi from '$lib/poll-template';
	export let state: 'view' | 'edit';
	export let data: {
		id: number | undefined;
		quetion: string;
		options: string[];
		isMultiple: boolean;
		isAnonymous: boolean;
		endsAt?: Date;
	};
	export let onCreation;
	let endsAt: string = '';
	$: data.endsAt = endsAt ? new Date(endsAt) : undefined;

	const createOrUpdate = async () => {
		if (data.id === undefined) {
			const maybeError = await ptapi.insertPollTemplate(data);
			if (maybeError === undefined) {
				onCreation();
			}
		} else {
			const maybeError = await ptapi.updatePollTemplate(data);
			if (maybeError !== undefined) {
				// TODO: handle error
			}
		}
	};

	const onModeChange = async () => {
		if (state === 'view') {
			state = 'edit';
		} else {
			await createOrUpdate();
			state = 'view';
		}
	};

	const deletePollTemplate = async () => {
		const maybeError = await ptapi.deletePollTemplate(data.id);
		// TODO: handle error
	};

	const removeOption = (index) => {
		data.options.splice(index, 1);
		data.options = data.options;
	};

	const addOption = () => {
		data.options = [...data.options, ''];
	};
</script>

<article>
	<header>
		<h5>
			<input bind:value={data.question} placeholder="Question" disabled={state === 'view'} />
		</h5>
		<button on:click={onModeChange}>{state === 'view' ? 'edit' : 'save'}</button>
		{#if state === 'edit' && data.id !== undefined}
			<span on:click={deletePollTemplate}>❌</span>
		{/if}
	</header>
	<div>
		<label>
			Multiple:
			<input type="checkbox" bind:checked={data.isMultiple} disabled={state === 'view'} />
		</label>
	</div>
	<div>
		<label>
			Anonymous:
			<input type="checkbox" bind:checked={data.isAnonymous} disabled={state === 'view'} />
		</label>
	</div>
	<div>
		<label>
			Ends at:
			<input type="datetime-local" bind:value={endsAt} disabled={state === 'view'} />
		</label>
	</div>

	<ul>
		{#each data.options as opt, index}
			<li>
				<input
					type="text"
					bind:value={opt}
					disabled={state === 'view'}
					pattern={String.raw`.{1,}`}
					required
				/>
				<span on:click={() => removeOption(index)}>❌</span>
			</li>
		{/each}
		{#if state === 'edit'}<button on:click={addOption}>add</button>{/if}
	</ul>
</article>

<style>
	input:invalid {
		background-color: red;
	}
	article header {
		margin-bottom: 1rem;
	}
	article header h5 {
		display: inline;
	}
	article header h5 input:disabled {
		border: none;
		font-size: 1rem;
		font-weight: 600;
	}
</style>
