import express from 'express';
import { addFavorite, removeFavorite, listFavorites } from '../controllers/favoriteController';

const router = express.Router();

router.post('/', addFavorite);
router.delete('/:userId/:serviceId', removeFavorite);
router.get('/:userId', listFavorites);

export default router; 