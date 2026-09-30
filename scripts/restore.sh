#!/bin/bash

set -e

if [ "$#" -ne 2 ]; then
  echo "Uso:"
  echo "./scripts/restore.sh database.dump uploads.tar.gz"
  exit 1
fi

DB_BACKUP="$1"
UPLOADS_BACKUP="$2"

PROJECT_DIR="/home/vga/projects/university-marketplace"

if [ ! -f "$DB_BACKUP" ]; then
  echo "No existe el backup de base: $DB_BACKUP"
  exit 1
fi

if [ ! -f "$UPLOADS_BACKUP" ]; then
  echo "No existe el backup de uploads: $UPLOADS_BACKUP"
  exit 1
fi

echo "Restaurando PostgreSQL..."

docker exec sin-dicato-db \
  psql \
  -U sin_dicato \
  -d postgres \
  -c "DROP DATABASE IF EXISTS sin_dicato;"

docker exec sin-dicato-db \
  psql \
  -U sin_dicato \
  -d postgres \
  -c "CREATE DATABASE sin_dicato OWNER sin_dicato;"

cat "$DB_BACKUP" | docker exec -i sin-dicato-db \
  pg_restore \
  -U sin_dicato \
  -d sin_dicato \
  --no-owner \
  --clean \
  --if-exists

echo "Restaurando imágenes..."

rm -rf "$PROJECT_DIR/uploads"

tar \
  -xzf "$UPLOADS_BACKUP" \
  -C "$PROJECT_DIR"

echo ""
echo "Restauración terminada."
