#!/bin/sh
DATA_DIR=/data node /api/index.js &
nginx -g 'daemon off;'
