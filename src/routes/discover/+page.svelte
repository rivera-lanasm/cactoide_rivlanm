<script lang="ts">
	import type { Event, EventType } from '$lib/types';
	import { goto } from '$app/navigation';
	import type { PageData } from '../$types';
	import { formatTime, formatDate, isEventInTimeRange } from '$lib/dateHelpers';
	import Fuse from 'fuse.js';

	let publicEvents: Event[] = [];
	let error = '';
	let searchQuery = '';
	let selectedEventType: EventType | 'all' = 'all';
	let selectedTimeFilter: 'any' | 'next-week' | 'next-month' = 'any';
	let selectedTemporalStatus: 'all' | 'upcoming' | 'past' = 'all';
	let selectedSortOrder: 'asc' | 'desc' = 'asc';
	let showFilters = false;
	let fuse: Fuse<Event>;

	export let data: PageData;
	// Use the server-side data
	$: publicEvents = data.events;

	// Initialize Fuse.js with search options
	$: fuse = new Fuse(publicEvents, {
		keys: [
			{ name: 'name', weight: 0.7 },
			{ name: 'location', weight: 0.3 }
		],
		threshold: 0.3, // Lower threshold = more strict matching
		includeScore: true,
		includeMatches: true
	});

	// Filter events based on search query, event type, time filter, and temporal status
	$: filteredEvents = (() => {
		let events = publicEvents;

		// First filter by event type
		if (selectedEventType !== 'all') {
			events = events.filter((event) => event.type === selectedEventType);
		}

		// Then filter by temporal status (past/upcoming/all)
		if (selectedTemporalStatus !== 'all') {
			events = events.filter((event) => isEventInTimeRange(event, selectedTemporalStatus));
		}

		// Then filter by time range
		if (selectedTimeFilter !== 'any') {
			events = events.filter((event) => isEventInTimeRange(event, selectedTimeFilter));
		}

		// Then apply search query
		if (searchQuery.trim() !== '') {
			events = fuse.search(searchQuery).map((result) => result.item);
			// Re-apply all filters after search
			if (selectedEventType !== 'all') {
				events = events.filter((event) => event.type === selectedEventType);
			}
			if (selectedTemporalStatus !== 'all') {
				events = events.filter((event) => isEventInTimeRange(event, selectedTemporalStatus));
			}
			if (selectedTimeFilter !== 'any') {
				events = events.filter((event) => isEventInTimeRange(event, selectedTimeFilter));
			}
		}

		// Sort events by date and time
		events = events.sort((a, b) => {
			const dateA = new Date(`${a.date}T${a.time}`);
			const dateB = new Date(`${b.date}T${b.time}`);

			if (selectedSortOrder === 'asc') {
				return dateA.getTime() - dateB.getTime();
			} else {
				return dateB.getTime() - dateA.getTime();
			}
		});

		return events;
	})();
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
					<h2 class="text-2xl font-bold text-slate-300">Public Events ({filteredEvents.length})</h2>
					<p class="text-slate-500">Discover events created by the community</p>
				</div>

				<!-- Search and Filter Section -->
				<div class="mb-8 max-h-screen">
					<!-- Search Bar and Filter Toggle -->
					<div class="mx-auto flex w-full items-center gap-3 md:w-2/3">
						<div class="relative flex-1">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<svg
									class="h-5 w-5 text-slate-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									></path>
								</svg>
							</div>
							<input
								type="text"
								bind:value={searchQuery}
								placeholder="Search events by name, location..."
								class="w-full rounded-sm border border-slate-600 bg-slate-800 pl-10 text-white placeholder-slate-400 focus:border-violet-500 focus:ring-violet-500/20"
							/>
							{#if searchQuery}
								<button
									on:click={() => (searchQuery = '')}
									class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-300"
									aria-label="Search input"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										></path>
									</svg>
								</button>
							{/if}
						</div>

						<!-- Filter Toggle Button -->
						<button
							on:click={() => (showFilters = !showFilters)}
							class="flex items-center rounded-sm border p-3 font-semibold {showFilters
								? 'border-violet-500 bg-violet-400/20'
								: 'border-slate-600 bg-slate-800'}"
							aria-label="Toggle filters"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
								></path>
							</svg>
						</button>
					</div>

					<!-- Time Filter and Sort Controls -->
					{#if showFilters}
						<div
							class="mx-auto mt-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
						>
							<!-- Event Type Filter -->
							<div class="flex items-center gap-2">
								<label for="event-type-filter" class="text-sm font-medium text-slate-400"
									>Type:</label
								>
								<select
									id="event-type-filter"
									bind:value={selectedEventType}
									class="rounded-sm border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
								>
									<option value="all">All</option>
									<option value="limited">Limited</option>
									<option value="unlimited">Unlimited</option>
								</select>
							</div>
							<!-- Temporal Status Filter -->
							<div class="flex items-center gap-2">
								<label for="temporal-status-filter" class="text-sm font-medium text-slate-400"
									>Status:</label
								>
								<select
									id="temporal-status-filter"
									bind:value={selectedTemporalStatus}
									class="rounded-sm border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
								>
									<option value="all">All events</option>
									<option value="upcoming">Upcoming events</option>
									<option value="past">Past events</option>
								</select>
							</div>
							<!-- Time Filter Dropdown -->
							<div class="flex items-center gap-2">
								<label for="time-filter" class="text-sm font-medium text-slate-400">Time:</label>
								<select
									id="time-filter"
									bind:value={selectedTimeFilter}
									class="rounded-sm border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
								>
									<option value="any">Any time</option>
									<option value="next-week">Next week</option>
									<option value="next-month">Next month</option>
								</select>
							</div>

							<!-- Sort Order Dropdown -->
							<div class="flex items-center gap-2">
								<label for="sort-order" class="text-sm font-medium text-slate-400">Sort:</label>
								<select
									id="sort-order"
									bind:value={selectedSortOrder}
									class="rounded-sm border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
								>
									<option value="asc">Earliest first</option>
									<option value="desc">Latest first</option>
								</select>
							</div>
						</div>
					{/if}
				</div>

				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each filteredEvents as event, i (i)}
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

				{#if searchQuery && filteredEvents.length === 0}
					<div class="mt-8 text-center">
						<div class="mb-4 text-4xl">🔍</div>
						<h3 class="mb-2 text-xl font-bold text-slate-300">No events found</h3>
						<p class="text-slate-500">Try adjusting your search terms or browse all events</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
