#!/bin/bash

set -e  # exit on errors

readonly CONTAINER_NAME="achievements-db"

export PGHOST='localhost'
export PGPORT=5432
export PGUSER='postgres'
export PGPASSWORD='franny_devs'
export PGNAME='achievements_db'

while [[ $# -gt 0 ]]; do
  case $1 in
    (-d|--dev)
      ENV=dev
      shift
      ;;
    (-p|--prod)
      ENV=prod
      shift
      ;;
    (-h|--help)
      help
      ;;
    (-*|--*|*)
      echo "Unknown option $1"
      help
      ;;
  esac
done

if [ "$(docker ps -q -a -f name=$CONTAINER_NAME)" ]; then
    echo "🗑️  Removing existing container..."
    docker rm -vf $CONTAINER_NAME
fi

echo "🐘 Starting PostgreSQL container..."
docker run --name $CONTAINER_NAME \
    -p $PGPORT:$PGPORT \
    -e POSTGRES_USER=$PGUSER \
    -e POSTGRES_PASSWORD=$PGPASSWORD \
    -d postgres

echo "🔴 Waiting for PostgreSQL to be ready..."
until PGPASSWORD=$PGPASSWORD pg_isready -h $PGHOST -p $PGPORT -U $PGUSER; do
    sleep 1
done
echo "🟢 PostgreSQL is ready!"

psql -d postgres -c "CREATE DATABASE $PGNAME;"

if [ $ENV == "prod" ]; then
    echo "🚀 Creating production database..."
    flyway -configFiles=flyway.prod.conf migrate
else
    echo "🛠️  Creating development database..."
    flyway -configFiles=flyway.dev.conf migrate
fi

help () {
    echo "Usage: $0 [-d|--dev] [-p|--prod]"
    echo "Options:"
    echo "  -d, --dev    Set up development database [default]"
    echo "  -p, --prod   Set up production database [can also be run with ENV=prod]"
    echo "  -h, --help   Display this help message and exit."
    exit 1
}