# Makefile for Bible Search Project Web

# Variables
IMAGE_NAME :=  ghcr.io/bsp-org/web
IMAGE_TAG := latest
REMOTE_HOST := bible.techaddo.com

# Build the Docker image
.PHONY: build
build:
	docker build --build-arg VITE_API_BASE_URL=$(API_BASE_URL) -t $(IMAGE_NAME):$(IMAGE_TAG) .

# Full deployment workflow (build, push to app user, and run)
.PHONY: deploy
deploy:
	@echo "Image pushed to remote server. Restarting...."
	ssh $(REMOTE_HOST) 'sudo su - app -c "cd /www/app && export WEB_TAG=$(IMAGE_TAG) && podman-compose pull && podman-compose up -d web"'



# Show help
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make build              - Build Docker image locally"
	@echo "  make deploy             - Build and push to remote (app user)"
	@echo ""
	@echo "Variables (can be overridden):"
	@echo "  IMAGE_NAME=$(IMAGE_NAME)"
	@echo "  IMAGE_TAG=$(IMAGE_TAG)"
