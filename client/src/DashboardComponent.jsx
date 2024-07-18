import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function DashboardComponent() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addedToCart, setAddedToCart] = useState([]);
  const productsPerPage = 8;

  // Ejemplo de imágenes locales (colocadas en la carpeta public/images)
  const images = [
    { url: '/images/image1.png', alt: 'Imagen 1' },
    { url: '/images/image2.png', alt: 'Imagen 2' },
    { url: '/images/image3.png', alt: 'Imagen 3' },
  ];

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: {
          Authorization: token,
        },
      });
      const cartItems = response.data;

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
    <div className="bg-white">
      <ToastContainer />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="Principal uppercase text-center txt_lg f_regular">Tutorias</div>  
        <div className="Secundario text-center f_principal">Encuentra al tutor perfecto para ti</div>
        
        {/* Carrusel de imágenes */}
        <Carousel autoPlay infiniteLoop showThumbs={false} interval={4000}>
          {images.map((image, index) => (
            <div key={index}>
              <img src={image.url} alt={image.alt} />
            </div>
          ))}
        </Carousel>

        {/* Sección dividida en dos */}
        <div className="grid grid-cols-2 gap-8 mt-12" style={{ backgroundColor: '#336A41', padding: '20px', borderRadius: '8px' }}>
          {/* Lado izquierdo: Video con título */}
          <div className="col-span-1 flex flex-col justify-center items-center text-white">
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>Asociate con Nosotros</h3>
            <video controls width="100%" style={{ maxWidth: '100%', height: 'auto' }}>
              <source src="/videos/mi_video.mp4" type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
          
          {/* Lado derecho: Imagen */}
          <div className="col-span-1 flex justify-center items-center">
            <img src="/images/image4.png" alt="Imagen de la sección derecha" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        </div>

        {/* Imagen debajo de la sección dividida en dos */}
        <div className="mt-8 flex justify-center">
          <img src="/images/image5.png" alt="Imagen debajo de la sección dividida" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>

        {/* Nuevo apartado */}
        <div className="mt-8 grid grid-cols-2 gap-8 items-center">
          {/* Imagen a la izquierda */}
          <div>
            <img src="/images/image6.jpg" alt="Imagen a la izquierda" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
          {/* Texto a la derecha */}
            <div>
              <h3 className="text-lg text-gray-1000 font-bold" style={{ fontFamily: 'Clear Sans Light, sans-serif' , color: '#336A41'}}>
                Aprendizaje que a los estudiantes les encantará <br /></h3>
                <p className="text-lg text-gray-700" style={{ fontFamily: 'Clear Sans Light, sans-serif' , color: '#336A41'}}> 
                  Una asociación que te encantará <br /></p>
                <p className="text-lg text-gray-700" style={{ fontFamily: 'Clear Sans Light, sans-serif' , color: '#336A41'}}>
                  Resultados que todos amarán</p>
              
            </div>
        </div>

        {/* Lista de productos */}
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
                  <p className="text-lg font-semibold">L {product.price}</p>
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

        {/* Controles de paginación */}
        <div className="flex items-center justify-center gap-8">
          <button
            className="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg border border-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85]"
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            type="button"
          >
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
            onClick={() => currentPage < Math.ceil(products.length / productsPerPage) && setCurrentPage(currentPage + 1)}
            type="button"
          >
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
  );
}
