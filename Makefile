.PHONY: help build up db-only logs db-clean prune i18n lint format

# Default target
help:
	@echo "Cactoide Commands"
	@echo ""
	@echo "Main commands:"
	@echo "  make build    - Build the Docker images"
	@echo "  make up       - Start all services (database + app)"
	@echo ""
	@echo "Individual services:"
	@echo "  make db-only  - Start only the database"
	@echo ""
	@echo "Utility commands:"
	@echo "  make logs     - Show logs from all services"
	@echo "  make db-clean  - Stop & remove database container"
	@echo "  make prune    - Remove all containers, images, and volumes"
	@echo "  make i18n - Validate translation files against messages.json"
	@echo "  make help     - Show this help message"

# Build the Docker images
build:
	@echo "Building Docker images..."
	docker compose build

# Start all services
up:
	@echo "Starting all services..."
	docker compose up -d

# Start only the database
db-only:
	@echo "Starting only the database..."
	docker compose up -d postgres

# Show logs from all services
logs:
	@echo "Showing logs from all services..."
	docker compose logs -f

db-clean:
	@echo "Cleaning up all Docker resources..."
	docker stop cactoide-db && docker rm cactoide-db && docker volume prune -f && docker network prune -f

# Clean up everything (containers, images, volumes)
prune:
	@echo "Cleaning up all Docker resources..."
	docker compose down -v --rmi all

# Validate translation files
i18n:
	@echo "Validating translation files..."
	@if [ -n "$(FILE)" ]; then \
		./scripts/i18n-check.sh $(FILE); \
	else \
		./scripts/i18n-check.sh; \
	fi

lint:
	@echo "Linting the project..."
	npm run lint

format:
	@echo "Formatting the project..."
	npm run format


