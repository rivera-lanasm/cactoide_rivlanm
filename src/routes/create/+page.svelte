<script lang="ts">
	import { eventsStore } from '$lib/stores/events-supabase';
	import type { CreateEventData, EventType } from '$lib/types';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let eventData: CreateEventData = {
		name: '',
		date: '',
		time: '',
		location: '',
		type: 'unlimited',
		attendee_limit: undefined
	};

	let errors: Record<string, string> = {};
	let isSubmitting = false;
	let currentUserId = '';

	// Get today's date in YYYY-MM-DD format for min attribute
	const today = new Date().toISOString().split('T')[0];

	// Generate or retrieve user ID on mount
	onMount(() => {
		generateUserId();
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

	function validateForm(): boolean {
		errors = {};

		if (!eventData.name.trim()) {
			errors.name = 'Event name is required';
		}

		if (!eventData.date) {
			errors.date = 'Date is required';
		} else if (new Date(eventData.date) < new Date(today)) {
			errors.date = 'Date cannot be in the past';
		}

		if (!eventData.time) {
			errors.time = 'Time is required';
		}

		if (!eventData.location.trim()) {
			errors.location = 'Location is required';
		}

		if (
			eventData.type === 'limited' &&
			(!eventData.attendee_limit || eventData.attendee_limit < 1)
		) {
			errors.attendee_limit = 'Limit must be at least 1 for limited events';
		}

		return Object.keys(errors).length === 0;
	}

	async function handleSubmit() {
		if (!validateForm()) return;

		isSubmitting = true;

		try {
			// Simulate API call delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const eventId = await eventsStore.createEvent(eventData, currentUserId);

			// Redirect to the event page
			goto(`/event/${eventId}`);
		} catch (error) {
			console.error('Error creating event:', error);
		} finally {
			isSubmitting = false;
		}
	}

	function handleTypeChange(type: EventType) {
		eventData.type = type;
		if (type === 'unlimited') {
			eventData.attendee_limit = undefined;
		}
	}
</script>

<svelte:head>
	<title>Create Event - Event Cactus</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<!-- Main Content -->
	<div class="container mx-auto flex-1 px-4 py-8">
		<div class="mx-auto max-w-md">
			<!-- Event Creation Form -->
			<div class="rounded-sm border p-8">
				<h2 class="mb-8 text-center text-3xl font-bold text-violet-400">Create New Event</h2>

				<form on:submit|preventDefault={handleSubmit} class="space-y-6">
					<!-- Event Name -->
					<div>
						<label for="name" class="text-dark-800 mb-3 block text-sm font-semibold">
							Name <span class="text-red-400">*</span>
						</label>
						<input
							id="name"
							type="text"
							bind:value={eventData.name}
							class="border-dark-300 w-full rounded-sm border-2 px-4 py-3 text-slate-900 shadow-sm"
							placeholder="Enter event name"
							maxlength="100"
						/>
						{#if errors.name}
							<p class="mt-2 text-sm font-medium text-red-600">{errors.name}</p>
						{/if}
					</div>

					<!-- Date and Time Row -->
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="date" class="text-dark-800 mb-3 block text-sm font-semibold">
								Date <span class="text-red-400">*</span>
							</label>
							<input
								id="date"
								type="date"
								bind:value={eventData.date}
								min={today}
								class="border-dark-300 w-full rounded-sm border-2 bg-white px-4 py-3 text-slate-900 shadow-sm transition-all duration-200"
							/>
							{#if errors.date}
								<p class="mt-2 text-sm font-medium text-red-600">{errors.date}</p>
							{/if}
						</div>

						<div>
							<label for="time" class="text-dark-800 mb-3 block text-sm font-semibold">
								Time <span class="text-red-400">*</span>
							</label>
							<input
								id="time"
								type="time"
								bind:value={eventData.time}
								class="border-dark-300 w-full rounded-sm border-2 bg-white px-4 py-3 text-slate-900 shadow-sm transition-all duration-200"
							/>
							{#if errors.time}
								<p class="mt-2 text-sm font-medium text-red-600">{errors.time}</p>
							{/if}
						</div>
					</div>

					<!-- Location -->
					<div>
						<label for="location" class="text-dark-800 mb-3 block text-sm font-semibold">
							Location <span class="text-red-400">*</span>
						</label>
						<input
							id="location"
							type="text"
							bind:value={eventData.location}
							class="border-dark-300 placeholder-dark-500 w-full rounded-sm border-2 px-4 py-3 text-slate-900 shadow-sm transition-all"
							placeholder="Enter location"
							maxlength="200"
						/>
						{#if errors.location}
							<p class="mt-2 text-sm font-medium text-red-600">{errors.location}</p>
						{/if}
					</div>

					<!-- Event Type -->
					<div>
						<label class="text-dark-800 mb-3 block text-sm font-semibold">
							Type <span class="text-red-400">*</span></label
						>
						<div class="grid grid-cols-2 gap-3">
							<button
								type="button"
								class="rounded-sm border-2 px-4 py-3 font-medium transition-all duration-200 {eventData.type ===
								'unlimited'
									? ' border-violet-500 bg-violet-400/20 font-semibold hover:bg-violet-400/70'
									: 'border-dark-300 text-dark-700'}"
								on:click={() => handleTypeChange('unlimited')}
							>
								Unlimited
							</button>
							<button
								type="button"
								class="rounded-sm border-2 px-4 py-3 font-medium transition-all duration-200 {eventData.type ===
								'limited'
									? ' border-violet-500 bg-violet-400/20 font-semibold hover:bg-violet-400/70'
									: 'border-dark-300 text-dark-700 bg-gray-600/20 hover:bg-gray-600/70'}"
								on:click={() => handleTypeChange('limited')}
							>
								Limited
							</button>
						</div>
					</div>

					<!-- Limit (only for limited events) -->
					{#if eventData.type === 'limited'}
						<div>
							<label for="limit" class="text-dark-800 mb-3 block text-sm font-semibold">
								Attendee Limit *
							</label>
							<input
								id="attendee_limit"
								type="number"
								bind:value={eventData.attendee_limit}
								min="1"
								max="1000"
								class="border-dark-300 w-full rounded-sm border-2 bg-white px-4 py-3 text-slate-900 shadow-sm transition-all duration-200"
								placeholder="Enter limit"
							/>
							{#if errors.attendee_limit}
								<p class="mt-2 text-sm font-medium text-red-600">{errors.attendee_limit}</p>
							{/if}
						</div>
					{/if}

					<!-- Submit Button -->
					<button
						type="submit"
						disabled={isSubmitting}
						class="hover:bg-violet-400/70' w-full rounded-sm border-2 border-violet-500 bg-violet-400/20 px-4 py-3 py-4 font-bold font-medium font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105"
					>
						{#if isSubmitting}
							<div class="flex items-center justify-center">
								<div class="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
								Creating Event...
							</div>
						{:else}
							Create Event
						{/if}
					</button>
				</form>
			</div>

			<!-- Info Section -->
			<div class="mt-8 p-6 text-center">
				<p class="text-dark-100 font-medium">
					Share the generated link with others to collect RSVPs.
				</p>
				<p class="mt-2 text-sm text-violet-300">
					No registration required • Mobile optimized • Instant sharing
				</p>
			</div>
		</div>
	</div>
</div>
