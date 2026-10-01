#!/bin/bash

set -e

PROJECT_DIR="/home/vga/projects/university-marketplace"

echo ""
echo "=============================================="
echo "        SIN DICATO - RESET PARA BETA"
echo "=============================================="
echo ""
echo "ESTE PROCESO ELIMINARÁ:"
echo ""
echo "- Todos los negocios"
echo "- Todos los productos"
echo "- Todas las imágenes de productos"
echo ""
echo "SE CONSERVARÁ:"
echo ""
echo "- Categorías"
echo "- Migraciones"
echo "- Configuración"
echo "- Código"
echo ""
echo "Antes de borrar se realizará un backup."
echo ""

read -r -p 'Escribe RESET-BETA para continuar: ' CONFIRMATION

if [ "$CONFIRMATION" != "RESET-BETA" ]; then
  echo ""
  echo "Operación cancelada."
  exit 0
fi

echo ""
echo "1/5 - Creando backup..."

"$PROJECT_DIR/scripts/backup.sh"

echo ""
echo "2/5 - Eliminando negocios y productos..."

docker exec sin-dicato-db \
  psql \
  -U sin_dicato \
  -d sin_dicato \
  -c 'DELETE FROM "Business";'

echo ""
echo "3/5 - Limpiando imágenes..."

mkdir -p "$PROJECT_DIR/uploads/products"

find "$PROJECT_DIR/uploads/products" \
  -type f \
  -name '*.webp' \
  -delete

echo ""
echo "4/5 - Restaurando categorías iniciales..."

cd "$PROJECT_DIR"

npx prisma db seed

echo ""
echo "5/5 - Verificando..."

BUSINESS_COUNT=$(docker exec sin-dicato-db \
  psql \
  -U sin_dicato \
  -d sin_dicato \
  -tAc 'SELECT COUNT(*) FROM "Business";')

PRODUCT_COUNT=$(docker exec sin-dicato-db \
  psql \
  -U sin_dicato \
  -d sin_dicato \
  -tAc 'SELECT COUNT(*) FROM "Product";')

CATEGORY_COUNT=$(docker exec sin-dicato-db \
  psql \
  -U sin_dicato \
  -d sin_dicato \
  -tAc 'SELECT COUNT(*) FROM "Category";')

echo ""
echo "=============================================="
echo "              RESET TERMINADO"
echo "=============================================="
echo ""
echo "Negocios:   $BUSINESS_COUNT"
echo "Productos:  $PRODUCT_COUNT"
echo "Categorías: $CATEGORY_COUNT"
echo ""
echo "Sin Dicato está listo para iniciar la Beta."
echo ""
