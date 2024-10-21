#!/bin/bash
export ENV=TESTING
export DATABASE_URL=mongodb://localhost:27017
exec "$@"
