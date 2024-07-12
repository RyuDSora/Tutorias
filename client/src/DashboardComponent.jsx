import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CarouselComponent from './Carrousel';

import axios from 'axios';

export default function DashboardComponent() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addedToCart, setAddedToCart] = useState([]);
  const productsPerPage = 8;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  //const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: {
          Authorization: token,
        },
      });
      const cartItems = response.data;

      // Verificar si el producto ya existe en el carrito
      const existingItem = cartItems.find((item) => item.product_id === productId);

      if (existingItem) {
        toast.info('El producto ya está agregado al carrito');
        setAddedToCart([...addedToCart, productId]);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/cart/add`, { productId }, {
          headers: {
            Authorization: token,
          },
        });
        console.log('Producto agregado al carrito');
        toast.success('Producto agregado al carrito');
        setAddedToCart([...addedToCart, productId]);
      }
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
      toast.error('Error al agregar el producto al carrito');
    }
  };

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

  return (
    /*<div className="bg-white">
      <ToastContainer />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-xl font-bold text-gray-900">Productos</h2>

        <div className="mt-8 mb-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {currentProducts.map((product) => (
            <div key={product.product_id} className="border p-4 rounded-lg transition-all duration-300 transform hover:scale-105 relative">
              <div className="overflow-hidden relative rounded-lg">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-72 w-full object-cover object-center"
                />
                <div className="p-4 text-center">
                  <p className="text-lg font-semibold">L{product.price}</p>
                  <p className="mt-2 text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                  <button
                    onClick={() => handleAddToCart(product.product_id)}
                    disabled={addedToCart.includes(product.product_id)}
                    className={`mt-4 rounded-md border-transparent px-4 py-2 text-sm font-medium ${addedToCart.includes(product.product_id)
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                  >
                    {addedToCart.includes(product.product_id) ? 'Agregado al carrito' : 'Agregar al carrito'}
                  </button>
                </div>
              </div>
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
  */
  <>
    <div className='Principal uppercase text-center txt_lg f_regular'>Tutorias</div>  
    <div className='Secundario text-center f_principal'>Encuentra al tutor perfecto para ti</div>
    {/**<CarouselComponent />*/}
    <div className='text-center my-2' style={{height:200}}>aqui va el carrousel</div>
    <div className='text-center my-2'><button className='btn bg_secundario Blanco f_principal'>!Registrate ahora y empieza a aprender de los mejores¡</button></div>
  </>
    );
  
}
