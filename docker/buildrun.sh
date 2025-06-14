#!/bin/bash
# This script starts the development environment.

# Exit immediately if a command exits with a non-zero status.
set -e

# Navigate to the directory where docker-compose.yml is located
cd "$(dirname "$0")/.."

# accelerate build
export COMPOSE_BAKE=true

# Start the services in the background
docker compose -f docker/docker-compose.yml up -d --build

# Tail the logs of the services
docker compose -f docker/docker-compose.yml logs -f
