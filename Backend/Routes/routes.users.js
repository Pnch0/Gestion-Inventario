import express from 'express';

import { CreateUser, GetUser, UpdateUser, DeleteUser, LoginUser, LogoutUser } from '../Controllers/users.controllers.js';

const router = express.Router();

router.post('/', CreateUser);
router.get('/', GetUser);
router.put('/:id', UpdateUser);
router.delete('/:id', DeleteUser);
router.post('/login', LoginUser);
router.post('/logout', LogoutUser);


export default router;