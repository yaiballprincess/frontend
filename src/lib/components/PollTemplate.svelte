<script lang="ts">
	import * as ptapi from '$lib/poll-template';
	import { memento } from '$lib/memento.ts';
	import DateTimeInput from '$lib/components/DateTimeInput.svelte';
	export let state: 'view' | 'edit';
	export let data: {
		id: number | undefined;
		quetion: string;
		options: string[];
		isMultiple: boolean;
		isAnonymous: boolean;
		endsAt?: Date;
	};
	export let onCreation = undefined;

	$: mem = memento(data);

	const createOrUpdate = async () => {
		let isNew = $mem.current.id === undefined;
		const maybeError = await (isNew
			? ptapi.insertPollTemplate($mem.current)
			: ptapi.updatePollTemplate($mem.current));
		if (maybeError !== undefined) {
			// TODO: error handling
			return;
		}
		mem.commit();
		state = isNew ? 'edit' : 'view';
		if (isNew && onCreation) {
			onCreation();
		}
	};

	const onModeChange = async () => {
		if (state === 'view') {
			state = 'edit';
		} else {
			await createOrUpdate();
		}
	};

	const onCancelEdit = () => {
		mem.rollback();
		state = 'view';
	};

	const deletePollTemplate = async () => {
		const maybeError = await ptapi.deletePollTemplate($mem.current.id);
		// TODO: handle error
	};

	const removeOption = (index) => {
		$mem.current.options.splice(index, 1);
		$mem.current.options = $mem.current.options;
	};

	const addOption = () => {
		$mem.current.options = [...$mem.current.options, ''];
	};
</script>

<article>
	<header>
		<h5>
			<input
				bind:value={$mem.current.question}
				placeholder="Question"
				disabled={state === 'view'}
			/>
		</h5>
		<button on:click={onModeChange}>{state === 'view' ? 'edit' : 'save'}</button>
		{#if state === 'edit' && data.id !== undefined}
			<span on:click={onCancelEdit}>❌</span>
		{:else if data.id !== undefined}
			<button on:click={deletePollTemplate}>del</button>
		{/if}
	</header>
	<div>
		<label>
			Multiple:
			<input type="checkbox" bind:checked={$mem.current.isMultiple} disabled={state === 'view'} />
		</label>
	</div>
	<div>
		<label>
			Anonymous:
			<input type="checkbox" bind:checked={$mem.current.isAnonymous} disabled={state === 'view'} />
		</label>
	</div>
	<div>
		<label>
			Ends at:
			<DateTimeInput bind:value={$mem.current.endsAt} disabled={state === 'view'} />
		</label>
	</div>

	<ul>
		{#each $mem.current.options as opt, index}
			<li>
				<input
					type="text"
					bind:value={opt}
					disabled={state === 'view'}
					pattern={String.raw`.{1,}`}
					required
				/>
				{#if state == 'edit'}
					<span class="kb-cursor" on:click={() => removeOption(index)}>❌</span>
				{/if}
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
    ul li input {
        border: none;
        font-size: 1rem;
    }
</style>
