#!/bin/bash

docker build -f ./express-docker/dockerfile.dev -t express-be/v0 ./express-docker

docker run -d -it --rm -p 5007:5007 --name express-docker-dev express-be/v0
