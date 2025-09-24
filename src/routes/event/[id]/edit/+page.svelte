<script lang="ts">
	import type { EventType, LocationType } from '$lib/types';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n/i18n.js';

	export let data;
	export let form;

	let eventData = {
		name: data.event.name,
		date: data.event.date,
		time: data.event.time,
		location: data.event.location,
		location_type: data.event.locationType || 'text',
		location_url: data.event.locationUrl || '',
		type: data.event.type,
		attendee_limit: data.event.attendeeLimit,
		visibility: data.event.visibility
	};

	let errors: Record<string, string> = {};
	let isSubmitting = false;

	// Get today's date in YYYY-MM-DD format for min attribute
	const today = new Date().toISOString().split('T')[0];

	// Handle form errors from server
	$: if (form?.error) {
		errors.server = form.error;
	}

	// Pre-fill form with values from server on error
	$: if (form && 'values' in form && form.values) {
		const values = form.values;
		eventData = {
			...eventData,
			...values,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			attendee_limit: (values as any).attendee_limit
				? // eslint-disable-next-line @typescript-eslint/no-explicit-any
					parseInt(String((values as any).attendee_limit))
				: null
		};
	}

	const handleTypeChange = (type: EventType) => {
		eventData.type = type;
		if (type === 'unlimited') {
			eventData.attendee_limit = null;
		}
	};

	const handleLocationTypeChange = (locationType: LocationType) => {
		eventData.location_type = locationType;
		if (locationType === 'text') {
			eventData.location_url = '';
			eventData.location = '';
		} else {
			eventData.location = 'Google Maps';
		}
	};

	const handleCancel = () => {
		goto(`/event/${data.event.id}`);
	};
</script>

<svelte:head>
	<title>{t('event.editTitle', { eventName: data.event.name })}</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<!-- Main Content -->
	<div class="container mx-auto flex-1 px-4 py-8">
		<div class="mx-auto max-w-md">
			<!-- Event Edit Form -->
			<div class="rounded-sm border p-8">
				<div class="mb-8 text-center">
					<h2 class="text-3xl font-bold text-violet-400">{t('event.editEventTitle')}</h2>
					<p class="mt-2 text-sm text-slate-400">{t('event.editEventDescription')}</p>
				</div>

				<form
					method="POST"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ result, update }) => {
							isSubmitting = false;
							if (result.type === 'failure') {
								// Handle validation errors
								if (result.data?.error) {
									errors.server = String(result.data.error);
								}
							}
							update();
						};
					}}
					class="space-y-6"
				>
					{#if errors.server}
						<div class="mb-6 rounded-sm border border-red-200 bg-red-50 p-4 text-red-700">
							{errors.server}
						</div>
					{/if}

					<!-- Event Name -->
					<div>
						<label for="name" class="text-dark-800 mb-3 block text-sm font-semibold">
							{t('common.name')} <span class="text-red-400">{t('common.required')}</span>
						</label>
						<input
							id="name"
							name="name"
							type="text"
							bind:value={eventData.name}
							class="border-dark-300 w-full rounded-sm border-2 px-4 py-3 text-slate-900 shadow-sm"
							placeholder={t('common.enterEventName')}
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
								{t('common.date')} <span class="text-red-400">{t('common.required')}</span>
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
								{t('common.time')} <span class="text-red-400">{t('common.required')}</span>
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

					<!-- Location Type -->
					<div>
						<fieldset>
							<legend class="text-dark-800 mb-3 block text-sm font-semibold">
								{t('create.locationTypeLabel')}
								<span class="text-red-400">{t('common.required')}</span>
							</legend>
							<div class="grid grid-cols-2 gap-3">
								<button
									type="button"
									class="rounded-sm border-2 px-4 py-3 font-medium transition-all duration-200 {eventData.location_type ===
									'text'
										? ' border-violet-500 bg-violet-400/20 font-semibold hover:bg-violet-400/70'
										: 'border-dark-300 text-dark-700'}"
									on:click={() => handleLocationTypeChange('text')}
								>
									{t('create.locationTextOption')}
								</button>
								<button
									type="button"
									class="rounded-sm border-2 px-4 py-3 font-medium transition-all duration-200 {eventData.location_type ===
									'maps'
										? ' border-violet-500 bg-violet-400/20 font-semibold hover:bg-violet-400/70'
										: 'border-dark-300 text-dark-700 bg-gray-600/20 hover:bg-gray-600/70'}"
									on:click={() => handleLocationTypeChange('maps')}
								>
									{t('create.locationMapsOption')}
								</button>
							</div>
							<p class="mt-2 text-xs text-slate-400">
								{eventData.location_type === 'text'
									? t('create.locationTextDescription')
									: t('create.locationMapsDescription')}
							</p>
						</fieldset>
					</div>

					<!-- Location Input -->
					<div>
						<label for="location" class="text-dark-800 mb-3 block text-sm font-semibold">
							{eventData.location_type === 'text'
								? t('create.locationTypeLabel')
								: t('create.googleMapsUrlLabel')}
							<span class="text-red-400">{t('common.required')}</span>
						</label>
						{#if eventData.location_type === 'text'}
							<input
								id="location"
								name="location"
								type="text"
								bind:value={eventData.location}
								class="border-dark-300 placeholder-dark-500 w-full rounded-sm border-2 px-4 py-3 text-slate-900 shadow-sm transition-all"
								placeholder={t('create.locationPlaceholder')}
								maxlength="200"
								required
							/>
						{:else}
							<input
								id="location_url"
								name="location_url"
								type="url"
								bind:value={eventData.location_url}
								class="border-dark-300 placeholder-dark-500 w-full rounded-sm border-2 px-4 py-3 text-slate-900 shadow-sm transition-all"
								placeholder={t('create.googleMapsUrlPlaceholder')}
								maxlength="500"
								required
							/>
						{/if}
						{#if errors.location}
							<p class="mt-2 text-sm font-medium text-red-600">{errors.location}</p>
						{/if}
						{#if errors.location_url}
							<p class="mt-2 text-sm font-medium text-red-600">{errors.location_url}</p>
						{/if}
					</div>

					<!-- Event Type -->
					<div>
						<fieldset>
							<legend class="text-dark-800 mb-3 block text-sm font-semibold">
								{t('common.type')} <span class="text-red-400">{t('common.required')}</span>
							</legend>
							<div class="grid grid-cols-2 gap-3">
								<button
									type="button"
									class="rounded-sm border-2 px-4 py-3 font-medium transition-all duration-200 {eventData.type ===
									'unlimited'
										? ' border-violet-500 bg-violet-400/20 font-semibold hover:bg-violet-400/70'
										: 'border-dark-300 text-dark-700'}"
									on:click={() => handleTypeChange('unlimited')}
								>
									{t('common.unlimited')}
								</button>
								<button
									type="button"
									class="rounded-sm border-2 px-4 py-3 font-medium transition-all duration-200 {eventData.type ===
									'limited'
										? ' border-violet-500 bg-violet-400/20 font-semibold hover:bg-violet-400/70'
										: 'border-dark-300 text-dark-700 bg-gray-600/20 hover:bg-gray-600/70'}"
									on:click={() => handleTypeChange('limited')}
								>
									{t('common.limited')}
								</button>
							</div>
						</fieldset>
					</div>

					<!-- Limit (only for limited events) -->
					{#if eventData.type === 'limited'}
						<div>
							<label for="limit" class="text-dark-800 mb-3 block text-sm font-semibold">
								{t('common.attendeeLimit')} <span class="text-red-400">{t('common.required')}</span>
							</label>
							<input
								id="attendee_limit"
								name="attendee_limit"
								type="number"
								bind:value={eventData.attendee_limit}
								min="1"
								max="1000"
								class="border-dark-300 w-full rounded-sm border-2 bg-white px-4 py-3 text-slate-900 shadow-sm transition-all duration-200"
								placeholder={t('common.enterLimit')}
								required
							/>
							{#if errors.attendee_limit}
								<p class="mt-2 text-sm font-medium text-red-600">{errors.attendee_limit}</p>
							{/if}
						</div>
					{/if}

					<!-- Event Visibility -->
					<div>
						<fieldset>
							<legend class="text-dark-800 mb-3 block text-sm font-semibold">
								{t('common.visibility')} <span class="text-red-400">{t('common.required')}</span>
							</legend>
							<div class="grid grid-cols-2 gap-3">
								<button
									type="button"
									class="rounded-sm border-2 px-4 py-3 font-medium transition-all duration-200 {eventData.visibility ===
									'public'
										? ' border-violet-500 bg-violet-400/20 font-semibold hover:bg-violet-400/70'
										: 'border-dark-300 text-dark-700'}"
									on:click={() => (eventData.visibility = 'public')}
								>
									{t('create.publicOption')}
								</button>
								<button
									type="button"
									class="rounded-sm border-2 px-4 py-3 font-medium transition-all duration-200 {eventData.visibility ===
									'private'
										? ' border-violet-500 bg-violet-400/20 font-semibold hover:bg-violet-400/70'
										: 'border-dark-300 text-dark-700 bg-gray-600/20 hover:bg-gray-600/70'}"
									on:click={() => (eventData.visibility = 'private')}
								>
									{t('create.privateOption')}
								</button>
							</div>
							<p class="mt-2 text-xs text-slate-400">
								{eventData.visibility === 'public'
									? t('create.publicDescription')
									: t('create.privateDescription')}
							</p>
						</fieldset>
					</div>

					<!-- Action Buttons -->
					<div class="flex space-x-3">
						<button
							type="button"
							on:click={handleCancel}
							class="flex-1 rounded-sm border-2 border-slate-300 bg-slate-200 px-4 py-3 font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-400 hover:text-slate-200"
						>
							{t('common.cancel')}
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							class="hover:bg-violet-400/70' flex-1 rounded-sm border-2 border-violet-500 bg-violet-400/20 px-4 py-3 font-bold font-medium font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105"
						>
							{#if isSubmitting}
								<div class="flex items-center justify-center">
									<div class="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
									{t('event.updatingEvent')}
								</div>
							{:else}
								{t('event.updateEventButton')}
							{/if}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
