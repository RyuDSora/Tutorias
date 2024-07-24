import { useNavigate } from "react-router-dom";
import { CogIcon, UserMinusIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { URIUser, uritutor } from "./components/Urls";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { format } from 'date-fns';

function AccountComponent() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [tutor,setTutor] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (Cookies.get('session')) {
        try {
          const response = await axios.get(`${URIUser}${Cookies.get('UserId')}`);
          const data = response.data;
          console.log(data.birth);
          const formattedDate = format(new Date(data.birth), 'yyyy-MM-dd'); 
          data.birth = formattedDate;
          if(data.role==='tutor'){
            setTutor(true);
            const fetchTutor = async () =>{
              try {
                const response = await axios.get(`${uritutor}${data.id}`);
                console.log(response.data);
              } catch (error) {
                console.log(error);
              }
            }
            fetchTutor();
          }
          console.log(tutor);
          setUser(data);
          setFormData(data); 
        } catch (error) {
          console.error(error); 
        }
      }
    };

    fetchUser();
  }, [Cookies.get('session')])

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
      <div className="container my-5 ">
        <div className="row">
          <div className="col-md-3">
            <div className="card Principal f_principal border_principal">
              <div className="card-header Principal f_principal">
                <h4>Opciones de Cuenta</h4>
              </div>
              <div className="card-body">
                <button
                  onClick={handleChangePassword}
                  className="btn bg_secundario Blanco w-100 mb-2"
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
            <div className="card Principal f_principal border_principal ">
              <div className="card-header ">
                <div className="my-2 py-2">
                  <span className="h3">Perfil de Usuario</span>
                </div>
              </div>
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">ID:   {formData.id || ''}</label>
                    <br />            
                  </div>
                  <div className="mb-3">
                    <label className="form-label float-start">Nombre</label>
                    <input
                      type="text"
                      className="form-control "
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label float-start">Apellido</label>
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
                    <label className="form-label float-start" >Correo Electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email || ''}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label float-start">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password || ''}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label float-start">Rol</label>
                    <input
                      type="text"
                      className="form-control"
                      name="role"
                      value={formData.role || ''}
                      disabled
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label float-start">Fecha de Nacimiento</label>
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
                        className="btn bg_principal Blanco "
                        onClick={handleSave}
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="btn bg_secundario Blanco ms-2"
                        onClick={handleCancel}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn bg_terciario"
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
