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

sleep 2 # downtime for db to setup

psql -d postgres -c "CREATE DATABASE $PGNAME;"

flyway migrate  # apply schema changes

# seed test data
for file in migrations/data/*.sql; do
    # Check if there are any SQL files
    if [[ -f $file ]]; then
        echo "Running: $file"
        psql -d $PGNAME -f $file
    else
        echo "No SQL files found in migrations/data"
    fi
done

