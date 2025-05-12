import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import serviceRoutes from './routes/serviceRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import { swaggerSpec } from './swagger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req: Request, res: Response) => {
  res.send('Location-Based Service Search API');
});

app.use('/services', serviceRoutes);
app.use('/favorites', favoriteRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
}); 