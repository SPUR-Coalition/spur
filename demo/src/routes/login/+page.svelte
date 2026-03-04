<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<div class="login">
	<div class="card">
		<img class="logo" src="/spur-logo.png" alt="SPUR" />
		<p class="subtitle">Live telemetry demo</p>

		<form method="POST" use:enhance>
			<input
				type="password"
				name="password"
				placeholder="Password"
				autocomplete="off"
			/>
			{#if form?.incorrect}
				<p class="error">Incorrect password</p>
			{/if}
			<button type="submit">Enter</button>
		</form>
	</div>
</div>

<style>
	.login {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background: #f8f9fa;
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		padding: 2.5rem;
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		width: 20rem;
	}

	.logo {
		height: 2rem;
	}

	.subtitle {
		font-size: 0.8rem;
		color: #6b7280;
		margin-top: -0.5rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}

	input {
		padding: 0.6rem 0.75rem;
		background: #f9fafb;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		color: #1a1a1a;
		font-size: 0.85rem;
		outline: none;
		text-align: center;
	}

	input:focus {
		border-color: #7c3aed;
	}

	.error {
		font-size: 0.75rem;
		color: #dc2626;
		text-align: center;
	}

	button {
		padding: 0.6rem 1rem;
		background: #7c3aed;
		color: #fff;
		border: none;
		border-radius: 6px;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
	}

	button:hover {
		background: #6d28d9;
	}
</style>
