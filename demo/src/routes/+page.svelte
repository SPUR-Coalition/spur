<script>
	import ChatPane from './ChatPane.svelte';
	import TelemetryPane from './TelemetryPane.svelte';
	import DashboardPane from './DashboardPane.svelte';
</script>

<div class="panes">
	<div class="pane chat">
		<div class="pane-header">Agent chat</div>
		<ChatPane />
	</div>
	<div class="pane telemetry">
		<div class="pane-header">Telemetry events</div>
		<TelemetryPane />
	</div>
	<div class="pane dashboard">
		<div class="pane-header">Publisher dashboard (The Guardian)</div>
		<DashboardPane />
	</div>
</div>

<style>
	.panes {
		display: flex;
		height: 100%;
		gap: 1px;
		background: #262626;
	}

	.pane {
		display: flex;
		flex-direction: column;
		background: #0a0a0a;
		overflow: hidden;
	}

	.chat {
		flex: 2;
	}

	.telemetry {
		flex: 1.5;
	}

	.dashboard {
		flex: 1.5;
	}

	.pane-header {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #737373;
		padding: 0.5rem 1rem;
		border-bottom: 1px solid #1a1a1a;
		flex-shrink: 0;
	}
</style>
