#!/bin/bash

readonly PORT=5007
readonly CONTAINER_NAME="achievements-server"
readonly IMAGE_NAME="achievements-server-image"

if [ "$(docker ps -q -a -f name=$CONTAINER_NAME)" ]; then
    echo "Removing existing container..."
    docker rm -vf $CONTAINER_NAME
fi

if [ "$(docker images -q $IMAGE_NAME)" ]; then
    echo "Removing existing image..."
    docker rmi $IMAGE_NAME
fi

echo "Installing dependencies..."
npm install
npm update
echo "Dependencies installed"

# Build with verbose output
echo "Building Docker image..."
docker build --target dev -f Dockerfile -t $IMAGE_NAME . || {
    echo "Docker build failed"
    exit 1
}

# Run container
echo "Starting container..."
docker run -d \
    -p $PORT:$PORT \
    -v $(pwd):/app \
    -v /app/node_modules \
    -e DB_HOST=`route -n | awk '/UG[ \t]/{print $2}'` \
    --name $CONTAINER_NAME $IMAGE_NAME

# Verify container is running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Container started successfully!"
    echo "App should be accessible at http://localhost:$PORT"
else
    echo "Container failed to start"
    docker logs $CONTAINER_NAME
fi