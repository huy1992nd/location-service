import { PrismaClient, Prisma } from '@prisma/client';

// Use main database for tests
const prisma = new PrismaClient();

// Store original data for rollback
let originalData: {
  favorites: any[];
  services: any[];
  users: any[];
} = {
  favorites: [],
  services: [],
  users: []
};

export const setupTestDatabase = async () => {
  try {
    // Store original data
    originalData = {
      favorites: await prisma.favorite.findMany(),
      services: await prisma.service.findMany(),
      users: await prisma.user.findMany()
    };

    // Start a transaction
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Clean up any existing test data first
      await tx.favorite.deleteMany({
        where: {
          OR: [
            { user: { email: 'test@example.com' } },
            { service: { name: { in: ['Test Supermarket', 'Test Restaurant'] } } }
          ]
        }
      });
      await tx.service.deleteMany({
        where: {
          name: { in: ['Test Supermarket', 'Test Restaurant'] }
        }
      });
      await tx.user.deleteMany({
        where: {
          email: 'test@example.com'
        }
      });

      // Create test data within transaction
      const user = await tx.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
        },
      });

      const service = await tx.service.create({
        data: {
          name: 'Test Supermarket',
          type: 'supermarket',
          latitude: 10.762622,
          longitude: 106.660172,
          address: '123 Test Street',
        },
      });

      const service2 = await tx.service.create({
        data: {
          name: 'Test Restaurant',
          type: 'restaurant',
          latitude: 10.762622,
          longitude: 106.660172,
          address: '456 Test Avenue',
        },
      });

      // Store test data IDs for use in tests
      global.testData = {
        userId: user.id,
        serviceId: service.id,
        service2Id: service2.id
      };
    });
  } catch (error) {
    console.error('Error setting up test data:', error);
    throw error;
  }
};

export const teardownTestDatabase = async () => {
  try {
    // Rollback changes by restoring original data
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Delete test data
      await tx.favorite.deleteMany({
        where: {
          OR: [
            { user: { email: 'test@example.com' } },
            { service: { name: { in: ['Test Supermarket', 'Test Restaurant'] } } }
          ]
        }
      });
      await tx.service.deleteMany({
        where: {
          name: { in: ['Test Supermarket', 'Test Restaurant'] }
        }
      });
      await tx.user.deleteMany({
        where: {
          email: 'test@example.com'
        }
      });
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error cleaning up test data:', error);
    throw error;
  }
};

// Add type definition for global test data
declare global {
  var testData: {
    userId: number;
    serviceId: number;
    service2Id: number;
  };
}

export { prisma }; 