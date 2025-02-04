#!/bin/bash

readonly PORT=5007

if [ "$(docker ps -q -f name=achievements-server)" ]; then
    echo "Stopping existing container..."
    docker stop achievements-server
fi

if [ "$(docker images -q express-be/v0)" ]; then
    echo "Removing existing container & image..."
    docker rm achievements-server && docker rmi express-be/v0
fi

# Check for node modules
if [ ! -d "node_modules" ]; then
    echo "Node modules not found. Installing..."
    npm i express
    npm install nodemon --save-dev
else
    echo "Node modules found. Skipping installation."
fi

# Build with verbose output
echo "Building Docker image..."
docker build -f dockerfile.dev -t express-be/v0 . || {
    echo "Docker build failed"
    exit 1
}

# Run container
echo "Starting container..."
docker run -d \
    -p $PORT:$PORT \
    -v $(pwd):/app \
    -v /app/node_modules \
    --name achievements-server express-be/v0

# Verify container is running
if [ "$(docker ps -q -f name=achievements-server)" ]; then
    echo "Container started successfully!"
    echo "App should be accessible at http://localhost:$PORT"
else
    echo "Container failed to start"
    docker logs achievements-server
fi