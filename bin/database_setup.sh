#!/bin/bash

set -e  # exit on errors

readonly CONTAINER_NAME="achievements-db"

export PGHOST='localhost'
export PGPORT=5432
export PGUSER='postgres'
export PGPASSWORD='franny_devs'
export PGNAME='achievements_db'

if [ "$(docker ps -q -a -f name=$CONTAINER_NAME)" ]; then
    echo "Removing existing container..."
    docker rm -vf $CONTAINER_NAME
fi

docker run --name $CONTAINER_NAME \
    -p $PGPORT:$PGPORT \
    -e POSTGRES_USER=$PGUSER \
    -e POSTGRES_PASSWORD=$PGPASSWORD \
    -d postgres

echo "Waiting for PostgreSQL to be ready..."
until PGPASSWORD=$PGPASSWORD pg_isready -h $PGHOST -p $PGPORT -U $PGUSER; do
    sleep 1
done
echo "PostgreSQL is ready!"

psql -d postgres -c "CREATE DATABASE $PGNAME;"

if [ "$ENV" == "dev" ]; then
    flyway -configFiles=flyway.dev.conf migrate
else
    flyway -configFiles=flyway.prod.conf migrate
fi
