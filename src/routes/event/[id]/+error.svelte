<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	$: error = $page.error;
</script>

<svelte:head>
	<title>Error - Event Cactus</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<!-- Page Header -->
	<div class=" border-b py-6">
		<div class="container mx-auto px-4 text-center">
			<h1 class=" font-display mb-2 text-2xl font-bold">Error</h1>
			<p class="">Something went wrong</p>
		</div>
	</div>

	<!-- Error Content -->
	<div class="container mx-auto flex-1 px-4 py-8">
		<div class="mx-auto max-w-md text-center">
			<div class="rounded-sm border border-red-500/30 bg-red-900/20 p-8">
				<div class="mb-4 text-6xl text-red-400">🚨</div>
				<h2 class="mb-4 text-2xl font-bold text-red-400">Something Went Wrong</h2>

				<p class=" mb-6">
					{error?.message || 'An unexpected error occurred.'}
				</p>

				<div class="space-y-3">
					<button
						on:click={() => goto('/')}
						class="  w-full rounded-sm px-6 py-3 font-semibold text-white transition-colors duration-200"
					>
						Create New Event
					</button>

					<button
						on:click={() => window.location.reload()}
						class="bg-dark-600 hover:bg-dark-500 w-full rounded-sm px-6 py-3 font-semibold text-white transition-colors duration-200"
					>
						Try Again
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
