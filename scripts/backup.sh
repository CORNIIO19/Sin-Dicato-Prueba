#!/bin/bash

set -e

PROJECT_DIR="/home/vga/projects/university-marketplace"
BACKUP_DIR="/home/vga/backups/sin-dicato"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")

mkdir -p "$BACKUP_DIR"

echo "Creando backup de PostgreSQL..."

docker exec sin-dicato-db \
  pg_dump \
  -U sin_dicato \
  -d sin_dicato \
  -Fc \
  > "$BACKUP_DIR/database_$DATE.dump"

echo "Creando backup de imágenes..."

tar \
  -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" \
  -C "$PROJECT_DIR" \
  uploads

echo ""
echo "Backup terminado:"
echo "$BACKUP_DIR/database_$DATE.dump"
echo "$BACKUP_DIR/uploads_$DATE.tar.gz"
