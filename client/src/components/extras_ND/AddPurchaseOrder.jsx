import { useState, useEffect } from 'react';
import axios from 'axios';

const AddPurchaseOrder = () => {
    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]);
    const [selectedProveedor, setSelectedProveedor] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [cantidadesPorProducto, setCantidadesPorProducto] = useState({});
    const [cantidad, setCantidad] = useState('');
    const [ordenItems, setOrdenItems] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProveedor) {
            console.error('No se ha seleccionado ningún proveedor.');
            return;
        }
        try {
            const orderData = {
                provider_id: selectedProveedor,
                products: ordenItems,
                date: new Date()
            };
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/purchase-orders`, orderData);
            console.log('Orden de compra agregada:', response.data);
            // Resto del código...
        } catch (error) {
            console.error('Error al agregar la orden de compra:', error);
            // Resto del código...
        }
    };

    const handleChangeCantidad = (productId, e) => {
        const cantidad = parseInt(e.target.value) || '';
        setCantidadesPorProducto({ ...cantidadesPorProducto, [productId]: cantidad });
    };

    useEffect(() => {
        const initialCantidades = {};
        productos.forEach(producto => {
            initialCantidades[producto.product_id] = 0; // Inicializamos con 0 o cualquier otro valor predeterminado
        });
        setCantidadesPorProducto(initialCantidades);
    }, [productos]);

    // Función para cargar proveedores y productos
    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/providers`);
                setProveedores(response.data);
            } catch (error) {
                console.error('Error al obtener proveedores:', error);
            }
        };

        const fetchProductos = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/low-stock-products`);
                setProductos(response.data);
            } catch (error) {
                console.error('Error al obtener la lista de productos:', error);
            }
        };

        fetchProveedores();
        fetchProductos();
    }, []);

    const agregarProducto = () => {
        if (selectedProduct && cantidad !== '') { // Verificar si hay un producto seleccionado y una cantidad definida
            const productToAdd = {
                product_id: parseInt(selectedProduct),
                quantity: parseInt(cantidad)
            };
            setOrdenItems([...ordenItems, productToAdd]);
        } else {
            console.error('Debes seleccionar un producto y establecer una cantidad!');
        }
    };

    const handleSelectProduct = (productId) => {
        setSelectedProduct(productId);
        setCantidad(cantidadesPorProducto[productId] || ''); // Establecer la cantidad actual
    };

    return (
        <div className="m-4 p-4 bg-gray-200 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Agregar Orden de Compra</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="proveedor" className="block">Proveedor:</label>
                    <select id="proveedor" value={selectedProveedor} onChange={(e) => setSelectedProveedor(e.target.value)} className="w-full p-2">
                        {proveedores.map(proveedor => (
                            <option key={proveedor.id} value={proveedor.id}>{proveedor.name}</option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-2 py-1">Producto</th>
                                <th className="px-2 py-1">Stock</th>
                                <th className="px-2 py-1">Cantidad</th>
                                <th className="px-2 py-1"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map(producto => (
                                <tr key={producto.product_id} className={selectedProduct === producto.product_id ? 'bg-gray-100' : ''}>
                                    <td className="px-2 py-1">{producto.name}</td>
                                    <td className="px-2 py-1">{producto.stock}</td>
                                    <td className="px-2 py-1">
                                        <input type="number" value={cantidadesPorProducto[producto.product_id] || ''} onChange={(e) => handleChangeCantidad(producto.product_id, e)} className="p-2 w-16" />
                                    </td>
                                    <td className="px-2 py-1">
                                        <input type="checkbox" checked={selectedProduct === producto.product_id} onChange={() => handleSelectProduct(producto.product_id)} />
                                    </td>
                                    <td className="px-2 py-1">
                                        <button type="button" onClick={() => {
                                            setSelectedProduct(producto.product_id);
                                            setCantidad(cantidadesPorProducto[producto.product_id] || ''); // Establecer la cantidad actual
                                            agregarProducto();
                                        }} className="bg-blue-500 text-white rounded-md p-2">+</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-2">Productos agregados a la orden:</h3>
                    <ul>
                        {ordenItems.map((item, index) => (
                            <li key={index}>Producto ID: {item.product_id}, Cantidad: {item.quantity}</li>
                        ))}
                    </ul>
                </div>

                <button type="submit" className="bg-green-500 text-white rounded-md p-2 mt-4">Agregar Orden</button>
            </form>
        </div>
    );
};

export default AddPurchaseOrder;