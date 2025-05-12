import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { searchServices } from '../services/searchService';
import { SearchServicesRequest, ErrorResponse } from '../types/favorite.types';

export const searchServicesController = async (req: Request, res: Response) => {
  try {
    const { name, type, latitude, longitude, radius } = req.query;
    console.log(req.query);

    if (!latitude || !longitude || !radius) {
      const errorResponse: ErrorResponse = { error: 'Latitude, longitude, and radius are required' };
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    const request: SearchServicesRequest = {
      name: name as string || '',
      type: type as string || '',
      latitude: Number(latitude),
      longitude: Number(longitude),
      radius: Number(radius)
    };

    const response = await searchServices(request);
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    const errorResponse: ErrorResponse = { error: 'Failed to search services' };
    res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }
};
