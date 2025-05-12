import { PrismaClient } from '@prisma/client';
import { searchServices, addToFavorites, removeFromFavorites, getFavorites } from '../services/serviceService';

const prisma = new PrismaClient();

describe('Service Search', () => {
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

    const service = await prisma.service.create({
      data: {
        name: 'Test Store',
        type: 'supermarket',
        latitude: 10.762622,
        longitude: 106.660172,
        address: 'Test Address',
      },
    });

    await prisma.favorite.create({
      data: {
        userId: user.id,
        serviceId: service.id,
      },
    });
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
    const user = await prisma.user.findFirst();
    const service = await prisma.service.findFirst();

    if (user && service) {
      await addToFavorites(user.id, service.id);
      const favorites = await getFavorites(user.id);
      expect(favorites.length).toBeGreaterThan(0);

      await removeFromFavorites(user.id, service.id);
      const updatedFavorites = await getFavorites(user.id);
      expect(updatedFavorites.length).toBe(0);
    }
  });
}); 