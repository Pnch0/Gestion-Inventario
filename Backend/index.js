import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import routeUsers from './Routes/routes.users.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', routeUsers);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));