<script>
	let { children } = $props();
</script>

<div class="app">
	<header>
		<img class="logo" src="/spur-logo.png" alt="SPUR" />
		<div class="title">Live telemetry demo</div>
		<div class="subtitle">OpenAttribution Telemetry + Guardian content</div>
	</header>
	<main>
		{@render children()}
	</main>
</div>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
		background: #f8f9fa;
		color: #1a1a1a;
		height: 100vh;
		overflow: hidden;
	}

	.app {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	header {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1.25rem;
		background: #ffffff;
		border-bottom: 1px solid #e5e7eb;
	}

	.logo {
		height: 1.4rem;
	}

	.title {
		font-size: 0.9rem;
		font-weight: 500;
		color: #374151;
	}

	.subtitle {
		font-size: 0.75rem;
		color: #6b7280;
		margin-left: auto;
	}

	main {
		flex: 1;
		overflow: hidden;
	}
</style>
