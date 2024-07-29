import { useState, useEffect } from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de react-toastify
import { URIUser } from "./components/Urls";
import { decryptValue,encryptionKey } from "./components/hashes";

import Cookies from 'js-cookie';

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [user, setUser] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (decryptValue(Cookies.get('$3s1.4'),encryptionKey)) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${URIUser}${decryptValue(Cookies.get('#gt156'),encryptionKey)}`);
          setUser(response.data);
          //setFormData(response.data); // Set formData with initial user data
        } catch (error) {
          console.log(error);
        }
      };
      fetchUser();
    }
  }, []);
  // Función para manejar el cambio de contraseña
  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${URIUser}${user.id}/password`, // Usar URIUser para la URL
        { password : newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Éxito al cambiar la contraseña
      toast.success('Contraseña cambiada exitosamente');
      setSuccessMessage('Contraseña cambiada exitosamente');
      setError("");
    } catch (error) {
      // Manejar errores
      toast.error( 'Error al cambiar la contraseña');
      setError('Error al cambiar la contraseña');
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
    <div className="container my-5 Principal f_principal" >
      <ToastContainer />
      <div className="row justify-content-center border_principal rounded-4 w-50 mx-auto">
        <div className="col-md-8">
          <div className="text-center my-3">
            <span className="h2 py-2">
              Restablecer Contraseña
            </span>
          </div>
          <form onSubmit={validateAndSubmit} className="form-group my-5">
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">Nueva Contraseña</label>
              <div className="input-group">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={passwordVisible ? "text" : "password"}
                  autoComplete="off"
                  required
                  className="form-control border_principal"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                />
                <span className="input-group-text border_principal" onClick={togglePasswordVisibility}>
                  {passwordVisible ? <IconEyeOff color="gray" size={24} /> : <IconEye color="gray" size={24} />}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirmar Nueva Contraseña</label>
              <div className="input-group">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={confirmPasswordVisible ? "text" : "password"}
                  autoComplete="off"
                  required
                  className="form-control border_principal"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                <span className="input-group-text border_principal" onClick={toggleConfirmPasswordVisibility}>
                  {confirmPasswordVisible ? <IconEyeOff color="gray" size={24} /> : <IconEye color="gray" size={24} />}
                </span>
              </div>
            </div>

            <button type="submit" className="btn bg_secundario Blanco w-100">
              Restablecer Contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
