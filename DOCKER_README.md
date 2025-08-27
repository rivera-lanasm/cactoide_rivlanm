# Docker Setup for Cactoide

This document explains how to run the Cactoide application using Docker containers.

## Prerequisites

- Docker installed on your system
- Docker Compose installed
- Make (optional, but recommended for easier management)

## Quick Start

### 1. Build and Start Everything

```bash
# Build images and start all services
make build-and-up

# Or manually:
docker-compose up -d --build
```

### 2. Access the Application

- **Application**: http://localhost:3000
- **Database**: localhost:5432

## Available Commands

### Using Make (Recommended)

```bash
# Show all available commands
make help

# Start all services
make up

# Stop all services
make down

# Restart all services
make restart

# View logs
make logs

# Check status
make status

# Clean up everything
make clean
```

### Using Docker Compose Directly

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

## Development Mode

For development with hot reloading:

```bash
# Start development environment
make dev

# Or manually:
docker-compose -f docker-compose.dev.yml up
```

Development mode runs on port **5173** with hot reloading enabled.

## Individual Services

### Start Only Database

```bash
make db-only
```

### Start Only Application (requires database to be running)

```bash
make app-only
```

## Database Management

### Access Database Shell

```bash
make db-shell
```

### Database Initialization

The database is automatically initialized with the schema from `database/init.sql` when the container starts for the first time.

### Persistent Data

Database data is stored in a Docker volume (`postgres_data`) and persists between container restarts.

## Environment Variables

The following environment variables are automatically set in the containers:

- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment mode (production/development)
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password

## Ports

- **3000**: Production application
- **5173**: Development application (with hot reloading)
- **5432**: PostgreSQL database

## Troubleshooting

### Check Service Status

```bash
make status
```

### View Logs

```bash
# All services
make logs

# Specific service
make logs-app
make logs-db
```

### Restart Services

```bash
make restart
```

### Clean Start

```bash
make clean
make build-and-up
```

### Database Connection Issues

1. Ensure the database container is healthy:

   ```bash
   docker-compose ps postgres
   ```

2. Check database logs:

   ```bash
   make logs-db
   ```

3. Verify environment variables:
   ```bash
   docker-compose exec app env | grep DATABASE
   ```

## File Structure

```
.
├── Dockerfile              # Production application image
├── Dockerfile.dev          # Development application image
├── docker-compose.yml      # Production services
├── docker-compose.dev.yml  # Development services
├── Makefile               # Management commands
├── .dockerignore          # Docker build exclusions
└── database/
    └── init.sql           # Database initialization script
```

## Production Deployment

For production deployment, use the production compose file:

```bash
docker-compose up -d
```

The production setup:

- Runs the built SvelteKit application
- Uses optimized Node.js production image
- Includes health checks and restart policies
- Runs on port 3000

## Development Workflow

1. **Start development environment**: `make dev`
2. **Make code changes** - they will automatically reload
3. **Test your changes** in the browser
4. **Stop development**: `Ctrl+C` or `make down`
5. **Build for production**: `make build`
6. **Deploy**: `make up`
