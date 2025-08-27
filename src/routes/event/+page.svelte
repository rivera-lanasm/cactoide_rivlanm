<script lang="ts">
	import { eventsStore } from '$lib/stores/events-supabase';
	import type { Event } from '$lib/types';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let userEvents: Event[] = [];
	let isLoading = true;
	let error = '';
	let currentUserId = '';
	let showDeleteModal = false;
	let eventToDelete: Event | null = null;

	onMount(() => {
		generateUserId();
		loadUserEvents();
	});

	function generateUserId() {
		// Generate a unique user ID and store it in localStorage
		let userId = localStorage.getItem('eventCactusUserId');
		if (!userId) {
			userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
			localStorage.setItem('eventCactusUserId', userId);
		}
		currentUserId = userId;
	}

	async function loadUserEvents() {
		if (!currentUserId) return;

		try {
			isLoading = true;
			userEvents = await eventsStore.getEventsByUser(currentUserId);
		} catch (err) {
			error = 'Failed to load your events';
		} finally {
			isLoading = false;
		}
	}

	function openDeleteModal(event: Event) {
		eventToDelete = event;
		showDeleteModal = true;
	}

	async function confirmDelete() {
		if (!eventToDelete) return;

		try {
			const eventId = eventToDelete.id;
			const success = await eventsStore.deleteEvent(eventId, currentUserId);
			if (success) {
				// Remove from local list
				userEvents = userEvents.filter((event) => event.id !== eventId);
				showDeleteModal = false;
				eventToDelete = null;
			} else {
				error = 'Failed to delete event. You may not have permission to delete this event.';
			}
		} catch (err) {
			error = 'An error occurred while deleting the event';
		}
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		eventToDelete = null;
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}/${month}/${day}`;
	}

	function formatTime(timeString: string): string {
		const [hours, minutes] = timeString.split(':');
		return `${hours}:${minutes}`;
	}
</script>

<svelte:head>
	<title>My Events - Event Cactus</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<!-- Main Content -->
	<div class="container mx-auto mt-8 flex-1 px-4 py-8 text-white">
		{#if isLoading}
			<div class="mx-auto max-w-2xl text-center">
				<div
					class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-violet-600"
				></div>
				<p>Loading your events...</p>
			</div>
		{:else if error}
			<div class="mx-auto max-w-2xl text-center">
				<div class="mb-4 text-4xl text-red-500">⚠️</div>
				<p class="text-red-600">{error}</p>
				<button
					on:click={loadUserEvents}
					class="rounded-sm border-2 border-violet-500 px-8 py-4 font-bold duration-400 hover:scale-110 hover:bg-violet-500/10"
				>
					Try Again
				</button>
			</div>
		{:else if userEvents.length === 0}
			<div class="mx-auto max-w-2xl text-center">
				<div class="mb-4 animate-pulse text-6xl">🎉</div>
				<h2 class="mb-4 text-2xl font-bold">No Events Yet</h2>
				<p class="text-white-600 mb-8">
					You haven't created any events yet. Start by creating your first event!
				</p>
				<button
					on:click={() => goto('/create')}
					class="rounded-sm border-2 border-violet-500 px-8 py-4 font-bold duration-400 hover:scale-110 hover:bg-violet-500/10"
				>
					Create Your First Event
				</button>
			</div>
		{:else}
			<div class="mx-auto max-w-4xl">
				<div class="mb-6">
					<h2 class="text-2xl font-bold text-slate-400">My Events ({userEvents.length})</h2>
					<p class="text-slate-500">Manage your created events</p>
				</div>

				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each userEvents as event}
						<div class="rounded-sm border border-slate-200 p-6 shadow-sm">
							<div class="mb-4">
								<div class="mb-3 flex items-center justify-between">
									<h3 class="text-xl font-bold text-slate-300">{event.name}</h3>
								</div>
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
										<span class="rounded-sm border border-slate-300 px-2 py-1 text-xs font-medium">
											{event.type === 'limited' ? 'Limited' : 'Unlimited'}
										</span>
										<span
											class="rounded-sm border px-2 py-1 text-xs font-medium {event.visibility ===
											'public'
												? 'border-green-300 text-green-400'
												: 'border-orange-300 text-orange-400'}"
										>
											{event.visibility === 'public' ? 'Public' : 'Private'}
										</span>
									</div>
									<div class="flex items-center space-x-2"></div>
								</div>
							</div>

							<div class="flex space-x-3">
								<button
									on:click={() => goto(`/event/${event.id}`)}
									class="flex-1 rounded-sm border-2 border-violet-500 bg-violet-400/20 px-4 py-2 font-semibold duration-200 hover:bg-violet-400/70"
								>
									View
								</button>
								<button
									on:click={() => openDeleteModal(event)}
									class="flex-1 rounded-sm border-2 border-red-400 bg-red-400/20 px-4 py-2 font-semibold text-white duration-200 hover:bg-red-400/70"
									aria-label="Delete event"
								>
									Delete
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && eventToDelete}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
		<div class="w-full max-w-md rounded-sm border bg-slate-900/80 p-6">
			<div class="mb-6 text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100"
				>
					<span class="text-2xl text-red-600">🗑️</span>
				</div>
				<h3 class="mb-2 text-xl font-bold text-white">Delete Event</h3>
				<p class="text-slate-400">
					Are you sure you want to delete "<span class="font-semibold">{eventToDelete.name}</span>"?
					This action cannot be undone and will remove all RSVPs.
				</p>
			</div>

			<div class="flex space-x-3">
				<button
					on:click={closeDeleteModal}
					class="flex-1 rounded-sm border-2 border-slate-300 bg-slate-200 px-4 py-2 font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-300"
				>
					Cancel
				</button>
				<button
					on:click={confirmDelete}
					class="flex-1 rounded-sm border-2 border-red-500 bg-red-500 px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-red-600"
				>
					Delete
				</button>
			</div>
		</div>
	</div>
{/if}
