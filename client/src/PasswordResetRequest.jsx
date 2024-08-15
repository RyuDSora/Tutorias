import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { URIUser } from "./components/Urls";

const PasswordResetRequest = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Manejar el cambio de campo de entrada
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    // Función para solicitar el restablecimiento de contraseña
    const handleRequestPasswordReset = async (event) => {
        event.preventDefault();
        setError("");
        setSuccessMessage("");

        try {
            const response = await axios.post(`${URIUser}request-password-reset`, { email });
            toast.success(response.data);
            setSuccessMessage(response.data);
        } catch (error) {
            const errorMessage = error.response?.data || "Error al solicitar el restablecimiento de contraseña";
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="container my-5 flex justify-center items-center">
            <ToastContainer />
            <div className="bg-white shadow-md rounded-lg p-8 w-96 border border-gray-300">
                <div className="text-center mb-5">
                    <h2 className="text-2xl font-bold text-gray-800">Solicitar Restablecimiento de Contraseña</h2>
                </div>
                <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700">
                        Enviar Correo de Restablecimiento
                    </button>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default PasswordResetRequest;