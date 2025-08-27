<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>Cactoide - The RSVP site</title>
	<meta
		name="description"
		content="Create and manage event RSVPs. No registration required, instant sharing."
	/>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<!-- Hero Section -->
	<section class="from-dark-900 to-dark-950 relative overflow-hidden bg-gradient-to-b pt-20 pb-20">
		<div class="container mx-auto px-4 text-center">
			<!-- Animated background elements -->
			<div class="pointer-events-none absolute inset-0 overflow-hidden">
				<div class="animate-float absolute top-20 left-10 h-32 w-32 rounded-full blur-xl"></div>
				<div
					class="bg-crypto-neon/10 animate-float absolute top-40 right-20 h-24 w-24 rounded-full blur-xl"
					style="animation-delay: -2s;"
				></div>
				<div
					class="bg-crypto-cyber/10 animate-float absolute bottom-20 left-1/4 h-20 w-20 rounded-full blur-xl"
					style="animation-delay: -4s;"
				></div>
			</div>

			<div class="relative z-10">
				<h1 class="bg-gradient-to-r bg-clip-text text-5xl font-bold md:text-7xl lg:text-8xl">
					Cactoide 🌵
				</h1>

				<p class="mt-6 text-xl md:text-2xl">The Ultimate RSVP Platform</p>
				<p class="mt-4 text-lg md:text-xl">Create, share, and manage events with zero friction.</p>

				<div
					class="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6"
				>
					<button
						on:click={() => goto('/create')}
						class="rounded-sm border-2 border-violet-500 px-8 py-4 font-bold duration-400 hover:scale-110 hover:bg-violet-500/10"
					>
						Create Event Now
					</button>
				</div>
			</div>
		</div>
	</section>

	<!-- Public Events Section -->
	<section class="py-8">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="text-4xl font-bold text-white">Discover Public Events</h2>
				<p class="mt-4 text-xl text-slate-300">See what others are planning and get inspired</p>
			</div>

			<div class="text-center">
				<button
					on:click={() => goto('/discover')}
					class="rounded-sm border-2 border-violet-500 px-8 py-4 font-bold duration-400 hover:scale-110 hover:bg-violet-500/10"
				>
					Browse All Public Events
				</button>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="py-20">
		<div class="container mx-auto px-4">
			<h2 class=" mb-16 text-center text-4xl font-bold">
				Why <span class="text-violet-400">Cactoide?</span>
			</h2>
			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				<!-- Feature 1 -->
				<div class="rounded-sm border p-8 text-center">
					<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
						<span class="text-4xl">🎯</span>
					</div>
					<h3 class="mb-4 text-xl font-bold text-white">Instant Event Creation</h3>
					<p class="">
						Create events in seconds with our streamlined form. No accounts, no waiting, just pure
						efficiency.
					</p>
				</div>

				<!-- Feature 2 -->
				<div class="rounded-sm border p-8 text-center">
					<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
						<span class="text-4xl">🔗</span>
					</div>
					<h3 class="mb-4 text-xl font-bold text-white">One-Click Sharing</h3>
					<p class="">
						Each event gets a unique, memorable URL. Share instantly via any platform or messaging
						app.
					</p>
				</div>

				<!-- Feature 2 -->
				<div class="rounded-sm border p-8 text-center">
					<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
						<span class="text-4xl">🔍</span>
					</div>
					<h3 class="mb-4 text-xl font-bold text-white">All-in-One Clarity</h3>
					<p class="">
						No more scrolling through endless chats and reactions. See everyone’s availability and
						responses neatly in one place.
					</p>
				</div>

				<!-- Feature 4 -->
				<div class="rounded-sm border p-8 text-center">
					<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
						<span class="text-4xl">👤</span>
					</div>
					<h3 class="mb-4 text-xl font-bold text-white">No Hassle, No Sign-Ups</h3>
					<p class="">
						Skip registrations and endless forms. Unlike other event platforms, you create and share
						instantly — no accounts, no barriers.
					</p>
				</div>

				<!-- Feature 5 -->
				<div class="rounded-sm border p-8 text-center">
					<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
						<span class="text-4xl">🛡️</span>
					</div>
					<h3 class="mb-4 text-xl font-bold text-white">Smart Limits</h3>
					<p class="">
						Choose between unlimited RSVPs or set a limited capacity. Perfect for any event size.
					</p>
				</div>

				<!-- Feature 5 -->
				<div class="rounded-sm border p-8 text-center">
					<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
						<span class="text-4xl">✨</span>
					</div>
					<h3 class="mb-4 text-xl font-bold text-white">Effortless Simplicity</h3>
					<p class="">
						Designed to be instantly clear and easy. No learning curve — just open, create, and go.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- How It Works Section -->
	<section class="py-20">
		<div class="container mx-auto px-4">
			<h2 class=" mb-16 text-center text-4xl font-bold">How It Works</h2>

			<div class="grid gap-8 md:grid-cols-3">
				<!-- Step 1 -->
				<div class="text-center">
					<h3 class="mb-4 text-xl font-bold text-white">
						<span class="text-violet-400">1.</span> Create Event
					</h3>
					<p class="">
						Fill out a simple form with event details. Choose between limited or unlimited capacity.
					</p>
				</div>

				<!-- Step 2 -->
				<div class="text-center">
					<h3 class="mb-4 text-xl font-bold text-white">
						<span class="text-violet-400">2.</span> Get Unique URL
					</h3>
					<p class="">
						Receive a random, memorable URL for your event. Perfect for sharing anywhere.
					</p>
				</div>

				<!-- Step 3 -->
				<div class="text-center">
					<h3 class="mb-4 text-xl font-bold text-white">
						<span class="text-violet-400">3.</span> Collect RSVPs
					</h3>
					<p class="">People visit your link and join with just their name. No accounts needed.</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-20">
		<div class="container mx-auto px-4 text-center">
			<h2 class="mb-6 text-4xl font-bold text-white">
				Ready to Create Your <span class="text-violet-400">First Event</span>?
			</h2>
			<p class="mb-10 text-xl">Join thousands of event organizers who trust Cactoide</p>
			<button
				on:click={() => goto('/create')}
				class="rounded-sm border-2 border-violet-500 px-8 py-4 font-bold duration-400 hover:scale-110 hover:bg-violet-500/10"
			>
				Create
			</button>
		</div>
	</section>
</div>
