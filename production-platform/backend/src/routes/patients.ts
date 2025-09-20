import { Router } from 'express';
const router = Router();

// Patient routes - placeholder
router.get('/', (req, res) => res.json({ message: 'Patients endpoint' }));
router.post('/', (req, res) => res.json({ message: 'Create patient' }));
router.get('/:id', (req, res) => res.json({ message: 'Get patient' }));

export default router;