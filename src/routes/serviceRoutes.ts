import express from 'express';
import { searchServicesController } from '../controllers/serviceController';

const router = express.Router();

/**
 * @swagger
 * /services/search:
 *   get:
 *     summary: Search for services based on location and filters
 *     description: Search for services within a specified radius and optional filters
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by service name
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by service type
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude coordinate
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude coordinate
 *       - in: query
 *         name: radius
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Search radius in kilometers
 *     responses:
 *       200:
 *         description: List of services matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 services:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/search', searchServicesController);

export default router; 