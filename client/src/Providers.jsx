import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

import axios from 'axios';

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [proveedorAEliminar, setProveedorAEliminar] = useState(null);

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/providers`);
                setProveedores(response.data);
            } catch (error) {
                console.error('Error al obtener los proveedores:', error);
            }
        };

        fetchProveedores();
    }, []);

    const eliminarProveedor = async (id) => {
        try {
            console.log('ID del proveedor a eliminar:', id);
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/providers/${id}`);
            console.log(response.data);
            toast.success('Proveedor eliminado exitosamente');
            setProveedorAEliminar(null);
            // Actualizar la lista de proveedores después de eliminar uno
            const responseUpdated = await axios.get(`${import.meta.env.VITE_API_URL}/providers`);
            setProveedores(responseUpdated.data); // Actualizar el estado con la lista actualizada
        } catch (error) {
            console.error('Error al eliminar proveedor:', error);
        }
    };

    const confirmarEliminarProveedor = (id) => {
        const confirm = () => {
            eliminarProveedor(id); // Pasar el ID como argumento
            toast.dismiss(); // Cerrar la notificación después de confirmar
        };

        toast.info(
            <div className="bg-blue-100 border-t-4 border-blue-500 rounded-b text-blue-900 px-4 py-6 shadow-md text-center">
                <p className="mensaje">¿Estás seguro de eliminar este proveedor?</p>
                <div className="flex justify-center mt-4">
                    <button onClick={confirm} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Confirmar</button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false
            }
        );
    };

    return (
        <div className="p-4">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Lista de Proveedores</h1>
                <div className="space-x-4">
                    <Link to="/add-provider" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">Agregar Proveedor</Link>
                    <Link to="/management-panel" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300">Volver</Link>
                </div>
            </div>

            {proveedores.length > 0 ? (
                <table className="min-w-full border rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {proveedores.map(proveedor => (
                            <tr key={proveedor.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{proveedor.name}</td>
                                <td className="px-6 py-4">{proveedor.email}</td>
                                <td className="px-6 py-4">{proveedor.phone}</td>
                                <td className="px-6 py-4">
                                    <Link to={`/edit-provider/${proveedor.id}`} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-3 py-1 rounded-full mr-2 transition duration-300">Editar</Link>
                                    <button onClick={() => confirmarEliminarProveedor(proveedor.id)} className="bg-red-500 hover:bg-red-700 text-white font-semibold px-3 py-1 rounded-full transition duration-300">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p className="text-lg">No hay proveedores registrados.</p>}

        </div>
    );
};

export default Proveedores;