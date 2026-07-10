import { supabase } from "../Services/supabase.js";

export const CreateRole = async (req, res) =>{
    const { nombre } = req.body;

    if (!nombre){
        return res.status(400).json({ error: "El nombre del rol es obligatorio." });
    }

    try{
        const { data, error } = await supabase
            .from('Rol')
            .insert([{ nombre }])
            .select();

        if (error){
            console.error("Error al insertar el rol: ", error.message);
            return res.status(400).json({ error: error.message });
        }

        return res.status(201).json({
            message: "Rol creado con exito",
            rol: data[0]
        });
    
    } catch(error){
        console.error("Error critico en CreateRol: ", error.message);
        return res.status(500).json({ error: "Hubo un problema la crear el rol." });
    }
};

export const GetRole = async (req, res) =>{
    
    try{
        console.log("Consultando roles a Supabase...");
        const { data, error} = await supabase
            .from('Rol')
            .select('rol_id, nombre');

        if (error){
            console.error("Error de Supabase al listar roles", error.message);
            return res.status(400).json({ error: error.message});
        }

        console.log("Roles obtenidos con exito");
        return res.json(data);

    } catch (error){
        console.error("Error critico en GetRoles ", error);
        if (!res.headerSent){
            return res.status(500).json({ message: "Error interno del servidor." });
        }
    }
};


export const UpdateRole = async (req, res) =>{
    const { id } = req.params; 
    const { nombre } = req.body;

    if (!nombre){
        return res.status(400).json({ error: "El nombre del rol es obligatorio para actualizar." });
    }

    try{
        const { data, error } = await supabase
            .from('Rol')
            .update({ nombre })
            .eq('rol_id', id)
            .select();

        if (error){
            console.error("Error al acutalizar el rol: ", error.message);
            return res.status(400).json({ error: error.message });
        }

        if (!data || data.length === 0){
            return res.status(404).json({ message: "Rol no encontrado en la base de datos." });

        }

        return res.json({
            message: "Rol actualizado con exito",
            rol: data[0]
        });
    
    } catch (error){
        console.erro("Error en UpdateRole: ", error.message);

    }
    
};


export const DeleteRole = async (req, res) =>{
    const { id } = req.params;

    try{
        const { error } = await supabase
            .from('Rol')
            .delete()
            .eq('rol_id', id);

        if (error){
            console.error("Error al eliminar el rol: ", error.message);
            return res.status(400).json({
                error: "No se pudo eliminar el rol.",
                detalle: error.message
            });
        }

        return res.json({ message: "Rol eliminado con exito."});

    } catch (error){
        console.error("Error en DeleteRole: ", error.message);
        return res.status(500).json({ error: error.message});
    }
};