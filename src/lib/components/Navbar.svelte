<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	function navigateTo(path: string) {
		goto(path);
	}

	// Check if current page is active
	function isActive(path: string): boolean {
		return $page.url.pathname === path;
	}
</script>

<nav class="relative z-50 backdrop-blur-md">
	<div class="container mx-auto px-4">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo/Brand -->
			<div class="flex items-center">
				<button
					on:click={() => navigateTo('/')}
					class="cursor-pointer text-2xl font-medium text-violet-400"
				>
					Event Cactus
				</button>
			</div>

			<!-- Desktop Navigation -->
			<div class="md:flex md:items-center md:space-x-8">
				<button
					on:click={() => navigateTo('/')}
					class={isActive('/') ? 'text-violet-400' : 'cursor-pointer'}
				>
					Home
				</button>

				<button
					on:click={() => navigateTo('/create')}
					class={isActive('/create') ? 'text-violet-400' : 'cursor-pointer'}
				>
					Create
				</button>
			</div>
		</div>
	</div>
</nav>
