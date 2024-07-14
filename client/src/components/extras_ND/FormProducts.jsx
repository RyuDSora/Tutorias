import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom'; // Importa Link desde react-router-dom
import 'react-toastify/dist/ReactToastify.css';

function FormProducts() {
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);        
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
        setError('Error al obtener las categorías');
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('category_id', categoryId);
    formData.append('name', title);
    formData.append('quantity', quantity);
    formData.append('image', image);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', quantity);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Error al registrar el producto');
      }
  
      setSuccess(true);
      toast.success('Producto registrado con éxito!');
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };
  

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  }

  const handleChangePrice = (e) => {
    setPrice(e.target.value);
  }

  return (
    <>
      <ToastContainer />

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Registrar Producto
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Link to="/management-panel" className="text-indigo-600 hover:text-indigo-500 mb-4 block text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1 -mt-0.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.707 14.707a1 1 0 0 1-1.414 0l-6-6a1 1 0 1 1 1.414-1.414L7 11.586V3a1 1 0 1 1 2 0v8.586l4.293-4.293a1 1 0 1 1 1.414 1.414l-6 6z" clipRule="evenodd" />
        </svg>
        Volver
        </Link>



          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                Categoría
              </label>
              <div className="mt-2">
                <select
                  id="category"
                  name="category"
                  onChange={(e) => setCategoryId(e.target.value)}
                  value={categoryId}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                >
                  <option value="">Seleccionar Categoría</option>
                  {categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium leading-6 text-gray-900">
                Cantidad
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
            </div>

            <div>
  <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">
    Imagen
    </label>
  <input
    id="image"
    name="image"
    type="file"
    onChange={(e) => setImage(e.target.files[0])}
    required
    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
  />
</div>

<div>
  <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
    Descripción
  </label>
  <textarea
    id="description"
    name="description"
    value={description}
    onChange={handleChangeDescription}
    required
    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
  />
</div>

<div>
  <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
    Precio
  </label>
  <input
    id="price"
    name="price"
    type="number"
    value={price}
    onChange={handleChangePrice}
    required
    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
  />
</div>

<div>
  <button
    type="submit"
    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
  >
    Registrar Producto
  </button>
</div>

</form>
</div>
</div>
</>
);
}

export default FormProducts;
