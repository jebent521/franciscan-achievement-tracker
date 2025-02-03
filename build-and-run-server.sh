#!/bin/bash

readonly PORT=5007

if [ "$(docker ps -q -f name=express-docker-dev)" ]; then
    echo "Stopping existing container..."
    docker stop express-docker-dev
fi

if [ "$(docker images -q express-docker-dev)" ]; then
    echo "Removing existing container & image..."
    docker stop express-docker-dev && docker rm express-docker-dev && docker rmi express-docker-dev
fi

# Build with verbose output
echo "Building Docker image..."
docker build -f dockerfile.dev -t express-docker-dev . || {
    echo "Docker build failed"
    exit 1
}

# Run container
echo "Starting container..."
docker run -d \
    -p $PORT:$PORT \
    -v $(pwd):/app \
    --name express-docker-dev express-be/v0

# Verify container is running
if [ "$(docker ps -q -f name=express-docker-dev)" ]; then
    echo "Container started successfully!"
    echo "App should be accessible at http://localhost:$PORT"
else
    echo "Container failed to start"
    docker logs express-docker-dev
fi