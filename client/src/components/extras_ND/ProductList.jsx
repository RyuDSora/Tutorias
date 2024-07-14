import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';

import {
  ArchiveBoxIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const navigate = useNavigate(); // Inicializar useNavigate

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/product-list`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
      }
    };
    fetchProducts();
  }, [currentPage]);

  useEffect(() => {
    products.forEach((product) => {
      if (product.stock < 5) {
        toast.warning(`${product.name} tiene menos de 5 unidades disponibles`);
      }
    });
  }, [products]);

  const handleEdit = (product) => {
    // TODO: Implement edit functionality
    navigate(`/product-edit/${product.product_id}`);
  };

  const handleDelete = async (product) => {
    try {
      // Mostrar mensaje de confirmación
      const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este producto?');

      // Si el usuario confirma la eliminación
      if (isConfirmed) {
        // Realizar la solicitud DELETE al backend para eliminar el producto
        await axios.delete(`${import.meta.env.VITE_API_URL}/products/${product.product_id}`);

        // Actualizar el estado para reflejar la eliminación del producto
        setProducts(products.filter(item => item.product_id !== product.product_id));

        // Mostrar una notificación de éxito
        toast.success('Producto eliminado exitosamente');
      }
    } catch (error) {
      console.error('Error al eliminar el producto client:', error);
    }
  };


  const handleArchive = (product) => {
    // TODO: Implement archive functionality
    console.log('Archive product:', product);
  };

  return (
    <>
      <ToastContainer />
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Productos</h2>

          <div className="mt-6 mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8">
            {currentProducts.map((product) => (
              <div key={product.product_id} className="group relative bg-white rounded-lg shadow-md overflow-hidden max-w-sm">
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-gray-800 font-semibold">{product.name}</h3>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                  <p className="text-gray-600 mt-2">Precio: L{Number(product.price).toFixed(2)}</p>
                  <p className="text-gray-600 mt-2">Cantidad disponible: {product.stock}</p>
                </div>

                {/* Icon Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex">
                  <button onClick={() => handleEdit(product)}>
                    <PencilSquareIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  </button>
                  <button onClick={() => handleDelete(product)}>
                    <TrashIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500" aria-hidden="true" />
                  </button>
                  <button onClick={() => handleArchive(product)}>
                    <ArchiveBoxIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500" aria-hidden="true" />
                  </button>
                </div>
                {product.stock < 5 && (
                  <div className="bg-red-100 text-red-600 p-2 mt-2 rounded-md">¡Atención! Quedan pocas unidades disponibles</div>
                )}

              </div>
            ))}
          </div>



          <div className="flex items-center justify-center gap-8">
            <button
              className="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg border border-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85]"
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              type="button">
              <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                  aria-hidden="true" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
                </svg>
              </span>
            </button>
            <p className="block font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
              Página <strong className="text-gray-900">{currentPage}</strong> de {' '}
              <strong className="text-gray-900">{Math.ceil(products.length / productsPerPage)}</strong>
            </p>
            <button
              className="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg border border-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85]"
              onClick={() => currentPage < Math.ceil(products.length / productsPerPage) && paginate(currentPage + 1)}
              type="button">
              <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                  aria-hidden="true" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
                </svg>
              </span>
            </button>
          </div>

        </div>
      </div>
    </>


  );
};

export default ProductList;
