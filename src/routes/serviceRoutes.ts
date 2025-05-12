import express from 'express';
import { searchServices } from '../controllers/serviceController';

const router = express.Router();

router.get('/search', searchServices);

export default router; 