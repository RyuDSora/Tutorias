import express from 'express';
import pool from '../database/db.js';

const router = express.Router();

// Crear una nueva suscripción
router.post('/create', async (req, res) => {
    const { userId, planId } = req.body;

    const client = await pool.connect();
    try {
        const insertQuery = `
            INSERT INTO subscriptions (user_id, plan_id)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const result = await client.query(insertQuery, [userId, planId]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).send('Error creating subscription.');
    } finally {
        client.release();
    }
});

// Obtener suscripciones por usuario
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    const client = await pool.connect();
    try {
        const selectQuery = `
            SELECT * FROM subscriptions
            WHERE user_id = $1;
        `;
        const result = await client.query(selectQuery, [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).send('Error fetching subscriptions.');
    } finally {
        client.release();
    }
});

export default router;
