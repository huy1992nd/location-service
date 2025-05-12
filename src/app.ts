import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import serviceRoutes from './routes/serviceRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import { swaggerSpec } from './swagger';
import { errorInterceptor, ErrorTypes } from './interceptors/error.interceptor';
import { requestInterceptor } from './interceptors/request.interceptor';

const app = express();
const PORT = process.env.PORT || 3000;

// Request interceptor (must be before routes)
app.use(requestInterceptor);

app.use(express.json());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req: Request, res: Response) => {
  res.send('Location-Based Service Search API V2');
});

app.use('/services', serviceRoutes);
app.use('/favorites', favoriteRoutes);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(ErrorTypes.NOT_FOUND(`Route ${req.originalUrl} not found`));
});

// Error interceptor
app.use(errorInterceptor);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
}); 