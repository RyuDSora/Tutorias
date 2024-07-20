import express from 'express';
import { createPayment, deletePayment, getAllPayments, getPayment, updatePayment } from '../controllers/paymentController.js';

const router = express.Router();

// Rutas de Pago
router.get('/', getAllPayments);
router.get('/:id', getPayment);
router.post('/', createPayment);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);

export default router;
