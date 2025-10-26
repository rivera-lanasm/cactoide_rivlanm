# Cactoide(ae) 🌵

Events that thrive anywhere.

Like the cactus, great events bloom under any condition when managed with care. Cactoide(ae) helps you streamline RSVPs, simplify coordination, and keep every detail efficient—so your gatherings are resilient, vibrant, and unforgettable.

<p align="center">
  <a href="https://cactoide.dalev.hu/" target="blank">
    <picture>
      <img alt="actoide" src="https://github.com/user-attachments/assets/30b87181-1e3b-49d0-869e-bef6dcf7f777" width="840">
    </picture>
  </a>
</p>

#### What is it?

A mobile-first event RSVP platform that lets you create events, share unique URLs, and collect RSVPs without any registration required.

### ✨ Features

- **🎯 Instant Event Creation** - Create events in seconds with our streamlined form. No accounts, no waiting, just pure efficiency.
- **🔗 One-Click Sharing** - Each event gets a unique, memorable URL. Share instantly via any platform or messaging app.
- **🔍 All-in-One Clarity** - No more scrolling through endless chats and reactions. See everyone's availability and responses neatly in one place.
- **📅 iCal Integration** - One-tap add-to-calendar via ICS/webcal links. Works with Apple Calendar, Google Calendar, and Outlook, with automatic time zone handling.
- **👤 No Hassle, No Sign-Ups** - Skip registrations and endless forms. Unlike other event platforms, you create and share instantly — no accounts, no barriers.
- **🛡️ Smart Limits** - Choose between unlimited RSVPs or set a limited capacity. Perfect for any event size.
- **✨ Effortless Simplicity** - Designed to be instantly clear and easy. No learning curve — just open, create, and go.

### Quick Start

#### Requirements

`git`, `docker`, `docker-compose`, `node` at least suggested 20.19.0

Uses the [`docker-compose.yml`](docker-compose.yml) file to setup the application with the database. You can define all ENV variables in the [`.env`](.env.example) file from the `.env.example`.

```bash
git clone https://github.com/polaroi8d/cactoide/
cd cactoide
cp .env.docker.example .env
docker compose up -d
```

### Development

```bash
git clone https://github.com/polaroi8d/cactoide/
cd cactoide
cp .env.example .env
make db-only
npm run dev -- --open
```

Your app will be available at `http://localhost:5173`. You can use the Makefile commands to run the application or the database, eg.: `make db-only`.

Use the `database/seed.sql` if you want to populate your database with dummy data.

### Options

#### 1. Landing page option

Supports a conditional landing page display based on the `PUBLIC_LANDING_INFO` environment variable. If you don't want to show your users the cactoide landing page, just use the `PUBLIC_LANDING_INFO=false` variable. This will automatically remove the landing home page and redirect users to the `/discover` page.

This is useful for:

- Creating a minimal discovery-focused experience
- Customizing the user journey based on deployment environment

#### 2. i18n

There is no proper i18n implemented, we have an `/i18n` folder with specific languages. To use an existing translation, just rename the language code JSON file to `messages.json` and you are ready to go. If you would like to add a new translation (which is really appreciated), just create a new `<language_code>.json` file and add the translations from the `messages.json`.

The project includes a translation validation script to ensure all translation files are complete and up-to-date with the source `messages.json` file.

```bash
# Validate all translation files
make i18n
```

```bash
# Validate a specific translation file
make i18n FILE=src/lib/i18n/it.json
```

### Support

Cactoide is an open-source project licensed under `AGPL-3.0`. Its growth and development are possible thanks to the amazing support of the community. This project is the result of many late nights, weekends, and after-hours work.

It isn’t backed by a big company. Development depends on the support and generosity of people like you. With your help, I can focus more on making Cactoide even better and building tools that make coding more enjoyable.

You can support in a few ways:

- Send a one-time donation via [paypal.me/zenoazurben](paypal.me/zenoazurben)
- Reach me directly: leventeorb[@]gmail.com

If you enjoy using Cactoide, or if your business depends on it, please consider sponsoring its development. Your support keeps the project alive, improves it for everyone, and helps create educational content like blog posts and videos for the whole Cactoide community.

### License

This project is licensed under the `AGPL-3.0 License` - see the [LICENSE](./LICENSE) file for details.

**Made with ❤️ by @polaroi8d**
