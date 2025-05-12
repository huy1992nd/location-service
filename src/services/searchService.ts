import { PrismaClient } from '@prisma/client';
import { Service } from '../models/Service';
import { 
  AddFavoriteRequest, 
  RemoveFavoriteRequest, 
  ListFavoritesRequest,
  AddFavoriteResponse,
  RemoveFavoriteResponse,
  ListFavoritesResponse,
  SearchServicesRequest,
  SearchServicesResponse
} from '../types/favorite.types';

const prisma = new PrismaClient();

export const searchServices = async (request: SearchServicesRequest): Promise<SearchServicesResponse> => {
  const { name, type, latitude, longitude, radius } = request;
  const services = await prisma.$queryRaw`
    SELECT 
      id, name, type, latitude, longitude, address
    FROM Service
    WHERE 
      (name LIKE ${`%${name}%`} OR ${name} = '')
      AND (type LIKE ${`%${type}%`} OR ${type} = '')
      AND (
        6371 * acos(
          cos(radians(${latitude})) * 
          cos(radians(latitude)) * 
          cos(radians(longitude) - radians(${longitude})) + 
          sin(radians(${latitude})) * 
          sin(radians(latitude))
        )
      ) <= ${radius}
  `;

  return { services: services as Service[] };
};

export const addToFavorites = async (request: AddFavoriteRequest): Promise<AddFavoriteResponse> => {
  const { userId, serviceId } = request;

  // Validate user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Validate service exists
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    throw new Error('Service not found');
  }

  // Check if favorite already exists
  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_serviceId: {
        userId,
        serviceId,
      },
    },
  });

  if (existingFavorite) {
    throw new Error('Service is already in favorites');
  }

  // Add to favorites
  await prisma.favorite.create({
    data: {
      userId,
      serviceId,
    },
  });

  return { message: 'Service added to favorites' };
};

export const removeFromFavorites = async (request: RemoveFavoriteRequest): Promise<RemoveFavoriteResponse> => {
  const { userId, serviceId } = request;

  await prisma.favorite.deleteMany({
    where: {
      userId,
      serviceId,
    },
  });

  return { message: 'Service removed from favorites' };
};

export const getFavorites = async (request: ListFavoritesRequest): Promise<ListFavoritesResponse> => {
  const { userId } = request;

  const favorites = await prisma.favorite.findMany({
    where: {
      userId,
    },
    include: {
      service: true,
    },
  });

  return {
    services: favorites.map((fav: { service: Service }) => fav.service)
  };
}; 