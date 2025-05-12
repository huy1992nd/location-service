import { searchServices, addToFavorites, removeFromFavorites, getFavorites } from '../services/searchService';
import { SearchServicesRequest, AddFavoriteRequest, RemoveFavoriteRequest, ListFavoritesRequest } from '../types/favorite.types';
import { prisma, setupTestDatabase, teardownTestDatabase } from './setup';

describe('Service Search', () => {
  beforeAll(async () => {
    // Setup test database
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    // Clean up favorites before each test
    await prisma.favorite.deleteMany({
      where: {
        userId: global.testData.userId
      }
    });
  });

  describe('Search Services', () => {
    it('should return an empty array when no services match', async () => {
      const request: SearchServicesRequest = {
        name: 'nonexistent',
        type: 'type',
        latitude: 0,
        longitude: 0,
        radius: 10
      };
      const result = await searchServices(request);
      expect(result.services).toEqual([]);
    });

    it('should find services within radius', async () => {
      const request: SearchServicesRequest = {
        name: 'Test Supermarket',
        type: 'supermarket',
        latitude: 10.762622,
        longitude: 106.660172,
        radius: 1
      };
      const result = await searchServices(request);
      expect(result.services.length).toBeGreaterThan(0);
      expect(result.services[0].name).toBe('Test Supermarket');
    });

    it('should find services by type only', async () => {
      const request: SearchServicesRequest = {
        name: '',
        type: 'restaurant',
        latitude: 10.762622,
        longitude: 106.660172,
        radius: 1
      };
      const result = await searchServices(request);
      expect(result.services.length).toBeGreaterThan(0);
      expect(result.services[0].type).toBe('restaurant');
    });

    it('should find services by name only', async () => {
      const request: SearchServicesRequest = {
        name: 'Test Restaurant',
        type: '',
        latitude: 10.762622,
        longitude: 106.660172,
        radius: 1
      };
      const result = await searchServices(request);
      expect(result.services.length).toBeGreaterThan(0);
      expect(result.services[0].name).toBe('Test Restaurant');
    });
  });

  describe('Favorites Management', () => {
    it('should add and remove favorites', async () => {
      // Add to favorites
      const addRequest: AddFavoriteRequest = {
        userId: global.testData.userId,
        serviceId: global.testData.serviceId
      };
      await addToFavorites(addRequest);

      const listRequest: ListFavoritesRequest = {
        userId: global.testData.userId
      };
      const favorites = await getFavorites(listRequest);
      expect(favorites.services.length).toBeGreaterThan(0);
      expect(favorites.services[0].id).toBe(global.testData.serviceId);

      // Remove from favorites
      const removeRequest: RemoveFavoriteRequest = {
        userId: global.testData.userId,
        serviceId: global.testData.serviceId
      };
      await removeFromFavorites(removeRequest);
      const updatedFavorites = await getFavorites(listRequest);
      expect(updatedFavorites.services.length).toBe(0);
    });

    it('should handle multiple favorites', async () => {
      // Add first favorite
      await addToFavorites({
        userId: global.testData.userId,
        serviceId: global.testData.serviceId
      });

      // Add second favorite
      await addToFavorites({
        userId: global.testData.userId,
        serviceId: global.testData.service2Id
      });

      const listRequest: ListFavoritesRequest = {
        userId: global.testData.userId
      };
      const favorites = await getFavorites(listRequest);
      expect(favorites.services.length).toBe(2);
      expect(favorites.services.map(s => s.id)).toContain(global.testData.serviceId);
      expect(favorites.services.map(s => s.id)).toContain(global.testData.service2Id);
    });

    it('should throw error when adding favorite for non-existent user', async () => {
      const nonExistentUserId = 99999;
      const request: AddFavoriteRequest = {
        userId: nonExistentUserId,
        serviceId: global.testData.serviceId
      };
      await expect(addToFavorites(request))
        .rejects
        .toThrow('User not found');
    });

    it('should throw error when adding non-existent service to favorites', async () => {
      const nonExistentServiceId = 99999;
      const request: AddFavoriteRequest = {
        userId: global.testData.userId,
        serviceId: nonExistentServiceId
      };
      await expect(addToFavorites(request))
        .rejects
        .toThrow('Service not found');
    });

    it('should throw error when adding duplicate favorite', async () => {
      // First add the favorite
      const request: AddFavoriteRequest = {
        userId: global.testData.userId,
        serviceId: global.testData.serviceId
      };
      await addToFavorites(request);

      // Try to add the same favorite again
      await expect(addToFavorites(request))
        .rejects
        .toThrow('Service is already in favorites');
    });
  });
}); 