import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';


const ProductListCategory = () => {
  const [products, setProducts] = useState([]);
  const [categoria, setCategoria] = useState(null); 
  


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${import.meta.env.VITE_API_URL}/product-list?`;
        if (categoria) {
          url += `&categoria=${categoria}`;
        }
        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
      }
    };
    fetchProducts();
  }, [categoria]);



  return (
    <>
      <ToastContainer />
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Productos</h2>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.product_id} className="group relative bg-white overflow-hidden rounded-lg shadow-md">
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href="#">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.title}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.quantity}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-gray-500 mt-2">{product.description}</p>
                  <p className="text-gray-500 mt-2">Precio: ${Number(product.price).toFixed(2)}</p>
                  <p className="text-gray-500 mt-2">Cantidad disponible: {product.stock}</p>
                </div>

                
              </div>
            ))}
          </div>

         </div>
      </div>
    </>
  );
};

export default ProductListCategory; 
