import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { QuestionMarkCircleIcon, XMarkIcon as XMarkIconMini } from '@heroicons/react/20/solid'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'; // Asegúrate de importar loadStripe

const stripePromise = loadStripe('pk_test_51P0kZtL1xMfPwf6dxkOetgaYCWY2SNh3c3G9qY5KchoDmy5GtnCmqsWjNPVakxccJfPdM6O9yFSu5ZmQSBDnVTkx00ME56T6Ew');

export default function Carrito() {
  const [showHeader, setShowHeader] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleCheckout = async () => {
    // Calcula el total de impuestos primero
    const { tax } = calculateTotals();
  
    // Mapea los items del carrito a line_items y agrega el impuesto como un producto extra
    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'hnl',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Asegúrate de que el precio esté en centavos
      },
      quantity: item.quantity,
    }));
  
    // Agrega el impuesto como un "producto" adicional
    line_items.push({
      price_data: {
        currency: 'hnl',
        product_data: {
          name: "Impuesto",
        },
        unit_amount: Math.round(tax * 100), // Asegúrate de que el impuesto esté en centavos
      },
      quantity: 1,
    });
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/create-checkout-session`, { line_items });
      const sessionId = response.data.id;
      const stripe = await stripePromise;
      stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error al crear la sesión de Checkout:', error);
    }
  };

  const handleEditAddress = () => {
    navigate('/edit-address-form');
  };

  const handleAddAddress = () => {
    navigate('/address-form');
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/cart/${itemId}`, {
        headers: {
          Authorization: token,
        },
      });
      setCartItems(cartItems.filter((item) => item.item_id !== itemId));
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_URL}/cart/${itemId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setCartItems(
        cartItems.map((item) =>
          item.item_id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error al actualizar la cantidad del producto:', error);
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    };
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
          headers: {
            Authorization: token,
          },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error('Error al obtener los productos del carrito:', error);
      }
    };

    fetchCartItems();
  }, []);

  return (
    <div className="bg-white">
      {showHeader && (
        <header className="relative bg-white">
          <div className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
            <p className="flex-grow text-center">
              Obtenga envío gratis a partir de compras mayores a L.200
            </p>
            <button
              className="ml-auto cursor-pointer"
              onClick={() => setShowHeader(false)}
            >
              <XMarkIconMini className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </header>
      )}

      <main className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Carrito de compra</h1>

        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">Productos en el carrito</h2>
            <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
              {cartItems.map((item) => (
                <li key={item.item_id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <a href="#" className="font-medium text-gray-700 hover:text-gray-800">
                              {item.name}
                            </a>
                          </h3>
                        </div>
                        <div className="mt-1 flex text-sm">
                          <p className="text-gray-500">{item.description}</p>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">{item.price}</p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label htmlFor={`quantity-${item.item_id}`} className="sr-only">
                          Quantity, {item.name}
                        </label>
                        <input
                          type="number"
                          id={`quantity-${item.item_id}`}
                          name={`quantity-${item.item_id}`}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.item_id, parseInt(e.target.value))}
                          min="1"
                          className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        />

                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.item_id)}
                            className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Remove</span>
                            <XMarkIconMini className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Resumen de compra</h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">L. {calculateTotals().subtotal}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex text-sm text-gray-600">
                  <span>Impuesto</span>
                  <a href="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">
                    <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </dt>
                <dd className="text-sm font-medium text-gray-900">L. {calculateTotals().tax}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Total</dt>
                <dd className="text-base font-medium text-gray-900">L. {calculateTotals().total}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <button type="button" role="link" onClick={handleCheckout}
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Proceder al pago
              </button>
            </div>

            <section className="mt-8">
              <h2 className="text-lg font-medium text-gray-900">Dirección de envío</h2>
              {cartItems.length > 0 && cartItems[0].address_line1 ? (
                <div className="mt-4">
                  <p><strong>Dirección 1:</strong> {cartItems[0].address_line1}</p>
                  {cartItems[0].address_line2 && <p><strong>Dirección 2:</strong> {cartItems[0].address_line2}</p>}
                  <p><strong>Ciudad:</strong> {cartItems[0].city}</p>
                  <p><strong>Código Postal:</strong> {cartItems[0].postal_code}</p>
                  <p><strong>Teléfono:</strong> {cartItems[0].phone}</p>
                  <button
                    type="button"
                    className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    onClick={handleEditAddress}
                  >
                    Editar dirección
                  </button>
                </div>
              ) : (
                <div className="mt-4">
                  <p>No se ha agregado una dirección de envío.</p>
                  <button
                    type="button"
                    className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    onClick={handleAddAddress}
                  >
                    Agregar dirección
                  </button>
                </div>
              )}
            </section>
          </section>
        </form>
      </main>
    </div>
  )
}
