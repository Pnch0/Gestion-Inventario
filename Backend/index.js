import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { supabase } from './Services/supabase.js';

import routeUsers from './Routes/routes.users.js';
import routeProducts from './Routes/routes.products.js'
import routeSales from './Routes/routes.sales.js'
import routeRole from './Routes/routes.role.js'

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', routeUsers);
app.use('/api/products', routeProducts);
app.use('/api/sales', routeSales);
app.use('/api/roles',routeRole);

app.get('/health', async (req, res) => {
  try {
    const { error } = await supabase.from('roles').select('id').limit(1);
    
    if (error) {
      console.error("Error ping Supabase:", error.message);
      return res.status(500).send("Error en la BD");
    }

    return res.status(200).send("OK");
  } catch (err) {
    return res.status(500).send("Error de servidor");
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));