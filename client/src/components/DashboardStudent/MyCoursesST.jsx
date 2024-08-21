import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, ListGroup, ListGroupItem } from'react-bootstrap';
import axios from'axios';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast, ToastContainer } from'react-toastify';
import Cookies from 'js-cookie';
import { confirmAlert } from 'react-confirm-alert';
import { decryptValue, encryptionKey } from '../hashes';
import { UriCursos, uriestudisubject, UriLesson, 
         uritutor, uritutorsubject, URIUser,
         uriestudiclasses } from'../Urls';
import { FaPlus, FaTrash } from'react-icons/fa'; 
import { CiBookmarkPlus } from "react-icons/ci";

const MyCoursesST = () => {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [misCursos, setMisCursos] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [sessionesD,setSessionesD] = useState([]); 
  const [add, setAdd] = useState(false);
  const [UserId, setUserId] = useState(0);
  const pre = '/images/';

  const handleClose = () => setShow(false);
  const handleShow = async (course) => {
    setSelectedCourse(course);
    await tutorSubjects(course.id_subject); 
    setShow(true);
  };

  const handleShow2 = async (tutor) => {
    setSelectedTutor(tutor)
    await tutorSessions(tutor.id_tutor)
    setShow2(true)
  }
  const tutorSessions = async (TutorId) => {
      try {
        const response = await axios.get(`${UriLesson}/${TutorId}`)
        setSessionesD(response.data)
      } catch (error) {
        
      }
  }
  const handleClose2 = () => {
    setShow2(false);
    setSessionesD([])
  }
/**aqui llamamos las materias y filtramos las que no ha seleccionado*/
  useEffect(() => {
    const fetchCurses = async () => {
      try {
        const response = await axios.get(UriCursos);
        const cursos = response.data;

        const filteredCursos = cursos.filter(curso =>
          !misCursos.some(course => course.id_subject === curso.id)
        );

        setMaterias(filteredCursos);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurses();
  }, [misCursos]);
  /**aqui llamamos las materias y filtramos las que ha seleccionado*/
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const userId = decryptValue(Cookies.get('#gt156'), encryptionKey);
        setUserId(userId);
        const response = await axios.get(`${uriestudisubject}/${userId}`);
        const EstudiSubjects = response.data;
        
        const coursesData = await Promise.all(
          EstudiSubjects.map(async (tutorSubject) => {
            const courseResponse = await axios.get(`${UriCursos}/${tutorSubject.id_subject}`);
            return {
              ...courseResponse.data,
              ...tutorSubject
            };
          })
        );
        setMisCursos(coursesData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSubject();
    setAdd(false);
  }, [add]);
  
  
  const tutorSubjects = async (subjectId) => {
    try {
      const response = await axios.get(uritutorsubject);
      
      const filteredTutors = response.data.filter(ts => ts.id_subject === subjectId);
      const completeTutors = await Promise.all(filteredTutors.map(async (tutor) => {
        const tutorDetails = (await axios.get(`${uritutor}/teacher/${tutor.id_tutor}`)).data;
        const userDetails = (await axios.get(`${URIUser}${tutorDetails.user_id}`)).data;
        return {
          ...tutorDetails,
          ...userDetails,
          ...tutor
        };
      }));
      setTutors(completeTutors);
    } catch (error) {
      console.error(error);
    }
  };
  const moveToMisCursos = (materia) => {
    const addCourse = async (courseId) => {
      try {
        await axios.post(uriestudisubject, {
          "estudi_id": UserId,
          "subject_id": courseId
        });
        setShow2(false);
        setAdd(true);
      } catch (error) {
        console.error('Error adding course:', error);
      }
    };
    addCourse(materia.id)
  };
  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(uriestudisubject + '/' + id);
      toast.success('Curso Eliminado exitosamente');
      setAdd(true);
    } catch (error) {
      console.log(error);
    }
  };
  const confirmDelete = (curso) => {
    confirmAlert({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar el curso?  si ya llev@ alguna sesion con este curso perderan los datos ',
      buttons: [
        {
          label: 'Sí',
          onClick: () => { handleDeleteCourse(curso.id) },
        },
        {
          label: 'No',
          onClick: () => { },
        },
      ],
    });
  };
  const handleAddClass = (sesion) =>{
    
    const agregarSesion = async(sesionId) => {
      try {
        const x = await axios.get(uriestudiclasses);
        
        const verificar = x.data;
        // Verificar si existe alguna sesión activa con los mismos parámetros
        const sesionActiva = verificar.find(sesion => 
          parseInt(sesion.student_id) === parseInt(UserId) && 
          parseInt(sesion.class_id) === parseInt(sesionId) && 
          sesion.active 
        );
        if (sesionActiva) {
          // Si la sesión ya está activa, muestra un mensaje de advertencia
          toast.warning('Ya tienes esta sesión agregada.');
        } else {
          // Si no hay una sesión activa, procede a guardar la nueva sesión
          const response = await axios.post(uriestudiclasses, {
            student_id: parseInt(UserId),
            class_id: parseInt(sesionId)
          });
    
          // Mostrar mensaje de éxito
          toast.success('Sesión agregada con éxito');
          setShow2(false) // Descomentar si quieres cerrar el modal o hacer alguna acción adicional
        }
      } catch (error) {
        // Manejo de errores
        console.error('Error al agregar sesión:', error);
        toast.error('Ocurrió un error al agregar la sesión.');
      }
    };
    
    agregarSesion(sesion.id);
  }
  return (
    <>
    <ToastContainer />
    <div>
      <span className='h3 Principal f_principal'>Cursos</span>
    </div>
    <div className="row">
      <div className='col-md-8'>
        <h5 className='my-2 Principal'>Mis Cursos</h5>
        <div className='row'>
            {misCursos.length !== 0 ? (
              misCursos.map(curso => (
                <div key={curso.id}className=''>
                  <Card title={curso.description}>
                    <Card.Body>
                      <div className='d-flex justify-content-center'>
                        <img src={pre + curso.imagen} 
                             alt={curso.name} 
                             className="card-img-top" 
                             style={{ height: 100, width: 300 }}/>
                      </div>
                      <Card.Title className='Principal'>{curso.name}</Card.Title>
                      <div className='d-flex justify-content-center'>
                        <Button variant="primary" 
                                className='bg_principal Blanco me-2' 
                                onClick={() => { handleShow(curso) }}>
                          Más información
                        </Button>
                        <Button variant="danger" 
                                className='Blanco'
                                style={{backgroundColor:'red'}} 
                                onClick={() => confirmDelete(curso)} 
                                title="Quitar de mis Cursos">
                          <FaTrash /> 
                        </Button>
                      </div>
                    </Card.Body>
                  </Card></div>
              ))
            ) : (<div className='my-5 Secundario'>No has Agregado Ningún Curso</div>)}
          </div>
        </div>
        <div className='col-md-4'>
          <h5 className='my-2 Principal'>Otros Cursos</h5>
          <ListGroup>
            {materias.length !== 0 ? (
              materias.map(materia => (
                <ListGroupItem key={materia.id} 
                               className="d-flex justify-content-between align-items-center">
                  <div className='d-flex justify-content-center'>
                    <button className='me-3'
                            onClick={() => moveToMisCursos(materia)} 
                            title="Agregar a Mis Cursos">
                      <CiBookmarkPlus className='Secundario'/>
                    </button>
                    <span>{materia.name}</span>
                  </div>
                </ListGroupItem>
              ))
            ) : (<div className='my-5 Secundario'>Ya No hay más Cursos Disponibles</div>)}
          </ListGroup>
        </div>
      </div>
      <Modal show={show} onHide={handleClose} size="md" fullscreen>
        <Modal.Header>
          <Modal.Title className='mx-auto Principal'>{selectedCourse?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mt-1 mb-3'>
            <dt className='Principal'>Descripción del Curso:</dt>
            <dd className='Secundario'>- {selectedCourse?.description}</dd>
          </div>
          <div className='mt-1 mb-3'>
            <dt  className='Principal'>Tutores Disponibles:</dt>
            {tutors.length > 0 ? (
              <ol>
                {tutors.map(tutor => (
                  <li key={tutor.id}>
                    <button className='Secundario' onClick={()=>{handleShow2(tutor)}} title={'Ver sesiones disponibles de '+tutor.name}>
                      - {tutor.name}  {tutor.last}
                      </button>
                  </li>
                ))}
              </ol>
            ) : (
              <p>No hay tutores disponibles para este curso.</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className='bg_secundario' onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show2} onHide={handleClose2}>
  <Modal.Header closeButton>
    <Modal.Title className='Principal'>{selectedTutor?.name + ' ' + selectedTutor?.last}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div>
      <span className='Secundario ms-2'>Sesiones Disponibles de {selectedTutor?.name}:</span>
      {sessionesD.length !== 0 ? (
        <table className='table mt-3'>
          <thead >
            <tr >
              <th className='Principal'>Descripción</th>
              <th className='Principal'>Día</th>
              <th className='Principal'>Hora Inicio</th>
              <th className='Principal'>Hora Fin</th>
              <th className='Principal'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sessionesD.map(materia => (
              <tr key={materia.id}>
                <td className='Secundario'>{materia.description}</td>
                <td className='Secundario'>{format(parseISO(materia.start_time), 'dd/MM/yy', { locale: es })}</td>
                <td className='Secundario'>{format(parseISO(materia.start_time), 'hh:mm aa', { locale: es })}</td>
                <td className='Secundario'>{format(parseISO(materia.end_time), 'hh:mm aa', { locale: es })}</td>
                <td className='Secundario'>
                  <div className='d-flex justify-content-center'>
                    <Button variant="primary" className='bg_principal Blanco rounded-5 p-2' title="Agregar Sesión"
                            onClick={()=>{handleAddClass(materia)}}>
                      <FaPlus />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay Sesiones Disponibles</p>
      )}
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" className='bg_secundario' onClick={handleClose2}>
      Cerrar
    </Button>
  </Modal.Footer>
</Modal>

    </>
  );
};

export default MyCoursesST;