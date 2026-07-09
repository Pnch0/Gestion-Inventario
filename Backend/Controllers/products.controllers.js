import {supabase, supabaseAdmin} from "../Services/supabase.js";

export const CreateProduct = async (req, res) => {
    const { nombre, categoria, marca, stock, precio_compra, precio_venta, ubicacion, descripcion } = req.body;
    const file = req.file;
    
    if (!nombre || !categoria || !stock || !precio_venta){
        return res.status(400).json({ error: "Nombre, categoria, stock y precio de venta son obligatorios."});
    }

    let imagen_url = null;
    let imagePathInStorage = null;

    try {
        if (file) {
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExtension}`;
            imagePathInStorage = fileName;

            const { data: storageData, error: storageError } = await supabase.storage
                .from('productos')
                .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: false });

            if (storageError) throw storageError;

            const { data: urlData } = supabase.storage.from('productos').getPublicUrl(fileName);
            imagen_url = urlData.publicUrl;
        } else if (req.body.imagen) {
            // Si Thunder Client manda un texto en el campo 'imagen', lo usamos directo
            imagen_url = req.body.imagen;
        }

        const { data, error: dbError } = await supabase
            .from('Productos')
            .insert([
                {
                    nombre,
                    categoria,
                    marca,
                    stock: parseInt(stock),
                    precio_compra: precio_compra ? parseFloat(precio_compra) : null,
                    precio_venta: parseFloat(precio_venta),
                    ubicacion,
                    descripcion,
                    imagen_url
                }
            ])
            .select();

        if (dbError) throw dbError;

        return res.status(201).json({
            message: "Producto creado con éxito",
            producto: data[0]
        });

    } catch (error) {
        console.error("Error al registrar el producto: ", error.message);

        if (imagePathInStorage) {
            try {
                console.log(`Eliminando imagen ${imagePathInStorage} de Storage por fallo en la operación...`);
                await supabase.storage.from('productos').remove([imagePathInStorage]);
            } catch (storageCleanupError) {
                console.error("No se pudo limpiar la imagen del Storage de forma automática:", storageCleanupError.message);
            }
        }

        return res.status(500).json({
            error: "Hubo un problema al registrar el producto",
            detalles: error.message
        });
    }
};

export const GetProduct = async (req, res) => {
    try{
        console.log("Consultando productos a Supabase ....");
        const { data, error } = await supabase
            .from('Productos')
            .select('*');

        if (error){
            console.error("Error de Supabase: ", error.message);
            return res.status(400).json({ error: error.message })
        }
    } catch (error){
        console.error("Error critico en el servidor al obtener los productos", error);

        if (!res.headersSent){
            return res.status(500).json({ message: "Error interno" });
        }
    }
};


export const UpdateProduct = async (req, res) =>{
    const { id } = req.params;
    const { nombre, categoria, marca, stock, precio_compra, precio_venta, ubicacion, descripcion } = req.body;
    const file = req.file;

    try{
        const { data: currentProduct, error: fetchError } = await supabase
            .from('Productos')
            .select('imagen_url')
            .eq('producto_id', id)
            .single();

        if (fetchError || !currentProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        let imagen_url = currentProduct.imagen_url;

        if (file){
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExtension}`;

            const { error: storageError } = await supabase.storage
                .from('productos')
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (storageError) throw storageError;

            const { data: urlData}  = supabase.storage
                .from('productos')
                .getPublicUrl(fileName);

            if (currentProduct.imagen_url) {
                const oldFileName = currentProduct.imagen_url.split('/').pop();
                await supabase.storage.from('productos').remove([oldFileName]);
            }

            imagen_url = urlData.publicUrl;
        }

        const UpdateData = {
            nombre,
            categoria,
            marca,
            stock: stock ? parseInt(stock) : undefined,
            precio_compra: precio_compra ? parseFloat(precio_compra) : undefined,
            precio_venta: precio_venta ? parseFloat(precio_venta) : undefined,
            ubicacion,
            descripcion,
            imagen_url
        };

        const { data, error: dbError } = await supabase
            .from('Producto')
            .update(UpdateData)
            .eq('producto_id', id)
            .select();


        if (dbError) throw dbError;

        return res.json({
            message: "Producto actualizado con exito",
            producto: data[0]
        });

    } catch (error){
        console.error("Error en UpdateProduct: ", error.message);
        return res.status(500).json({ message: error.message});
    }
};



export const DeleteProduct = async (req, res) =>{
    const { id } = req.params;

    try{
        const { data: product, error: fetchError } = await supabase
            .from('Productos')
            .select('imagen_url')
            .eq('producto_id', id)
            .single();

        if (fetchError || !product){
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const { error: dbError } = await supabase
            .from('Productos')
            .delete()
            .eq('producto_id', id);

        if (dbError){
            console.error("Error al eliminar el producto de la BD: ", dbError.message);
            return res.status(400).json({ error: "No se pudo eliminar el producto", detalle: dbError.message});
        }

        if (product.imagen_url) {
            const fileName = product.imagen_url.split('/').pop();
            const { error: storageError } = await supabase.storage
                .from('productos')
                .remove([fileName]);

            if (storageError) {
                console.error("No se pudo eliminar el archivo del Storage:", storageError.message);

            }
        }

        return res.json({ message: "Producto e imagen relacionada eliminados con exito"}); 
    
    } catch(error){
        return res.status(500).json({ error: error.message });
    }
};