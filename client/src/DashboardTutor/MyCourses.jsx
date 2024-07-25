import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, ListGroup } from 'react-bootstrap';
import { UriCursos, uritutorsubject, uritutor } from '../components/Urls';
import { confirmAlert } from 'react-confirm-alert';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const MyCourses = () => {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [cursosSelect, setCursosSelect] = useState([]);
  const [tutorId,setTutorId]= useState(0);
  const [add, setAdd] = useState(false);
  const pre = '/images/';
  useEffect(() => {
    const fetchCurses = async () => {
      try {
        const response = await axios.get(UriCursos);
        const cursos = response.data;

        // Filtra los cursos disponibles eliminando los que ya están en `courses`
        const filteredCursos = cursos.filter(curso =>
          !courses.some(course => course.id_subject === curso.id)
        );

        setCursosSelect(filteredCursos);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurses();
  }, [courses]);

  useEffect(() => {
    const fetchSubject = async () => {
        try {
          //recupera el id del usuario de las cookies
          const userId = Cookies.get('UserId');
          //recupera los datos del tutor de la base de datos
          const responsetutor = await axios.get(`${uritutor}/${userId}`);
          //recupera el idtutor del response
          const idTutor = responsetutor.data.id;
          setTutorId(responsetutor.data.id);

          //recupera los cursos por tutor
          const responseTutorSubjects = await axios.get(`${uritutorsubject}/${idTutor}`);
          const tutorSubjects = responseTutorSubjects.data;
          //recupera la informacion de cada curso segun la lista anterior y lo agrega como nueva informacion al mismo json
          const coursesData = await Promise.all(
            tutorSubjects.map(async (tutorSubject) => {
              const courseResponse = await axios.get(`${UriCursos}/${tutorSubject.id_subject}`);
              return {
                ...courseResponse.data,
                ...tutorSubject // Aquí se agregan los datos del tutorSubject
              };
            })
          );
          setCourses(coursesData)
        } catch (error) {
          console.error(error);
        }
      
    };

    fetchSubject();
    setAdd(false);
  }, [add]);

  const handleClose = () => setShow(false);
  const handleClose2 = () => setShow2(false);
  const handleShow = (course) => {
    setSelectedCourse(course);
    setShow(true);
  };
  const handleShow2 = () => setShow2(true);

  const handleDeleteCourse = async (id) =>{
    try {
      await axios.delete(uritutorsubject+'/'+id);
      toast.success('eliminada exitosamente');
      setAdd(true);
    } catch (error) {
      console.log(error);
    }
  } 


  const confirmDelete = (id) => {
    confirmAlert({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar el curso?',
      buttons: [
        {
          label: 'Sí',
          onClick: () => {handleDeleteCourse(id)},
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  const addCourse = (courseId) => {
   
    try {
      axios.post(uritutorsubject, {
        "teacher_id" : tutorId,
        "subject_id": courseId
      });
      // Actualiza la lista de cursos después de agregar un nuevo curso
      setShow2(false);
      setAdd(true);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  return (
    <>
      <div><span className='h3 Principal f_principal'>Tus Cursos</span></div>
      <div className='row justify-content-end py-3'>
        <Button variant="secondary" className='bg_principal Blanco w-25' onClick={handleShow2}>
          Agregar Nuevo Curso
        </Button>
      </div>
      <div className="row">
        {courses.map(course => (
          <div key={course.id} className="col-md-4 mb-4">
            <Card >
              <Card.Body>
                <img src={pre+course.imagen} alt={course.name} className="card-img-top" style={{height:100,width:300}}/>
                <Card.Title className='Principal'>{course.name}</Card.Title>
                <Button variant="primary" className='bg_secundario Blanco' onClick={() => handleShow(course)}>
                  Más información
                </Button>
                <Button variant="secondary" className='bg_terciario Negro mx-2' onClick={()=>{confirmDelete(course.id)}}>
                  Eliminar
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCourse?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourse?.description}
          <div className='my-2'>
            <ListGroup>
                <ListGroup.Item>
                  <span>aqui van las sesiones ya programadas para este curso de {selectedCourse?.name}</span>
                </ListGroup.Item>
            </ListGroup>
          </div>
          <div className='my-2 d-flex justify-content-end'>
            <Button variant="secondary bg_principal Blanco" >
              Agregar Sesión
            </Button>  
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} className='bg_secundario'>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title className='Principal f_principal'>Selecciona un curso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {cursosSelect.map(course => (
              <ListGroup.Item key={course.id} >
                <div className='d-flex justify-content-between'>
                  <div>{course.id + ".- "}{course.name}</div>
                <Button variant="secondary bg_principal Blanco" onClick={()=>{addCourse(course.id)}} >
                  +
                </Button> 
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
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

export default MyCourses;
