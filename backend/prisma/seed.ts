import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Sueldo', type: 'income' },
    { name: 'Venta', type: 'income' },
    { name: 'Inversiones', type: 'income' },
    { name: 'Otros Ingresos', type: 'income' },
    { name: 'Vivienda', type: 'expense' },
    { name: 'Alimentación', type: 'expense' },
    { name: 'Transporte', type: 'expense' },
    { name: 'Entretenimiento', type: 'expense' },
    { name: 'Salud', type: 'expense' },
    { name: 'Educación', type: 'expense' },
    { name: 'Tecnología', type: 'expense' },
    { name: 'Otros Gastos', type: 'expense' },
  ];

  console.log('Seeding categories...');

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: 0 }, // This is a trick to always upsert if name doesn't exist uniquely, but Category doesn't have unique name yet
      update: {},
      create: cat,
    });
  }
  
  // Since Category name isn't unique in schema yet, let's just create if count is 0
  const count = await prisma.category.count();
  if (count === 0) {
    await prisma.category.createMany({
      data: categories
    });
  }

  console.log('Seed finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
