#!/bin/bash
set -e

SERVER="root@178.104.152.67"
REMOTE_DIR="/opt/magictables"

echo "→ Subiendo archivos..."
rsync -avz \
  --exclude node_modules \
  --exclude dist \
  --exclude data \
  --exclude .git \
  --exclude .env \
  . "$SERVER:$REMOTE_DIR"

echo "→ Arrancando contenedores..."
ssh "$SERVER" "cd $REMOTE_DIR && docker compose -f docker-compose.prod.yml up -d --build"

echo "✓ Deploy completado — http://178.104.152.67"
