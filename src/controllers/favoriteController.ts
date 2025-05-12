import { Request, Response } from 'express';
import { addToFavorites, removeFromFavorites, getFavorites } from '../services/serviceService';

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const { userId, serviceId } = req.body;
    await addToFavorites(Number(userId), Number(serviceId));
    res.status(201).json({ message: 'Service added to favorites' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to add to favorites' });
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const { userId, serviceId } = req.params;
    await removeFromFavorites(Number(userId), Number(serviceId));
    res.status(200).json({ message: 'Service removed from favorites' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to remove from favorites' });
  }
};

export const listFavorites = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const favorites = await getFavorites(Number(userId));
    res.json(favorites);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch favorites' });
  }
}; 