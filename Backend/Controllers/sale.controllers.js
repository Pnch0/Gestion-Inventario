import {supabase, supabaseAdmin} from "../Services/supabase.js";

export const CreateSale = async (req, res) => {
    const { rut, rut_cliente, rut_vendedor, id_usuario, detalles } = req.body;

    // Tomamos el RUT/ID del vendedor
    const rutFinalVendedor = rut_vendedor || rut || id_usuario;

    if (!rutFinalVendedor) {
        return res.status(400).json({ error: "No se identificó el vendedor" });
    }

    if (!detalles || detalles.length === 0) {
        return res.status(400).json({ error: "Debe incluir al menos un producto en la venta" });
    }

    try {
        const total_general = detalles.reduce((sum, item) => sum + (item.cantidad_venta * item.precio_unitario), 0);

        // 1. Insertar solo los campos que REALMENTE existen en la tabla Ventas
        const { data: nuevaVenta, error: errorVenta } = await supabase
            .from('Ventas')
            .insert({
                rut: rutFinalVendedor, // Foreign Key a Usuarios (Vendedor)
                fecha_hora: new Date().toISOString(),
                total_general
            })
            .select()
            .single();

        if (errorVenta || !nuevaVenta) {
            console.error("Error Supabase al insertar Venta:", errorVenta);
            return res.status(400).json({ error: `Error en Venta: ${errorVenta?.message}` });
        }

        const id_venta = nuevaVenta.id_venta;

        // 2. Insertar Detalle_Venta y actualizar Stock
        for (const item of detalles) {
            const total_linea = item.cantidad_venta * item.precio_unitario;

            const { error: errorDetalle } = await supabase
                .from('Detalle_Venta')
                .insert({
                    id_venta,
                    producto_id: Number(item.producto_id),
                    cantidad_venta: Number(item.cantidad_venta),
                    precio_unitario: Number(item.precio_unitario),
                    total_linea
                });

            if (errorDetalle) {
                return res.status(400).json({ error: `Error en detalle del producto ${item.producto_id}: ${errorDetalle.message}` });
            }

            // Actualizar stock
            const { data: producto } = await supabase
                .from('Productos')
                .select('stock')
                .eq('producto_id', item.producto_id)
                .single();

            if (producto) {
                const nuevoStock = producto.stock - item.cantidad_venta;
                await supabase
                    .from('Productos')
                    .update({ stock: nuevoStock >= 0 ? nuevoStock : 0 })
                    .eq('producto_id', item.producto_id);
            }
        }

        return res.status(201).json({ mensaje: "Venta registrada con éxito", id_venta });

    } catch (error) {
        console.error("Error en CreateSale:", error);
        return res.status(500).json({ error: error.message || "Error al procesar la venta" });
    }
};


export const GetSale = async (req, res) => {
  try {
      const { data: ventas, error } = await supabase
          .from('Ventas')
          .select(`
              id_venta,
              fecha_hora,
              total_general,
              rut,
              Detalle_Venta (
                  id_detalle,
                  producto_id,
                  cantidad_venta,
                  precio_unitario,
                  total_linea
              )
          `)
          .order('fecha_hora', { ascending: false });

      if (error) {
          throw new Error(error.message);
      }

      res.json(ventas);

  } catch (error) {
      res.status(500).json({ error: "Error al obtener las ventas", detalle: error.message });
  }
};

export const GetSaleDetail = async(req , res) =>{
    const { id } = req.params;
    try{
        const { data: detalles, error } = await supabase
        .from('Detalle_Venta')
        .select(`
            id_detalle,
            cantidad_venta,
            precio_unitario,
            total_linea,
            Productos ( producto_id, nombre )
            `)
            .eq('id_venta', id);

        res.json(detalles)
    
    } catch(error){
        res.status(500).json({ error: "Error al obtener el detalle de la venta" })
    }
};