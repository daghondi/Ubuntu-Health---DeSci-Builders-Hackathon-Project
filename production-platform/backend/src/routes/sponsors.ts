import { Router } from 'express';
const router = Router();
router.get('/', (req: any, res: any) => res.json({ message: 'Sponsors endpoint' }));
export default router;