<script lang="ts">
	import type { Event } from '$lib/types';
	import { goto } from '$app/navigation';
	import type { PageData } from '../$types';
	import { formatTime, formatDate } from '$lib/dateFormatter';

	let publicEvents: Event[] = [];
	let error = '';

	export let data: PageData;
	// Use the server-side data
	$: publicEvents = data.events;
</script>

<svelte:head>
	<title>Discover Events - Cactoide</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<!-- Main Content -->
	<div class="container mx-auto mt-8 flex-1 px-4 py-8 text-white">
		{#if error}
			<div class="mx-auto max-w-2xl text-center">
				<div class="mb-4 text-4xl">⚠️</div>
				<p class="py-4">Something went wrong. Please try again.</p>
				<p class="text-red-600">{error}</p>
				<button
					on:click={() => goto('/')}
					class="rounded-sm border-2 border-violet-500 px-8 py-4 font-bold duration-400 hover:scale-110 hover:bg-violet-500/10"
				>
					Home
				</button>
			</div>
		{:else if publicEvents.length === 0}
			<div class="mx-auto max-w-2xl text-center">
				<div class="mb-4 animate-pulse text-6xl">🔍</div>
				<h2 class="mb-4 text-2xl font-bold">No Public Events Yet</h2>
				<p class="text-white-600 mb-8">
					There are no public events available at the moment. Be the first to create one!
				</p>
				<button
					on:click={() => goto('/create')}
					class="rounded-sm border-2 border-violet-500 px-8 py-4 font-bold duration-400 hover:scale-110 hover:bg-violet-500/10"
				>
					Create
				</button>
			</div>
		{:else}
			<div class="mx-auto max-w-4xl">
				<div class="mb-6">
					<h2 class="text-2xl font-bold text-slate-300">Public Events ({publicEvents.length})</h2>
					<p class="text-slate-500">Discover events created by the community</p>
				</div>

				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each publicEvents as event}
						<div class="rounded-sm border border-slate-200 p-6 shadow-sm">
							<div class="mb-4">
								<h3 class="mb-2 text-xl font-bold text-slate-300">{event.name}</h3>
								<div class="space-y-2 text-sm text-slate-500">
									<div class="flex items-center space-x-2">
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
											></path>
										</svg>
										<span>{formatDate(event.date)} at {formatTime(event.time)}</span>
									</div>
									<div class="flex items-center space-x-2">
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											></path>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											></path>
										</svg>
										<span>{event.location}</span>
									</div>
									<div class="flex items-center space-x-2">
										<span
											class="rounded-sm border px-2 py-1 text-xs font-medium {event.type ===
											'limited'
												? 'border-amber-600 text-amber-600'
												: 'border-teal-500 text-teal-500'}"
										>
											{event.type === 'limited' ? 'Limited' : 'Unlimited'}
										</span>
									</div>
								</div>
							</div>

							<div class="flex space-x-3">
								<button
									on:click={() => goto(`/event/${event.id}`)}
									class="flex-1 rounded-sm border-2 border-violet-500 bg-violet-400/20 px-4 py-2 font-semibold duration-200 hover:bg-violet-400/70"
								>
									View Event
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
