import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import "react-toastify/dist/ReactToastify.css";
import { URIUser } from "./components/Urls";

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // El token se obtiene de los parámetros de la URL
  const token = window.location.pathname.split("/").pop(); // Asumiendo que la URL es algo como /reset-password/:token

  // Función para manejar el cambio de contraseña
  const handleChangePassword = async () => {
    try {
      await axios.patch(
        `${URIUser}reset-password/${token}`, // Endpoint para actualizar la contraseña con el token
        { password: newPassword }
      );
      // Éxito al cambiar la contraseña
      toast.success("Contraseña cambiada exitosamente");
      setSuccessMessage("Contraseña cambiada exitosamente");
      setError("");
    } catch (error) {
      // Manejar errores
      const errorMessage = error.response?.data || "Error al cambiar la contraseña";
      toast.error(errorMessage);
      setError(errorMessage);
      setSuccessMessage("");
    }
  };

  // Manejadores de cambio de campos
  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  // Funciones para alternar la visibilidad de las contraseñas
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // Validar y enviar el formulario
  const validateAndSubmit = (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      toast.error("Las contraseñas no coinciden");
    } else if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      toast.error("La contraseña debe tener al menos 8 caracteres");
    } else {
      setError("");
      handleChangePassword();
    }
  };

  return (
    <div className="container my-5 flex justify-center items-center">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-lg p-8 w-96 border border-gray-300">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-bold text-gray-800">Restablecer Contraseña</h2>
        </div>
        <form onSubmit={validateAndSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={passwordVisible ? "text" : "password"}
                autoComplete="off"
                required
                className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1"
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={togglePasswordVisibility}>
                {passwordVisible ? <IconEyeOff color="gray" size={24} /> : <IconEye color="gray" size={24} />}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={confirmPasswordVisible ? "text" : "password"}
                autoComplete="off"
                required
                className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={toggleConfirmPasswordVisibility}>
                {confirmPasswordVisible ? <IconEyeOff color="gray" size={24} /> : <IconEye color="gray" size={24} />}
              </span>
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700">
            Restablecer Contraseña
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;