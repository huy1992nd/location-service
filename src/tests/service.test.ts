import { PrismaClient } from '@prisma/client';
import { searchServices, addToFavorites, removeFromFavorites, getFavorites } from '../services/serviceService';

const prisma = new PrismaClient();

describe('Service Search', () => {
  let testUserId: number;
  let testServiceId: number;

  beforeAll(async () => {
    // Clean up database before tests
    await prisma.favorite.deleteMany();
    await prisma.service.deleteMany();
    await prisma.user.deleteMany();

    // Create test data
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    });
    testUserId = user.id;

    const service = await prisma.service.create({
      data: {
        name: 'Test Store',
        type: 'supermarket',
        latitude: 10.762622,
        longitude: 106.660172,
        address: 'Test Address',
      },
    });
    testServiceId = service.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return an empty array when no services match', async () => {
    const result = await searchServices('nonexistent', 'type', 0, 0, 10);
    expect(result).toEqual([]);
  });

  it('should find services within radius', async () => {
    const result = await searchServices('Test Store', 'supermarket', 10.762622, 106.660172, 1);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].name).toBe('Test Store');
  });

  it('should add and remove favorites', async () => {
    // First remove any existing favorites
    await prisma.favorite.deleteMany({
      where: {
        userId: testUserId,
        serviceId: testServiceId,
      },
    });

    // Add to favorites
    await addToFavorites(testUserId, testServiceId);
    const favorites = await getFavorites(testUserId);
    expect(favorites.length).toBeGreaterThan(0);
    expect(favorites[0].id).toBe(testServiceId);

    // Remove from favorites
    await removeFromFavorites(testUserId, testServiceId);
    const updatedFavorites = await getFavorites(testUserId);
    expect(updatedFavorites.length).toBe(0);
  });
}); 