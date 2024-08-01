// ... otras importaciones
import { useNavigate } from "react-router-dom";
import { CogIcon, UserMinusIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import { encryptionKey, decryptValue } from './components/hashes';
import { useEffect, useState } from "react";
import { URIUser, uritutor } from "./components/Urls";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';

function AccountComponent() {
  const navigate = useNavigate();
  const pre = '/images/'
  const [user, setUser] = useState({});
  const [tutorData, setTutorData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTutor, setIsEditingTutor] = useState(false);
  const [formData, setFormData] = useState({});
  const [formDataTutor, setFormDataTutor] = useState({});
  const [isTutor, setIsTutor] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if(Cookies.get('$3s1.4')){
        if (decryptValue(Cookies.get('$3s1.4'),encryptionKey)) {
          try {
            const response = await axios.get(`${URIUser}${decryptValue(Cookies.get('#gt156'),encryptionKey)}`);
            const data = response.data;
            const formattedDate = format(new Date(data.birth), 'yyyy-MM-dd'); 
            data.birth = formattedDate;
            if (data.role === 'tutor') {
              setIsTutor(true);
              const fetchTutor = async () => {
                try {
                  const response = await axios.get(`${uritutor}/${data.id}`);
                  setTutorData(response.data);
                  setFormDataTutor(response.data);
                } catch (error) {
                  console.log(error);
                }
              };
              fetchTutor();
            }
            setUser(data);
            setFormData(data);
          } catch (error) {
            console.error(error);
          }
        }
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeTutor = (e) => {
    const { name, value } = e.target;
    setFormDataTutor((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditTutor = () => {
    setIsEditingTutor(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`${URIUser}${user.id}`, formData);
      toast.success('Perfil actualizado exitosamente');
      setIsEditing(false);
      setUser(formData);
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      toast.error('Error actualizando perfil');
    }
  };

  const handleSaveTutor = async () => {
    try {
      await axios.put(`${uritutor}/${tutorData.id}`, formDataTutor);
      toast.success('Perfil de tutor actualizado exitosamente');
      setIsEditingTutor(false);
      setTutorData(formDataTutor);
    } catch (error) {
      console.error('Error actualizando perfil de tutor:', error);
      toast.error('Error actualizando perfil de tutor');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(user);
  };

  const handleCancelTutor = () => {
    setIsEditingTutor(false);
    setFormDataTutor(tutorData);
  };

  const handleChangePassword = () => {
    navigate("/reset-password");
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
          onClick: handleDeleteUser,
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <>
      <ToastContainer />
      <div className="container my-5">
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
            <div className="card Principal f_principal border_principal mb-3">
              <div className="card-header">
                <div className="my-2 py-2">
                  <span className="h3">Perfil de Usuario</span>
                </div>
              </div>
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">ID: {formData.id || ''}</label>
                    <br />
                  </div>
                  <div className="row">
                    <div className="col-4">
                      <img src={`${pre}${formData.imagen_perfil}`} alt={formData.imagen_perfil} className="mt-2 rounded-4"/>
                      <select
                        className="form-control mt-2"
                        name="imagen_perfil"
                        value={formData.imagen_perfil || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                      >
                        <option value="perfil.jpg">Imagen de Perfil</option>
                        <option value="tutor1.jpg">Perfil Masculino</option>
                        <option value="tutor2.jpg">Perfil Femenino</option>
                      </select>
                    </div>
                    <div className="col-8">
                      <div className="mb-3">
                        <label className="form-label float-start">Nombre</label>
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
                        <label className="form-label float-start">Género</label>
                        <select
                          className="form-control"
                          name="gender"
                          value={formData.gender || ''}
                          onChange={handleChange}
                          disabled={!isEditing}
                        >
                          <option value="">Selecciona el género</option>
                          <option value="Male">Masculino</option>
                          <option value="Female">Femenino</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  
                  <div className="mb-3">
                    <label className="form-label float-start">Correo Electrónico</label>
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
                        className="btn bg_principal Blanco"
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
            {isTutor && (
              <div className="card Principal f_principal border_principal">
                <div className="card-header">
                  <div className="my-2 py-2">
                    <span className="h3">Perfil de Tutor</span>
                  </div>
                </div>
                <div className="card-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">ID: {formDataTutor.id || ''}</label>
                      <br />
                    </div>
                    <div className="mb-3">
                      <label className="form-label float-start">Bio</label>
                      <textarea
                        className="form-control"
                        name="bio"
                        value={formDataTutor.bio || ''}
                        onChange={handleChangeTutor}
                        disabled={!isEditingTutor}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label float-start">Experiencia</label>
                      <textarea
                        className="form-control"
                        name="experience"
                        value={formDataTutor.experience || ''}
                        onChange={handleChangeTutor}
                        disabled={!isEditingTutor}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label float-start">Disponibilidad</label>
                      <input
                        type="text"
                        className="form-control"
                        name="availability"
                        value={formDataTutor.availability || ''}
                        onChange={handleChangeTutor}
                        disabled={!isEditingTutor}
                      />
                    </div>
                    {isEditingTutor ? (
                      <>
                        <button
                          type="button"
                          className="btn bg_principal Blanco"
                          onClick={handleSaveTutor}
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          className="btn bg_secundario Blanco ms-2"
                          onClick={handleCancelTutor}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn bg_terciario"
                        onClick={handleEditTutor}
                      >
                        Editar
                      </button>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountComponent;
