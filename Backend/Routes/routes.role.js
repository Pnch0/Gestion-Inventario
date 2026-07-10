import express from 'express';
import { CreateRole, GetRole, UpdateRole, DeleteRole } from '../Controllers/role.controllers.js';

const router = express.Router();

router.post('/', CreateRole);
router.get('/', GetRole);
router.put('/:id', UpdateRole);
router.delete('/:id', DeleteRole);


export default router;