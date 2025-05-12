import { Request, Response } from 'express';
import { searchServices as searchServicesFromService } from '../services/serviceService';

export const searchServices = async (req: Request, res: Response) => {
  const { name, type, lat, lng, radius } = req.query;
  const services = await searchServicesFromService(name as string, type as string, Number(lat), Number(lng), Number(radius));
  res.json(services);
}; 