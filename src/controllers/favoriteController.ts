import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { addToFavorites, removeFromFavorites, getFavorites } from '../services/searchService';
import { 
  AddFavoriteRequest, 
  RemoveFavoriteRequest, 
  ListFavoritesRequest,
  ErrorResponse 
} from '../types/favorite.types';

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const { userId, serviceId } = req.body;

    if (!userId || !serviceId) {
      const errorResponse: ErrorResponse = { error: 'User ID and Service ID are required' };
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    const request: AddFavoriteRequest = {
      userId: Number(userId),
      serviceId: Number(serviceId)
    };

    const response = await addToFavorites(request);
    res.status(StatusCodes.CREATED).json(response);
  } catch (error) {
    const errorResponse: ErrorResponse = { error: 'Failed to add to favorites' };

    if (error instanceof Error) {
      if (error.message === 'User not found') {
        errorResponse.error = 'User not found';
        return res.status(StatusCodes.NOT_FOUND).json(errorResponse);
      }
      if (error.message === 'Service not found') {
        errorResponse.error = 'Service not found';
        return res.status(StatusCodes.NOT_FOUND).json(errorResponse);
      }
      if (error.message === 'Service is already in favorites') {
        errorResponse.error = 'Service is already in favorites';
        return res.status(StatusCodes.CONFLICT).json(errorResponse);
      }
    }
    res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const { userId, serviceId } = req.params;
    
    const request: RemoveFavoriteRequest = {
      userId: Number(userId),
      serviceId: Number(serviceId)
    };

    const response = await removeFromFavorites(request);
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    const errorResponse: ErrorResponse = { error: 'Failed to remove from favorites' };
    res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }
};

export const listFavorites = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const request: ListFavoritesRequest = {
      userId: Number(userId)
    };

    const response = await getFavorites(request);
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    const errorResponse: ErrorResponse = { error: 'Failed to fetch favorites' };
    res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }
}; 