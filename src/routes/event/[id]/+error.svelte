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
				<h2 class="mb-4 text-2xl font-bold text-red-400">Something Went Wrong</h2>

				<p class="mb-6">
					{error?.message || 'An unexpected error occurred.'}
				</p>
			</div>
		</div>
		<div class="mx-auto mt-8 max-w-md text-center">
			<button
				on:click={() => goto('/create')}
				class="rounded-sm border-2 border-violet-500 px-8 py-4 font-bold duration-400 hover:scale-110 hover:bg-violet-500/10"
			>
				Create New Event
			</button>

			<button
				on:click={() => window.location.reload()}
				class="rounded-sm border-2 border-violet-500 px-8 py-4 font-bold duration-400 hover:scale-110 hover:bg-violet-500/10"
			>
				Try Again
			</button>
		</div>
	</div>
</div>
