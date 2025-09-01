<script lang="ts">
	import { page } from '$app/stores';
	import type { Event, RSVP } from '$lib/types';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { formatTime, formatDate } from '$lib/dateHelpers.js';

	export let data: { event: Event; rsvps: RSVP[]; userId: string };
	export let form;

	let event: Event;
	let rsvps: RSVP[] = [];
	let newAttendeeName = '';
	let isAddingRSVP = false;
	let error = '';
	let success = '';

	// Use server-side data
	$: event = data.event;
	$: rsvps = data.rsvps;
	$: currentUserId = data.userId;

	// Handle form errors from server
	$: if (form?.error) {
		error = form.error;
		success = '';
	}

	// Handle form success from server
	$: if (form?.success) {
		success = 'RSVP added successfully!';
		error = '';
		newAttendeeName = '';
	}

	const eventId = $page.params.id;

	function copyEventLink() {
		const url = `${window.location.origin}/event/${eventId}`;
		navigator.clipboard.writeText(url).then(() => {
			success = 'Event link copied to clipboard!';
			setTimeout(() => {
				success = '';
			}, 3000);
		});
	}

	function clearMessages() {
		error = '';
		success = '';
	}
</script>

<svelte:head>
	<title>{event?.name || 'Event'} - Cactoide</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<!-- Main Content -->
	<div class="container mx-auto flex-1 px-4 py-6">
		{#if error && !event}
			<!-- Error State -->
			<div class="mx-auto max-w-md text-center">
				<div class="rounded-sm border border-red-500/30 bg-red-900/20 p-8">
					<div class="mb-4 text-6xl text-red-400">⚠️</div>
					<h2 class="mb-4 text-2xl font-bold text-red-400">Event Not Found</h2>
					<p class="my-8">The event you're looking for doesn't exist or has been removed.</p>
					<button
						on:click={() => goto('/create')}
						class="border-white-500 bg-white-400/20 mt-2 rounded-sm border px-6 py-3 font-semibold text-white duration-400 hover:scale-110 hover:bg-white/10"
					>
						Create New Event
					</button>
				</div>
			</div>
		{:else if event}
			<div class="mx-auto max-w-md space-y-6">
				<!-- Event Details Card -->

				<div class="rounded-sm border p-6 shadow-2xl">
					<h2 class=" mb-4 text-center text-2xl font-bold">
						{event.name}
					</h2>

					<div class="space-y-4">
						<!-- Date & Time -->
						<div class="flex items-center space-x-3 text-violet-400">
							<div class="flex h-8 w-8 items-center justify-center rounded-sm">
								<svg class=" h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									></path>
								</svg>
							</div>
							<div>
								<p class="font-semibold text-white">
									{formatDate(event.date)}
									<span class="font-medium text-violet-400">-</span>
									{formatTime(event.time)}
								</p>
							</div>
						</div>

						<!-- Location -->
						<div class="flex items-center space-x-3 text-violet-400">
							<div class="flex h-8 w-8 items-center justify-center rounded-sm">
								<svg class=" h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
							</div>
							<div>
								<p class="font-semibold text-white">{event.location}</p>
							</div>
						</div>

						<!-- Event Type, Visibility & Capacity -->
						<div class="flex items-center justify-between rounded-sm p-3">
							<div class="flex items-center space-x-2">
								<span
									class="rounded-sm border px-2 py-1 text-xs font-medium {event.type === 'limited'
										? 'border-amber-600 text-amber-600'
										: 'border-teal-500 text-teal-500'}"
								>
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

							{#if event.type === 'limited' && event.attendee_limit}
								<div class="text-right">
									<p class="text-sm">Capacity</p>
									<p class=" text-lg font-bold">
										{rsvps.length}/{event.attendee_limit}
									</p>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- RSVP Form -->
				<div class=" rounded-sm border p-6 shadow-2xl backdrop-blur-sm">
					<h3 class=" mb-4 text-xl font-bold">Join This Event</h3>

					{#if event.type === 'limited' && event.attendee_limit && rsvps.length >= event.attendee_limit}
						<div class="py-6 text-center">
							<div class="mb-3 text-4xl text-red-400">🚫</div>
							<p class="font-semibold text-red-400">Event is Full!</p>
							<p class="mt-1 text-sm">Maximum capacity reached</p>
						</div>
					{:else}
						<form
							method="POST"
							action="?/addRSVP"
							use:enhance={() => {
								isAddingRSVP = true;
								clearMessages();
								return async ({ result, update }) => {
									isAddingRSVP = false;
									if (result.type === 'failure') {
										error = result.data?.error || 'Failed to add RSVP';
									}
									update();
								};
							}}
							class="space-y-4"
						>
							<input type="hidden" name="userId" value={currentUserId} />
							<div>
								<label for="attendeeName" class=" mb-2 block text-sm font-semibold">
									Your Name <span class="text-red-400">*</span>
								</label>
								<input
									id="attendeeName"
									name="newAttendeeName"
									type="text"
									bind:value={newAttendeeName}
									class="border-dark-300 w-full rounded-sm border-2 px-4 py-3 text-slate-900 shadow-sm"
									placeholder="Enter your name"
									maxlength="50"
									required
								/>
							</div>

							<button
								type="submit"
								disabled={isAddingRSVP || !newAttendeeName.trim()}
								class=" hover:bg-violet-400/70' w-full rounded-sm border-2 border-violet-500 bg-violet-400/20 px-4 py-3 py-4 font-bold font-medium font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105"
							>
								{#if isAddingRSVP}
									<div class="flex items-center justify-center">
										<div
											class="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"
										></div>
										Adding...
									</div>
								{:else}
									Join Event
								{/if}
							</button>
						</form>
					{/if}
				</div>

				<!-- Attendees List -->
				<div class="rounded-sm border p-6 shadow-2xl backdrop-blur-sm">
					<div class="mb-4 flex items-center justify-between">
						<h3 class=" text-xl font-bold">Attendees</h3>
						<span class="text-2xl font-bold">{rsvps.length}</span>
					</div>

					{#if rsvps.length === 0}
						<div class="text-dark-400 py-8 text-center">
							<p>No attendees yet</p>
							<p class="mt-1 text-sm">Be the first to join!</p>
						</div>
					{:else}
						<div class="space-y-3">
							{#each rsvps as attendee, i (i)}
								<div
									class="flex items-center justify-between rounded-sm border border-white/20 p-3"
								>
									<div class="flex items-center space-x-3">
										<div
											class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
										>
											{attendee.name.charAt(0).toUpperCase()}
										</div>
										<div>
											<p class="font-medium text-white">{attendee.name}</p>
											<p class="text-xs text-violet-400">
												{(() => {
													const date = new Date(attendee.created_at);
													const year = date.getFullYear();
													const month = String(date.getMonth() + 1).padStart(2, '0');
													const day = String(date.getDate()).padStart(2, '0');
													const hours = String(date.getHours()).padStart(2, '0');
													const minutes = String(date.getMinutes()).padStart(2, '0');
													return `${year}/${month}/${day} ${hours}:${minutes}`;
												})()}
											</p>
										</div>
									</div>

									{#if attendee.user_id === currentUserId}
										<form
											method="POST"
											action="?/removeRSVP"
											use:enhance={() => {
												clearMessages();
												return async ({ result, update }) => {
													if (result.type === 'failure') {
														error = result.data?.error || 'Failed to remove RSVP';
													}
													update();
												};
											}}
											style="display: inline;"
										>
											<input type="hidden" name="rsvpId" value={attendee.id} />
											<button
												type="submit"
												class="text-dark-400 p-1 transition-colors duration-200 hover:text-red-400"
												aria-label="Remove RSVP"
											>
												<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													></path>
												</svg>
											</button>
										</form>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Action Buttons -->
				<div class="max-w-2xl">
					<button
						on:click={copyEventLink}
						class="hover:bg-violet-400/70' w-full rounded-sm border-2 border-violet-500 bg-violet-400/20 px-4 py-3 py-4 font-bold font-medium font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105"
					>
						Copy Link
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Success/Error Messages -->
{#if success}
	{#if form?.type === 'add'}
		<div
			class="fixed right-4 bottom-4 z-40 w-128 rounded-sm border border-green-500/30 bg-green-900/20 p-4 text-green-400"
		>
			{success}
		</div>
	{:else if form?.type === 'remove'}
		<div
			class="fixed right-4 bottom-4 z-40 w-128 rounded-sm border border-yellow-500/30 bg-yellow-900/20 p-4 text-yellow-400"
		>
			Removed RSVP successfully.
		</div>
	{/if}
{/if}

{#if error}
	<div
		class="fixed right-4 bottom-4 z-40 w-128 rounded-sm border border-red-500/30 bg-red-900/20 p-4 text-red-400"
	>
		{error}
	</div>
{/if}
