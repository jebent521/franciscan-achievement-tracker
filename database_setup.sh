#!/bin/bash

set -e  # exit on errors

export PGHOST='localhost'
export PGPORT=5432
export PGUSER='postgres'
export PGPASSWORD='franny_devs'

docker run --name achievements-db -p $PGPORT:$PGPORT -e POSTGRES_USER=$PGUSER -e POSTGRES_PASSWORD=$PGPASSWORD -d postgres

sleep 1 # downtime for db to setup

psql -d postgres -c "CREATE DATABASE achievements_db;"
psql -d achievements_db -f ./migrations/0001_create_tables.sql
psql -d achievements_db -f ./migrations/0002_insert_sample_data.sql