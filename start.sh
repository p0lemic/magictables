#!/bin/sh
# Start API
export DATA_DIR=/data
node /api/index.js &

# Wait for API to be ready before nginx starts
sleep 2

# Start nginx in foreground (keeps container alive)
exec nginx -g 'daemon off;'
