import { useState } from "react";
import axios from 'axios';
import { IconEye, IconEyeOff } from "@tabler/icons-react";

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Nuevo estado para el mensaje de éxito

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token almacenado en el localStorage
      await axios.post(
        `${import.meta.env.VITE_API_URL}/change-password`, { newPassword: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Éxito al cambiar la contraseña
      setSuccessMessage('Contraseña cambiada exitosamente');
      setError(""); // Limpiar el mensaje de error
    } catch (error) {
      // Manejar errores
      setError(error.response.data); // Establecer el mensaje de error desde la respuesta del servidor
      setSuccessMessage(""); // Limpiar el mensaje de éxito
    }
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const validateAndSubmit = (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
    } else {
      setError("");
      handleChangePassword();
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Restablecer Contraseña
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          action="#"
          method="POST"
          onSubmit={validateAndSubmit}
        >
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}


          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Nueva Contraseña
            </label>
            <div className="relative mt-2">
              <input
                id="newPassword"
                name="newPassword"
                type={passwordVisible ? "text" : "password"} // Cambia el tipo según el estado de passwordVisible
                autoComplete="off"
                required
                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6"
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                {passwordVisible ? (
                  <IconEyeOff
                    color="gray"
                    size={24}
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <IconEye
                    color="gray"
                    size={24}
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Confirmar Nueva Contraseña
            </label>
            <div className="relative mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={confirmPasswordVisible ? "text" : "password"} // Cambia el tipo según el estado de passwordVisible
                autoComplete="off"
                required
                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                {confirmPasswordVisible ? (
                  <IconEyeOff
                    color="gray"
                    size={24}
                    onClick={toggleConfirmPasswordVisibility}
                  />
                ) : (
                  <IconEye
                    color="gray"
                    size={24}
                    onClick={toggleConfirmPasswordVisibility}
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Restablecer Contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
