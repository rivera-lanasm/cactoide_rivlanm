<script lang="ts">
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n/i18n.js';
</script>

<svelte:head>
	<title>{t('home.title')}</title>
	<meta name="description" content={t('home.description')} />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<section class="mx-auto w-full pt-20 pb-20 md:w-3/4">
		<div class="container mx-auto px-4 text-center">
			<h1 class="text-5xl font-bold md:text-7xl lg:text-8xl">
				{t('home.mainTitle')}<span class="text-violet-400"
					><a href="https://en.wikipedia.org/wiki/Cactoideae" target="_blank">*</a></span
				> 🌵
			</h1>

			<h2 class="mt-6 text-xl md:text-2xl">{t('home.subtitle')}</h2>
			<p class="mt-4 text-lg italic md:text-xl">
				{t('home.tagline')}
			</p>

			<h2 class="mt-6 pt-8 text-xl md:text-2xl">
				{t('home.whyCactoideTitle')}<span class="text-violet-400"
					><a href="https://en.wikipedia.org/wiki/Cactoideae" target="_blank">*</a></span
				>?🌵
			</h2>
			<p class="mt-4 text-lg md:text-xl">
				{t('home.whyCactoideDescription')}
			</p>

			<button
				on:click={() => goto('/create')}
				class="mt-8 rounded-sm border-2 border-violet-500 px-8 py-4 font-bold duration-400 hover:scale-110 hover:bg-violet-500/10"
			>
				{t('home.createEventNow')}
			</button>
		</div>
	</section>

	<!-- Public Events Section -->
	<section class="py-8">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="text-4xl font-bold text-white">{t('home.discoverPublicEventsTitle')}</h2>
				<p class="mt-4 text-xl text-slate-300">{t('home.discoverPublicEventsDescription')}</p>
			</div>

			<div class="text-center">
				<button
					on:click={() => goto('/discover')}
					class="rounded-sm border-2 border-violet-500 px-8 py-4 font-bold duration-400 hover:scale-110 hover:bg-violet-500/10"
				>
					{t('home.browseAllPublicEvents')}
				</button>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="py-20">
		<div class="container mx-auto px-4">
			<h2 class=" mb-16 text-center text-4xl font-bold">
				{t('home.whyCactoideFeatureTitle')}
			</h2>
			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				<!-- Feature 1 -->
				<div class="rounded-sm border p-8 text-center">
					<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
						<span class="text-4xl">🎯</span>
					</div>
					<h3 class="mb-4 text-xl font-bold text-white">{t('home.instantEventCreationTitle')}</h3>
					<p class="">
						{t('home.instantEventCreationDescription')}
					</p>
				</div>

				<!-- Feature 2 -->
				<div class="rounded-sm border p-8 text-center">
					<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
						<span class="text-4xl">🔗</span>
					</div>
					<h3 class="mb-4 text-xl font-bold text-white">{t('home.oneClickSharingTitle')}</h3>
					<p class="">
						{t('home.oneClickSharingDescription')}
					</p>
				</div>

				<!-- Feature 2 -->
				<div class="rounded-sm border p-8 text-center">
					<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
						<span class="text-4xl">🔍</span>
					</div>
					<h3 class="mb-4 text-xl font-bold text-white">{t('home.allInOneClarityTitle')}</h3>
					<p class="">
						{t('home.allInOneClarityDescription')}
					</p>
				</div>

				<!-- Feature 4 -->
				<div class="rounded-sm border p-8 text-center">
					<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
						<span class="text-4xl">👤</span>
					</div>
					<h3 class="mb-4 text-xl font-bold text-white">{t('home.noHassleNoSignUpsTitle')}</h3>
					<p class="">
						{t('home.noHassleNoSignUpsDescription')}
					</p>
				</div>

				<!-- Feature 5 -->
				<div class="rounded-sm border p-8 text-center">
					<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
						<span class="text-4xl">🛡️</span>
					</div>
					<h3 class="mb-4 text-xl font-bold text-white">{t('home.smartLimitsTitle')}</h3>
					<p class="">
						{t('home.smartLimitsDescription')}
					</p>
				</div>

				<!-- Feature 5 -->
				<div class="rounded-sm border p-8 text-center">
					<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
						<span class="text-4xl">✨</span>
					</div>
					<h3 class="mb-4 text-xl font-bold text-white">{t('home.effortlessSimplicityTitle')}</h3>
					<p class="">
						{t('home.effortlessSimplicityDescription')}
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- How It Works Section -->
	<section class="py-20">
		<div class="container mx-auto px-4">
			<h2 class=" mb-16 text-center text-4xl font-bold">{t('home.howItWorksTitle')}</h2>

			<div class="grid gap-8 md:grid-cols-3">
				<!-- Step 1 -->
				<div class="text-center">
					<h3 class="mb-4 text-xl font-bold text-white">
						<span class="text-violet-400">1.</span>
						{t('home.step1Title')}
					</h3>
					<p class="">
						{t('home.step1Description')}
					</p>
				</div>

				<!-- Step 2 -->
				<div class="text-center">
					<h3 class="mb-4 text-xl font-bold text-white">
						<span class="text-violet-400">2.</span>
						{t('home.step2Title')}
					</h3>
					<p class="">
						{t('home.step2Description')}
					</p>
				</div>

				<!-- Step 3 -->
				<div class="text-center">
					<h3 class="mb-4 text-xl font-bold text-white">
						<span class="text-violet-400">3.</span>
						{t('home.step3Title')}
					</h3>
					<p class="">{t('home.step3Description')}</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-20">
		<div class="container mx-auto px-4 text-center">
			<h2 class="mb-6 text-4xl font-bold text-white">
				{t('home.ctaTitle')}
			</h2>
			<p class="mb-10 text-xl">{t('home.ctaDescription')}</p>
			<button
				on:click={() => goto('/create')}
				class="rounded-sm border-2 border-violet-500 px-8 py-4 font-bold duration-400 hover:scale-110 hover:bg-violet-500/10"
			>
				{t('home.ctaButton')}
			</button>
		</div>
	</section>
</div>
