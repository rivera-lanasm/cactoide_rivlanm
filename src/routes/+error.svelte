<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	$: error = $page.error;
</script>

<svelte:head>
	<title>Error - Cactoide</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<!-- Error Content -->
	<div class="container mx-auto flex-1 px-4 py-8">
		<div class="mx-auto max-w-md text-center">
			<div class="rounded-sm border border-red-500/30 bg-red-900/20 p-8">
				<div class="mb-4 text-6xl text-red-400">🚨</div>
				<h2 class="mb-4 text-2xl font-bold text-red-400">Error</h2>

				<p class=" mb-6">
					{error?.message || 'An unexpected error occurred.'}
				</p>

				<div class="space-y-3">
					<button
						on:click={() => goto('/')}
						class="border-white-500 bg-white-400/20 mt-2 w-48 rounded-sm border px-6 py-3 font-semibold text-white duration-400 hover:scale-110 hover:bg-white/10"
					>
						Home
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
