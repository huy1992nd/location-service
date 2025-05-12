import { Service } from '../models/Service';

// Request Types
export interface SearchServicesRequest {
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export interface AddFavoriteRequest {
  userId: number;
  serviceId: number;
}

export interface RemoveFavoriteRequest {
  userId: number;
  serviceId: number;
}

export interface ListFavoritesRequest {
  userId: number;
}

// Response Types
export interface SearchServicesResponse {
  services: Service[];
}

export interface AddFavoriteResponse {
  message: string;
}

export interface RemoveFavoriteResponse {
  message: string;
}

export interface ListFavoritesResponse {
  services: Service[];
}

export interface ErrorResponse {
  error: string;
} 