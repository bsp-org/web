# Makefile for Bible Search Project Web

# Variables
IMAGE_NAME := bsp_web
IMAGE_TAG := 1
REMOTE_HOST := bible.techaddo.com
REMOTE_USER_ROOT := root
API_BASE_URL := https://bible.techaddo.com
REMOTE_PORT := 80
LOCAL_PORT := 8080

# Build the Docker image
.PHONY: build
build:
	docker build --build-arg VITE_API_BASE_URL=$(API_BASE_URL) -t $(IMAGE_NAME):$(IMAGE_TAG) .

# Run the container locally
.PHONY: run-local
run-local:
	docker run -d -p $(LOCAL_PORT):8080 --name $(IMAGE_NAME) $(IMAGE_NAME):$(IMAGE_TAG)

# Stop and remove local container
.PHONY: stop-local
stop-local:
	docker stop $(IMAGE_NAME) || true
	docker rm $(IMAGE_NAME) || true

# Transfer image to remote server (app user with rootless Podman)
.PHONY: push-app
push-app:
	docker save $(IMAGE_NAME):$(IMAGE_TAG) | gzip | ssh $(REMOTE_HOST) 'gunzip | su - app -c "podman load"'

# Full deployment workflow (build, push to app user, and run)
.PHONY: deploy
deploy: build push-app
	@echo "Image pushed to remote server. Restarting...."
	ssh $(REMOTE_HOST) 'su - app -c "cd /www/app && podman-compose up -d web"'


# Clean local Docker artifacts
.PHONY: clean
clean: stop-local
	docker rmi $(IMAGE_NAME):$(IMAGE_TAG) || true
	#
# Show help
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make build              - Build Docker image locally"
	@echo "  make run-local          - Run container locally on port $(LOCAL_PORT)"
	@echo "  make stop-local         - Stop and remove local container"
	@echo "  make push-app           - Push image to remote server (app user)"
	@echo "  make deploy             - Build and push to remote (app user)"
	@echo "  make clean              - Remove local Docker image and container"
	@echo ""
	@echo "Variables (can be overridden):"
	@echo "  IMAGE_NAME=$(IMAGE_NAME)"
	@echo "  IMAGE_TAG=$(IMAGE_TAG)"
	@echo "  API_BASE_URL=$(API_BASE_URL)"
	@echo "  REMOTE_HOST=$(REMOTE_HOST)"
	@echo "  REMOTE_PORT=$(REMOTE_PORT)"
