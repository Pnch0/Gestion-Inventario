const API_URL = 'http://localhost:3000/api';

export const userService = {
    getUsers: async () => {
        try {
            const response = await fetch(`${API_URL}/users`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al obtener los usuarios del servidor.');
            }
            
            return await response.json();
        } catch (error) {
            console.error("Error en el servicio getUsers:", error.message);
            throw error;
        }
    },

    createUser: async (userData) => {
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al registrar el usuario.');
            }

            return await response.json();
        } catch (error) {
            console.error("Error en el servicio createUser:", error.message);
            throw error;
        }
    },

    updateUser: async (id_auth, updateData) => {
        try {
            const bodyData = {
                nombre: updateData.nombre,
                apellido: updateData.apellido,
                correo: updateData.correo,
                telefono: updateData.telefono,
                rol_id: updateData.rol_id,
                rut: updateData.rut_usuario
            };

            const response = await fetch(`${API_URL}/users/${id_auth}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al actualizar el perfil del usuario.');
            }

            return await response.json();
        } catch (error) {
            console.error("Error en el servicio updateUser:", error.message);
            throw error;
        }
    },

    deleteUser: async (id_auth) => {
        try {
            const response = await fetch(`${API_URL}/users/${id_auth}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al intentar eliminar el usuario.');
            }

            return await response.json();
        } catch (error) {
            console.error("Error en el servicio deleteUser:", error.message);
            throw error;
        }
    }
};


export const productService = {

    getProducts: async () => {
        try{
            const response = await fetch(`${API_URL}/products`);

            if (!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al obtener los productos');
            }

            return await response.json();
        
        } catch (error){
            console.error("Error en el servicio getProducts: ", error.message);
            throw error;
        }
    },

    createProducts: async (productFormData) =>{
        try{
            const response = await fetch(`${API_URL}/products`,{
                method: 'POST',
                body: productFormData
            });
        
            if (!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al registrar el producto');
            }

            return await response.json();

        } catch(error){
            console.error("Error en el servicio createProduct: ", error.message);
            throw error;
        }
    },

    updateProduct: async(id, productFormData) =>{
        try{
            const response = await fetch(`${API_URL}/product/${id}`,{
                method: 'PUT',
                body: productFormData
            });

            if (!response.ok){
                const errorData = await response.json();
                throw newError(errorData.error || 'Error al actualizar el producto');
            }

            return await response.json();
        
        } catch(error){
            console.error("Error en el servicio updateProduct", error.message);
            throw error;
        }
    },

    deleteProduct: async(id) =>{
        try{
            const response = await fetch(`${API_URL}/product/${id}`,{
                method: 'DELETE'
            });


            if (!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al intentar eliminar el producto');
            }

            return await response.json();
        
        } catch(error){
            console.error("Error en el servicio deleteProduct", error.message);
            throw error;
        } 
    }
};

export const saleService ={
    getSales: async () =>{
        try{
            const response = await fetch(`${API_URL}/sales`);

            if (!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al obtener las ventas');
            }

            return await response.json();

        } catch (error){
            console.error("Error en el servicio getSales: ", error.message);
            throw error;
        }
    },



}




