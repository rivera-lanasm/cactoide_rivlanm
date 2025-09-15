<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { CalendarEvent } from '../calendarHelpers.js';
	import {
		addToGoogleCalendar,
		addToOutlookCalendar,
		downloadICalFile
	} from '../calendarHelpers.js';

	export let isOpen: boolean = false;
	export let event: CalendarEvent;
	export let eventId: string;
	export let baseUrl: string = '';

	const dispatch = createEventDispatcher();

	const closeModal = () => {
		dispatch('close');
	};

	const handleModalClick = (event: MouseEvent) => {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			closeModal();
		}
	};

	const handleGoogleCalendar = () => {
		addToGoogleCalendar(event, eventId, baseUrl);
		closeModal();
	};

	const handleOutlookCalendar = () => {
		addToOutlookCalendar(event, eventId, baseUrl);
		closeModal();
	};

	const handleDownloadICal = () => {
		downloadICalFile(event, eventId);
		closeModal();
	};

	// Focus the first button when modal opens
	$: if (isOpen) {
		setTimeout(() => {
			const firstButton = document.querySelector('[data-calendar-option]') as HTMLButtonElement;
			firstButton?.focus();
		}, 100);
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		on:click={handleModalClick}
		on:keydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="calendar-modal-title"
		tabindex="-1"
	>
		<div class="mx-4 w-full max-w-md rounded-sm border border-white/20 bg-slate-900 p-6 shadow-2xl">
			<div class="mb-6 flex items-center justify-between">
				<h3 id="calendar-modal-title" class="text-xl font-bold text-white">Add to Calendar</h3>
				<button
					on:click={closeModal}
					class="text-slate-400 transition-colors duration-200 hover:text-white"
					aria-label="Close modal"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						></path>
					</svg>
				</button>
			</div>

			<div class="space-y-3">
				<button
					on:click={handleGoogleCalendar}
					data-calendar-option
					class="w-full rounded-sm border border-white/20 bg-white/5 px-4 py-3 text-left transition-all duration-200 hover:scale-105 hover:bg-white/10"
				>
					<div class="flex items-center space-x-3">
						<div class="flex h-8 w-8 items-center justify-center rounded-sm bg-blue-500/20">
							<svg class="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84.81-.62z"
								/>
								<path
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
						</div>
						<div>
							<p class="font-semibold text-white">Google Calendar</p>
							<p class="text-sm text-slate-400">Add to Google Calendar</p>
						</div>
					</div>
				</button>

				<button
					on:click={handleOutlookCalendar}
					class="w-full rounded-sm border border-white/20 bg-white/5 px-4 py-3 text-left transition-all duration-200 hover:scale-105 hover:bg-white/10"
				>
					<div class="flex items-center space-x-3">
						<div class="flex h-8 w-8 items-center justify-center rounded-sm bg-blue-600/20">
							<svg class="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M7.462 2.573c-.2-.2-.4-.2-.6 0L.2 9.235c-.2.2-.2.4 0 .6l6.662 6.662c.2.2.4.2.6 0l6.662-6.662c.2-.2.2-.4 0-.6L7.462 2.573z"
								/>
								<path
									d="M23.8 9.235l-6.662-6.662c-.2-.2-.4-.2-.6 0L9.876 9.235c-.2.2-.2.4 0 .6l6.662 6.662c.2.2.4.2.6 0l6.662-6.662c.2-.2.2-.4 0-.6z"
								/>
							</svg>
						</div>
						<div>
							<p class="font-semibold text-white">Microsoft Outlook</p>
							<p class="text-sm text-slate-400">Add to Outlook Calendar</p>
						</div>
					</div>
				</button>

				<button
					on:click={handleDownloadICal}
					class="w-full rounded-sm border border-white/20 bg-white/5 px-4 py-3 text-left transition-all duration-200 hover:scale-105 hover:bg-white/10"
				>
					<div class="flex items-center space-x-3">
						<div class="flex h-8 w-8 items-center justify-center rounded-sm bg-violet-500/20">
							<svg
								class="h-4 w-4 text-violet-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
						<div>
							<p class="font-semibold text-white">Download iCal File</p>
							<p class="text-sm text-slate-400">Download .ics file for any calendar app</p>
						</div>
					</div>
				</button>
			</div>
		</div>
	</div>
{/if}
