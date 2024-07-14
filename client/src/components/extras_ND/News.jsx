import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecentProducts = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;

    useEffect(() => {
        const fetchRecentProducts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/recent-products`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error al obtener los productos recientes:', error);
            }
        };

        fetchRecentProducts();
    }, []);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h1 className="text-2xl font-semibold mb-4">Productos Recientes</h1>
            <div className="grid grid-cols-4 gap-4">
                {currentProducts.map((product) => (
                    <div key={product.id} className="border p-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                        <div className="relative">
                            <div className="relative h-72 w-full overflow-hidden rounded-lg">
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="h-full w-full object-cover object-center"
                                />
                            </div>
                            <div className="relative mt-4">
                                <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                                <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                            </div>
                            <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                                />
                                <p className="relative text-lg font-semibold text-white">{product.price}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
                {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} transition-colors duration-300 hover:bg-blue-600 hover:text-white`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RecentProducts;