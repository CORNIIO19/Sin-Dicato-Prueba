import { prisma } from "@/lib/prisma";

export default async function TestDbPage() {
  const businessCount = await prisma.business.count();
  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Prueba de base de datos</h1>

      <div className="mt-6 space-y-2">
        <p>Negocios: {businessCount}</p>
        <p>Productos: {productCount}</p>
        <p>Categorías: {categoryCount}</p>
      </div>
    </main>
  );
}
