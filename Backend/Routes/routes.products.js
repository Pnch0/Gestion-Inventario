import express from 'express';
import multer from 'multer';   

import { CreateProduct, GetProduct, UpdateProduct, DeleteProduct } from '../Controllers/products.controllers.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('imagen'), CreateProduct);
router.get('/', GetProduct);
router.put('/:id', upload.single('imagen'), UpdateProduct);
router.delete('/:id', DeleteProduct);


export default router;