import express from 'express';
import { addFavorite, removeFavorite, listFavorites } from '../controllers/favoriteController';

const router = express.Router();

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Add a service to favorites
 *     description: Add a service to a user's favorites list
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - serviceId
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user
 *               serviceId:
 *                 type: integer
 *                 description: The ID of the service to add
 *     responses:
 *       201:
 *         description: Service added to favorites successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Service added to favorites
 *       400:
 *         description: Failed to add to favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', addFavorite);

/**
 * @swagger
 * /favorites/{userId}/{serviceId}:
 *   delete:
 *     summary: Remove a service from favorites
 *     description: Remove a service from a user's favorites list
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the service to remove
 *     responses:
 *       200:
 *         description: Service removed from favorites successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Service removed from favorites
 *       400:
 *         description: Failed to remove from favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:userId/:serviceId', removeFavorite);

/**
 * @swagger
 * /favorites/{userId}:
 *   get:
 *     summary: List user's favorite services
 *     description: Get a list of all services in a user's favorites
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: List of favorite services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       400:
 *         description: Failed to fetch favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:userId', listFavorites);

export default router; 