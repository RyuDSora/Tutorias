import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, ListGroup, ListGroupItem } from'react-bootstrap';
import axios from'axios';
import { format, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast, ToastContainer } from'react-toastify';
import { UriCursos, UriLesson, uritutor, uritutorsubject, URIUser } from'../Urls';
import { FaArrowRight, FaArrowLeft, FaPlus } from'react-icons/fa'; // Importar íconos de flechas
const MyCoursesST = () => {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [misCursos, setMisCursos] = useState([]);
  const [tutors, setTutors] = useState([]); // Para almacenar los tutores disponibles
  const [sessionesD,setSessionesD] = useState([]); 
  const pre = '/images/';

  const handleClose = () => setShow(false);
  const handleShow = async (course) => {
    setSelectedCourse(course);
    await tutorSubjects(course.id); // Llamar a tutorSubjects antes de mostrar el modal
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const materiasResponse = await axios.get(UriCursos);
        setMaterias(materiasResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
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
    setMisCursos([...misCursos, materia]);
    setMaterias(materias.filter((m) => m.id !== materia.id));
  };
  const moveToOtrosCursos = (curso) => {
    setMaterias([...materias, curso]);
    setMisCursos(misCursos.filter((c) => c.id !== curso.id));
  };

  return (
    <>
    <ToastContainer />
    <div>
      <span className='h3 Principal f_principal'>Tus Cursos</span>
    </div>
    <div className="row">
      <div className='col-md-8'>
        <h5>Mis Cursos</h5>
        <div className='row'>
            {misCursos.length !== 0 ? (
              misCursos.map(curso => (
                <div key={curso.id}className=''>
                  <Card>
                    <Card.Body>
                      <div className='d-flex justify-content-center'>
                        <img src={pre + curso.imagen} 
                             alt={curso.name} 
                             className="card-img-top" 
                             style={{ height: 100, width: 300 }}/>
                      </div>
                      <Card.Title className='Principal'>{curso.name}</Card.Title>
                      <Button variant="primary" 
                              className='bg_principal Blanco me-2' 
                              onClick={() => { handleShow(curso) }}>
                        Más información
                      </Button>
                      <Button variant="secondary" 
                              className='bg_secundario Blanco' 
                              onClick={() => moveToOtrosCursos(curso)} 
                              title="Mover a Otros Cursos">
                        <FaArrowLeft /> 
                      </Button>
                    </Card.Body>
                  </Card></div>
              ))
            ) : (<>No has Agregado Ningún Curso</>)}
          </div>
        </div>
        <div className='col-md-4'>
          <h5>Otros Cursos</h5>
          <ListGroup>
            {materias.length !== 0 ? (
              materias.map(materia => (
                <ListGroupItem key={materia.id} 
                               className="d-flex justify-content-between align-items-center">
                  <span>{materia.name}</span>
                  <Button variant="primary" 
                          className='bg_secundario Blanco' 
                          onClick={() => moveToMisCursos(materia)} 
                          title="Mover a Mis Cursos">
                    <FaArrowRight /> {/* Flecha hacia la derecha */}
                  </Button>
                </ListGroupItem>
              ))
            ) : (<>Ya No hay más Cursos Disponibles</>)}
          </ListGroup>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCourse?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <span>Descripción del Curso:</span>
            <p>{selectedCourse?.description}</p>
          </div>
          <div>
            <span>Tutores Disponibles:</span>
            {tutors.length > 0 ? (
              <ul>
                {tutors.map(tutor => (
                  <li key={tutor.id}>
                    <button onClick={()=>{handleShow2(tutor)}} title={'Ver sesiones disponibles de '+tutor.name}>
                      - {tutor.name}  {tutor.last}
                      </button>
                  </li>
                ))}
              </ul>
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
          <Modal.Title>{selectedTutor?.name+' '+selectedTutor?.last}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <span>Sesiones Disponibles de {selectedTutor?.name}:</span>
            <ListGroup>
            {sessionesD.length !== 0 ? (
              sessionesD.map(materia => (
                <ListGroupItem key={materia.id} 
                               className="d-flex justify-content-between align-items-center">
                  <div>
                    <span>Descripcion: {materia.description}</span>
                    <br /><span>Hora Inicio: {format(parseISO(materia.start_time), 'EEEE dd/MM/yy hh:mm aa', { locale: es })}</span>
                    <br /><span>Hora Final: {format(parseISO(materia.end_time), 'EEEE dd/MM/yy hh:mm aa', { locale: es })}</span>
                  </div>
                  <Button variant="primary" 
                          className='bg_secundario Blanco' 
                          
                          title="Agregar Sesion">
                    <FaPlus /> {/* Flecha hacia la derecha */}
                  </Button>
                </ListGroupItem>
              ))
            ) : (<>No hay Seciones Disponibles</>)}
          </ListGroup>
          </div>
          <div>
            
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
