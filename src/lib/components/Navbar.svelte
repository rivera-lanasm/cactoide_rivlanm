<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	// Check if current page is active
	const isActive = (path: string): boolean => {
		return $page.url.pathname === path;
	};
</script>

<nav class="relative z-50 backdrop-blur-md">
	<div class="container mx-auto px-4">
		<div class="mt-4 flex h-16 flex-col items-center justify-between">
			<!-- Logo/Brand -->
			<div class="flex items-center">
				<button
					on:click={() => goto('/')}
					class="cursor-pointer text-2xl font-medium text-violet-400"
				>
					Cactoide
				</button>
			</div>

			<!-- Navigation -->
			<div class="md:flex md:items-center md:space-x-8">
				<button
					on:click={() => goto('/')}
					class={isActive('/') ? 'text-violet-400' : 'cursor-pointer'}
				>
					Home
				</button>

				<button
					on:click={() => goto('/discover')}
					class={isActive('/discover') ? 'text-violet-400' : 'cursor-pointer'}
				>
					Discover
				</button>

				<button
					on:click={() => goto('/create')}
					class={isActive('/create') ? 'text-violet-400' : 'cursor-pointer'}
				>
					Create
				</button>

				<button
					on:click={() => goto('/event')}
					class={isActive('/event') ? 'text-violet-400' : 'cursor-pointer'}
				>
					My Events
				</button>
			</div>
		</div>
	</div>
</nav>
