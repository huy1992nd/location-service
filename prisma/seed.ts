import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      name: 'User One',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      name: 'User Two',
    },
  });

  // Create sample services
  const services = [
    {
      name: 'Winmart',
      type: 'supermarket',
      latitude: 10.762622,
      longitude: 106.660172,
      address: '123 Nguyen Hue Street, District 1, HCMC',
    },
    {
      name: 'Circle K',
      type: 'convenience store',
      latitude: 10.775658,
      longitude: 106.700423,
      address: '456 Le Loi Street, District 1, HCMC',
    },
    {
      name: 'Shell Gas Station',
      type: 'gas station',
      latitude: 10.782345,
      longitude: 106.695678,
      address: '789 Vo Van Tan Street, District 3, HCMC',
    },
    {
      name: 'The Coffee House',
      type: 'cafe',
      latitude: 10.776543,
      longitude: 106.701234,
      address: '321 Dong Khoi Street, District 1, HCMC',
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: {
        name_address: {
          name: service.name,
          address: service.address,
        },
      },
      update: {},
      create: service,
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 