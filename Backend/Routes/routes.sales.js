import express from 'express';
import { CreateSale, GetSale, GetSaleDetail } from '../Controllers/sale.controllers';

const router = express.Router();

router.post('/', CreateSale);
router.get('/', GetSale);
router.get('/:id/detalle',GetSaleDetail);

export default router;