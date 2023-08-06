<script lang="ts">
	import { goto } from '$app/navigation';
	import { accessToken } from '$lib/fetch';

	let error;

	async function handleSubmit(event: Event) {
		const data = new FormData(event.target as HTMLFormElement);

		const response = await fetch('/api/sessions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: data.get('username'),
				password: data.get('password')
			})
		});
		if (!response.ok) {
			error = await response.json();
			return;
		}

		const newAccessToken = await response.json();
		accessToken.set(newAccessToken);
    goto("/");
	}
</script>

<main class="container">
	<form method="POST" on:submit|preventDefault={handleSubmit}>
		<label for="username">
			Username
			<input type="text" id="username" name="username" required />
		</label>
		<label for="password">
			Password
			<input type="password" id="password" name="password" required />
		</label>
		<button type="submit">Sign in</button>
	</form>
	{#if error}
		<p>{error.message}</p>
		{#if 'details' in error}
			<ul>
				{#each error.details as e}
					<li>{e}</li>
				{/each}
			</ul>
		{/if}
	{/if}
</main>

<style>
	main {
		max-width: 576px;
	}
</style>
