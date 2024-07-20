import { useNavigate } from "react-router-dom";
import { CogIcon, UserMinusIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { URIUser } from "./components/Urls";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function AccountComponent() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (Cookies.get('session')) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${URIUser}${Cookies.get('UserId')}`);
          setUser(response.data);
          setFormData(response.data); // Set formData with initial user data
        } catch (error) {
          console.log(error);
        }
      };
      fetchUser();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      console.log('FormData updated:', updatedData);
      return updatedData;
    });
  };
  

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`${URIUser}${user.id}`, formData);
      toast.success('Perfil actualizado exitosamente');
      setIsEditing(false);
      setUser(formData); // Update user data
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      toast.error('Error actualizando perfil');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(user); // Reset form data to original user data
  };

  const handleChangePassword = () => {
    navigate("/reset-password");
  };

  const handleViewPurchaseHistory = () => {
    navigate('/order-history');
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`${URIUser}${user.id}`);
      toast.success('Cuenta eliminada exitosamente');
      navigate('/login');
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      toast.error('Error al eliminar la cuenta');
    }
  };

  const confirmDelete = () => {
    confirmAlert({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar tu cuenta?',
      buttons: [
        {
          label: 'Sí',
          onClick: handleDeleteUser
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  return (
    <>
      <ToastContainer />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-3">
            <div className="card">
              <div className="card-header">
                <h4>Opciones de Cuenta</h4>
              </div>
              <div className="card-body">
                <button
                  onClick={handleChangePassword}
                  className="btn btn-secondary w-100 mb-2"
                >
                  <CogIcon className="h-5 w-5 d-inline-block me-2" />
                  Cambiar contraseña
                </button>
                <button
                  onClick={confirmDelete}
                  className="btn btn-danger w-100"
                >
                  <UserMinusIcon className="h-5 w-5 d-inline-block me-2" />
                  Eliminar su cuenta
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="card">
              <div className="card-header">
                <h4>Perfil de Usuario</h4>
              </div>
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">ID:   {formData.id || ''}</label>            
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Apellido</label>
                    <input
                      type="text"
                      className="form-control"
                      name="last"
                      value={formData.last || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email || ''}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password || ''}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <input
                      type="text"
                      className="form-control"
                      name="role"
                      value={formData.role || ''}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      className="form-control"
                      name="birth"
                      value={formData.birth || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSave}
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={handleCancel}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={handleEdit}
                    >
                      Editar
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountComponent;
