import express, { Request, Response } from 'express';
import serviceRoutes from './routes/serviceRoutes';
import favoriteRoutes from './routes/favoriteRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Location-Based Service Search API');
});

app.use('/services', serviceRoutes);
app.use('/favorites', favoriteRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 