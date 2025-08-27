# Cactoide(ae) 🌵

Events that thrive anywhere.

Like the cactus, great events bloom under any condition when managed with care. Cactoide(ae) helps you streamline RSVPs, simplify coordination, and keep every detail efficient—so your gatherings are resilient, vibrant, and unforgettable.

#### What is it?

A mobile-first event RSVP platform that lets you create events, share unique URLs, and collect RSVPs without any registration required.

### ✨ Features

- **🎯 Instant Event Creation** - Create events in seconds with our streamlined form. No accounts, no waiting, just pure efficiency.
- **🔗 One-Click Sharing** - Each event gets a unique, memorable URL. Share instantly via any platform or messaging app.
- **🔍 All-in-One Clarity** - No more scrolling through endless chats and reactions. See everyone's availability and responses neatly in one place.
- **👤 No Hassle, No Sign-Ups** - Skip registrations and endless forms. Unlike other event platforms, you create and share instantly — no accounts, no barriers.
- **🛡️ Smart Limits** - Choose between unlimited RSVPs or set a limited capacity. Perfect for any event size.
- **✨ Effortless Simplicity** - Designed to be instantly clear and easy. No learning curve — just open, create, and go.

### 🏗️ Technology

- **SvelteKit** - Full-stack web framework
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Robust relational database
- **Drizzle ORM** - Type-safe database queries

### 🚀 Quick Start

```bash
git clone <your-repo-url>
cd cactoide
npm install
cp env.example .env
make db-only
npm run dev -- --open
```

Your app will be available at `http://localhost:5173`

### 🚀 Self-Host

#### Using GitHub Container Registry (GHCR)

The application is automatically built and pushed to GitHub Container Registry on every push to main/master branch.

```bash
# Pull the latest image
docker pull ghcr.io/${{ github.repository }}/cactoide:latest

# Or use a specific tag
docker pull ghcr.io/${{ github.repository }}/cactoide:main-abc1234

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  ghcr.io/${{ github.repository }}/cactoide:latest
```

#### Using Docker Compose with GHCR

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    image: ghcr.io/${{ github.repository }}/cactoide:latest
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=your-production-database-url
      - NODE_ENV=production
    restart: unless-stopped
```

#### Available Tags

- `latest` - Latest commit on main branch
- `main-<sha>` - Specific commit on main branch
- `v1.0.0` - Semantic version tags
- `1.0` - Major.minor version tags

### 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

**Made with ❤️ by @polaroi8d**
