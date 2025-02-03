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

# Check for node modules
if [ ! -d "node_modules" ]; then
    echo "Node modules not found. Installing..."
    npm i express
    sudo npm install nodemon --save-dev
else
    echo "Node modules found. Skipping installation."
fi

# Build with verbose output
echo "Building Docker image..."
docker build -f dockerfile.dev -t express-docker-dev . || {
    echo "Docker build failed"
    exit 1
}

# Run container with network
echo "Starting container..."
docker run -d \
    -p $PORT:$PORT \
    -v $(pwd):/app \
    -v /app/node_modules \
    --name express-docker-dev express-be/v0

# Verify container is running
if [ "$(docker ps -q -f name=express-docker-dev)" ]; then
    echo "Container started successfully!"
    echo "App should be accessible at http://localhost:"
else
    echo "Container failed to start"
    docker logs express-docker-dev
fi