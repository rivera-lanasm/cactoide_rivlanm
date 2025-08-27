<script lang="ts">
	import type { CreateEventData, EventType } from '$lib/types';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	export let form;

	let eventData: CreateEventData = {
		name: '',
		date: '',
		time: '',
		location: '',
		type: 'unlimited',
		attendee_limit: undefined,
		visibility: 'public'
	};

	let errors: Record<string, string> = {};
	let isSubmitting = false;
	let currentUserId = '';

	// Get today's date in YYYY-MM-DD format for min attribute
	const today = new Date().toISOString().split('T')[0];

	// Handle form errors from server
	$: if (form?.error) {
		errors.server = form.error;
	}

	// Pre-fill form with values from server on error
	$: if (form?.values) {
		eventData = {
			...eventData,
			...form.values,
			attendee_limit: form.values.attendee_limit
				? parseInt(String(form.values.attendee_limit))
				: undefined
		};
	}

	function handleTypeChange(type: EventType) {
		eventData.type = type;
		if (type === 'unlimited') {
			eventData.attendee_limit = undefined;
		}
	}
</script>

<svelte:head>
	<title>Create Event - Cactoide</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<!-- Main Content -->
	<div class="container mx-auto flex-1 px-4 py-8">
		<div class="mx-auto max-w-md">
			<!-- Event Creation Form -->
			<div class="rounded-sm border p-8">
				<h2 class="mb-8 text-center text-3xl font-bold text-violet-400">Create New Event</h2>

				<form
					method="POST"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ result, update }) => {
							isSubmitting = false;
							if (result.type === 'failure') {
								// Handle validation errors
								if (result.data?.error) {
									errors.server = result.data.error;
								}
							}
							update();
						};
					}}
					class="space-y-6"
				>
					<input type="hidden" name="userId" value={currentUserId} />
					<input type="hidden" name="type" value={eventData.type} />
					<input type="hidden" name="visibility" value={eventData.visibility} />

					{#if errors.server}
						<div class="mb-6 rounded-sm border border-red-200 bg-red-50 p-4 text-red-700">
							{errors.server}
						</div>
					{/if}

					<!-- Event Name -->
					<div>
						<label for="name" class="text-dark-800 mb-3 block text-sm font-semibold">
							Name <span class="text-red-400">*</span>
						</label>
						<input
							id="name"
							name="name"
							type="text"
							bind:value={eventData.name}
							class="border-dark-300 w-full rounded-sm border-2 px-4 py-3 text-slate-900 shadow-sm"
							placeholder="Enter event name"
							maxlength="100"
							required
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
								name="date"
								type="date"
								bind:value={eventData.date}
								min={today}
								class="border-dark-300 w-full rounded-sm border-2 bg-white px-4 py-3 text-slate-900 shadow-sm transition-all duration-200"
								required
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
								name="time"
								type="time"
								bind:value={eventData.time}
								class="border-dark-300 w-full rounded-sm border-2 bg-white px-4 py-3 text-slate-900 shadow-sm transition-all duration-200"
								required
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
							name="location"
							type="text"
							bind:value={eventData.location}
							class="border-dark-300 placeholder-dark-500 w-full rounded-sm border-2 px-4 py-3 text-slate-900 shadow-sm transition-all"
							placeholder="Enter location"
							maxlength="200"
							required
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
								name="attendee_limit"
								type="number"
								bind:value={eventData.attendee_limit}
								min="1"
								max="1000"
								class="border-dark-300 w-full rounded-sm border-2 bg-white px-4 py-3 text-slate-900 shadow-sm transition-all duration-200"
								placeholder="Enter limit"
								required
							/>
							{#if errors.attendee_limit}
								<p class="mt-2 text-sm font-medium text-red-600">{errors.attendee_limit}</p>
							{/if}
						</div>
					{/if}

					<!-- Event Visibility -->
					<div>
						<label class="text-dark-800 mb-3 block text-sm font-semibold">
							Visibility <span class="text-red-400">*</span></label
						>
						<div class="grid grid-cols-2 gap-3">
							<button
								type="button"
								class="rounded-sm border-2 px-4 py-3 font-medium transition-all duration-200 {eventData.visibility ===
								'public'
									? ' border-violet-500 bg-violet-400/20 font-semibold hover:bg-violet-400/70'
									: 'border-dark-300 text-dark-700'}"
								on:click={() => (eventData.visibility = 'public')}
							>
								🌍 Public
							</button>
							<button
								type="button"
								class="rounded-sm border-2 px-4 py-3 font-medium transition-all duration-200 {eventData.visibility ===
								'private'
									? ' border-violet-500 bg-violet-400/20 font-semibold hover:bg-violet-400/70'
									: 'border-dark-300 text-dark-700 bg-gray-600/20 hover:bg-gray-600/70'}"
								on:click={() => (eventData.visibility = 'private')}
							>
								🔒 Private
							</button>
						</div>
						<p class="mt-2 text-xs text-slate-400">
							{eventData.visibility === 'public'
								? 'Public events are visible to everyone and can be discovered by others'
								: 'Private events are only visible to you and people you share the link with'}
						</p>
					</div>

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
