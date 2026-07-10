import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import routeUsers from './Routes/routes.users.js';
import routeProducts from './Routes/routes.products.js'
import routeSales from './Routes/routes.sales.js'

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', routeUsers);
app.use('/api/products', routeProducts);
app.use('/api/sales', routeSales);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));