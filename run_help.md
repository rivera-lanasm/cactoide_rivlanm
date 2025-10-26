# Running Cactoide on WSL2

## Quick Start (Automated)

**One-command startup:**
```bash
chmod +x startup-wsl2.sh && ./startup-wsl2.sh
```

This script will:
1. Check/create `.env` file
2. Stop native PostgreSQL if running on port 5432
3. Start PostgreSQL container
4. Apply database schema if needed
5. Start dev server at http://localhost:5173

---

## Manual Setup

### Prerequisites
- Docker Desktop with WSL2 backend
- Node.js 18+
- Run from WSL2 terminal in `/home/` directory (NOT `/mnt/c/`)

**Verify environment:**
```bash
uname -r                    # Should show WSL2
node --version              # Should be v18+
docker --version            # Should show version
docker ps                   # Should list containers (start Docker Desktop if error)
make --version              # Install: sudo apt install build-essential
```

### First-Time Setup

```bash
npm install
cp .env.example .env
# Verify DATABASE_URL uses localhost:5432 (not postgres:5432)
make db-only
npx drizzle-kit push
npm run dev
```

**Access:** http://localhost:5173

### Daily Workflow

```bash
make db-only        # Start database
npm run dev         # Start dev server
```

---

## Common Commands

| Command | Description |
|---------|-------------|
| `./startup-wsl2.sh` | Automated startup (recommended) |
| `make db-only` | Start PostgreSQL container |
| `npm run dev` | Start dev server (port 5173) |
| `npx drizzle-kit push` | Apply schema changes |
| `docker ps` | List running containers |
| `make db-clean` | Remove database container + volumes |

---

## Troubleshooting Reference

### Port 5432 Conflict

**Error:** `failed to bind host port for 0.0.0.0:5432`

**Cause:** Native PostgreSQL running

**Fix:**
```bash
sudo service postgresql stop
sudo systemctl disable postgresql  # Prevent auto-start
make db-only
```

**Verify:**
```bash
docker ps | grep cactoide-db       # Should show "Up"
sudo lsof -i :5432                 # Should show Docker container
```

### Database Connection Failed

```bash
docker ps | grep cactoide-db                                           # Check running
docker compose exec postgres pg_isready -U cactoide -d cactoide_database  # Check health
docker restart cactoide-db                                             # Restart
```

### Drizzle Kit Errors

**"Cannot find module 'dotenv'"**
```bash
npm install --save-dev dotenv
```

**Schema not applied:**
```bash
npx drizzle-kit push
```

**Expected output:**
```
Reading config file 'drizzle.config.ts'
[✓] Pulling schema from database...
[✓] Changes applied
```

### Dev Server Issues

**Port 5173 in use:**
```bash
lsof -i :5173            # Find process
kill -9 <PID>            # Kill it
npm run dev              # Restart
```

---

## Environment Configuration

**`.env` for local development (WSL2):**
```bash
DATABASE_URL="postgres://cactoide:cactoide_password@localhost:5432/cactoide_database"
POSTGRES_DB=cactoide_database
POSTGRES_USER=cactoide
POSTGRES_PASSWORD=cactoide_password
POSTGRES_PORT=5432
PUBLIC_LANDING_INFO=true
```

**Key:** Use `localhost:5432` for local dev, `postgres:5432` only for full Docker stack

---

## WSL2 Tips

- Keep project in `/home/` (NOT `/mnt/c/`) for better performance
- `localhost` works for WSL2 ↔ Docker communication
- Vite hot-reload works seamlessly on WSL2
