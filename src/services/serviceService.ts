import { PrismaClient } from '@prisma/client';
import { Service } from '../models/Service';

const prisma = new PrismaClient();

export const searchServices = async (name: string, type: string, lat: number, lng: number, radius: number): Promise<Service[]> => {
  // Haversine formula in SQL to find services within radius
  const services = await prisma.$queryRaw`
    SELECT 
      id, name, type, latitude, longitude, address
    FROM Service
    WHERE 
      (name LIKE ${`%${name}%`} OR ${name} = '')
      AND (type LIKE ${`%${type}%`} OR ${type} = '')
      AND (
        6371 * acos(
          cos(radians(${lat})) * 
          cos(radians(latitude)) * 
          cos(radians(longitude) - radians(${lng})) + 
          sin(radians(${lat})) * 
          sin(radians(latitude))
        )
      ) <= ${radius}
  `;

  return services as Service[];
};

export const addToFavorites = async (userId: number, serviceId: number): Promise<void> => {
  await prisma.favorite.create({
    data: {
      userId,
      serviceId,
    },
  });
};

export const removeFromFavorites = async (userId: number, serviceId: number): Promise<void> => {
  await prisma.favorite.delete({
    where: {
      userId_serviceId: {
        userId,
        serviceId,
      },
    },
  });
};

export const getFavorites = async (userId: number): Promise<Service[]> => {
  const favorites = await prisma.favorite.findMany({
    where: {
      userId,
    },
    include: {
      service: true,
    },
  });

  return favorites.map((fav: { service: Service }) => fav.service);
}; 