import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PurchaseOrders = () => {
    const [ordenes, setOrdenes] = useState([]);

    const eliminarOrden = async (id) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/purchase-orders/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setOrdenes(ordenes.filter(orden => orden.id !== id));
            }
        } catch (error) {
            console.error('Error al eliminar el pedido:', error);
        }
    };

    useEffect(() => {
        const fetchOrdenes = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/purchase-orders`);
                setOrdenes(response.data);
            } catch (error) {
                console.error('Error al obtener las órdenes de compra:', error);
            }
        };
        fetchOrdenes();
    }, []);


    return (
        <div className="m-4 p-4 bg-gray-200 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Órdenes de Compra</h2>

            <Link to="/new-order" className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 inline-block">Agregar Orden</Link>

            <table className="border-collapse w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2 bg-gray-300">Proveedor</th>
                        <th className="px-4 py-2 bg-gray-300">Productos</th>
                        <th className="px-4 py-2 bg-gray-300">Fecha</th>
                        <th className="px-4 py-2 bg-gray-300">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ordenes.map(orden => (
                        <tr key={orden.id} className="border-b">
                            <td className="px-4 py-2">{orden.provider_id}</td>
                            <td className="px-4 py-2">{Object.entries(orden.products).map(([productId, quantity]) => `${productId} - ${quantity}`).join(', ')
                            }</td>
                            <td className="px-4 py-2">{orden.date}</td>
                            <td className="px-4 py-2">
                                <Link to={`/edit-order/${orden.id}`} className="text-blue-500 mr-2">Editar</Link>
                                <button onClick={() => eliminarOrden(orden.id)} className="text-red-500">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PurchaseOrders;