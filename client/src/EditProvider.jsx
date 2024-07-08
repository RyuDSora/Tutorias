import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditProvider() {
    const { providerId } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/providers/${providerId}`);
                const data = await response.json();
                setName(data.name);
                setEmail(data.email);
                setPhone(data.phone);
            } catch (error) {
                console.error('Error al cargar el proveedor:', error);
                toast.error('Error al cargar el proveedor');
            }
        };

        fetchProvider();
    }, [providerId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/providers/${providerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, phone }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el proveedor');
            }
            toast.success('Proveedor actualizado exitosamente');

            // Redirigir a otra página después de actualizar el proveedor
            navigate('/providers');
        } catch (error) {
            console.error(error);
            toast.error('Error al actualizar el proveedor');
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="flex min-h-screen flex-1 justify-center items-center px-6 lg:px-8">
                <div className="sm:w-full sm:max-w-md bg-white shadow-md rounded px-8 py-8 sm:rounded-lg">
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-4">
                        Editar Proveedor
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nombre
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-style w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-style w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Teléfono
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="input-style w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="text-center">
                            <button
                                type="submit"
                                className="btn-style bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Actualizar Proveedor
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EditProvider;