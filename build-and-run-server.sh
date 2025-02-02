#!/bin/bash

#checks if node modules exist
if [ ! -d "node_modules" ]; then
    echo "Node modules not found. Installing..."
  npm i express
else
    echo "Node modules found. Skipping installation."
fi

docker build -f dockerfile.dev -t express-be/v0 .

docker run -d -it --rm -p 5007:5007 --name express-docker-dev express-be/v0
