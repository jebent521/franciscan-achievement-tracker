#!/bin/bash

readonly PORT=5007
readonly CONTAINER_NAME="achievements-server"
readonly IMAGE_NAME="express-be/v0"

if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Stopping existing container..."
    docker stop $CONTAINER_NAME
fi

if [ "$(docker images -q $IMAGE_NAME)" ]; then
    echo "Removing existing container & image..."
    docker rm $CONTAINER_NAME && docker rmi $IMAGE_NAME
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
docker build -f Dockerfile -t $IMAGE_NAME . || {
    echo "Docker build failed"
    exit 1
}

# Run container
echo "Starting container..."
docker run -d \
    -p $PORT:$PORT \
    -v $(pwd):/app \
    -v /app/node_modules \
    --name $CONTAINER_NAME $IMAGE_NAME

# Verify container is running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Container started successfully!"
    echo "App should be accessible at http://localhost:$PORT"
else
    echo "Container failed to start"
    docker logs $CONTAINER_NAME
fi