import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faCamera, faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const ProductCategories = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = async (category) => {
        setSelectedCategory(category);

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/category/${category.category_id}`);
            setProducts(response.data);
        } catch (error) {
            console.error(`Error al obtener los productos de la categoría ${category.name}:`, error);
        }
    };

    const getCategoryIcon = (categoryName) => {
        switch (categoryName) {
            case 'Decoración de fiestas':
                return faGift;
            case 'Accesorios para photocall':
                return faCamera;
            case 'Artículos para eventos especiales':
                return faStar;
            default:
                return faGift; // Icono predeterminado
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex justify-center items-center">
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Categorías</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div key={category.id} className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer" onClick={() => handleCategoryClick(category)}>
                            <FontAwesomeIcon icon={getCategoryIcon(category.name)} className="text-4xl text-gray-800 mx-auto my-4" />
                            <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                            <p className="text-sm text-gray-600 mt-2">{category.description}</p>
                        </div>
                    ))}
                </div>

                {selectedCategory && (
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 text-center mt-8">{selectedCategory.name} Productos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                            {products.map((product) => (
                                <div key={product.id} className="text-center bg-white rounded-lg shadow-md">
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-52 object-cover rounded-t-lg"
                                    />
                                    <div className="p-4">
                                        <p className="font-semibold">{product.name}</p>
                                        <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                                        <p className="text-sm text-gray-600">Disponibles: {product.stock}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCategories;