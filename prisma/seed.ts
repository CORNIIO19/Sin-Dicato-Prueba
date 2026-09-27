import "dotenv/config";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está definida");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const categories = [
  {
    name: "Comida preparada",
    slug: "comida-preparada",
  },
  {
    name: "Bebidas",
    slug: "bebidas",
  },
  {
    name: "Snacks y dulces",
    slug: "snacks-dulces",
  },
  {
    name: "Ropa y accesorios",
    slug: "ropa-accesorios",
  },
  {
    name: "Arte y papelería",
    slug: "arte-papeleria",
  },
  {
    name: "Servicios digitales",
    slug: "servicios-digitales",
  },
  {
    name: "Otros",
    slug: "otros",
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
      },
      create: category,
    });
  }

  console.log("Categorías iniciales creadas.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);

    await prisma.$disconnect();
    await pool.end();

    process.exit(1);
  });
