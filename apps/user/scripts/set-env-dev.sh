#!/bin/bash
echo "Current directory: $(pwd)"
export ENV=TESTING
export DATABASE_URL=postgresql://userdb:qwerty123@localhost:5433/postgresdb?schema=public

echo "ENV set to $ENV"
echo "DATABASE_URL set to $DATABASE_URL"

exec "$@"
