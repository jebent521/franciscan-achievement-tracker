#!/bin/bash

set -e  # exit on errors

export PGHOST='localhost'
export PGPORT=5432
export PGUSER='postgres'
export PGPASSWORD='franny_devs'
export PGNAME='achievements_db'

docker run --name achievements-db -p $PGPORT:$PGPORT -e POSTGRES_USER=$PGUSER -e POSTGRES_PASSWORD=$PGPASSWORD -d postgres

sleep 2 # downtime for db to setup

psql -d postgres -c "CREATE DATABASE $PGNAME;"

flyway -user=$PGUSER -password=$PGPASSWORD -url=jdbc:postgresql://$PGHOST:$PGPORT/$PGNAME migrate
