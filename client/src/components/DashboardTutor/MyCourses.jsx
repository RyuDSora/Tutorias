import { useEffect, useState } from 'react';
import { Card, Button, Modal, ListGroup, Form } from 'react-bootstrap';
import { UriCursos, uritutorsubject, uritutor, createEventEndpoint, urigoogle,url } from '../Urls'; // Actualiza el import
import { confirmAlert } from 'react-confirm-alert';
import Cookies from 'js-cookie';
import { decryptValue, encryptionKey } from '../hashes';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const MyCourses = () => {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [cursosSelect, setCursosSelect] = useState([]);
  const [tutorId, setTutorId] = useState(0);
  const [add, setAdd] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  });
  const pre = '/images/';

  useEffect(() => {
    const fetchCurses = async () => {
      try {
        const response = await axios.get(UriCursos);
        const cursos = response.data;

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
        const userId = decryptValue(Cookies.get('#gt156'), encryptionKey);
        const responsetutor = await axios.get(`${uritutor}/${userId}`);
        const idTutor = responsetutor.data.id;
        setTutorId(responsetutor.data.id);

        const responseTutorSubjects = await axios.get(`${uritutorsubject}/${idTutor}`);
        const tutorSubjects = responseTutorSubjects.data;
        const coursesData = await Promise.all(
          tutorSubjects.map(async (tutorSubject) => {
            const courseResponse = await axios.get(`${UriCursos}/${tutorSubject.id_subject}`);
            return {
              ...courseResponse.data,
              ...tutorSubject
            };
          })
        );
        setCourses(coursesData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSubject();
    setAdd(false);
  }, [add]);

  const handleClose = () => {
    setShow(false);
    setNewSession({
      title: '',
      description: '',
      startTime: '',
      endTime: ''
    });
  };

  const handleClose2 = () => setShow2(false);

  const handleShow = (course) => {
    setSelectedCourse(course);
    setShow(true);
  };

  const handleShow2 = () => setShow2(true);

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(uritutorsubject + '/' + id);
      toast.success('Eliminado exitosamente');
      setAdd(true);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar el curso?',
      buttons: [
        {
          label: 'Sí',
          onClick: () => { handleDeleteCourse(id) },
        },
        {
          label: 'No',
          onClick: () => { },
        },
      ],
    });
  };

  const addCourse = async (courseId) => {
    try {
      await axios.post(uritutorsubject, {
        "teacher_id": tutorId,
        "subject_id": courseId
      });
      setShow2(false);
      setAdd(true);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleAddSession = async () => {
    const { title, description, startTime, endTime } = newSession;
    
    
    if (selectedCourse && title && description && startTime && endTime) {
      try {
        // Ajusta el formato de fecha y hora para que se envíe correctamente
        const formattedStartTime = new Date(startTime).toISOString();
        const formattedEndTime = new Date(endTime).toISOString();
        //creamos la sesion en calendar de google
        const response = await axios.post(`${urigoogle}/create-event`, {
          title,
          description,
          start_time: formattedStartTime,
          end_time: formattedEndTime
        });

        // Verifica si la respuesta contiene la URL de Google Meet
        if (!response.data || !response.data.meetingUrl) {
          throw new Error('No se recibió la URL de Google Meet');
        }

        const googleMeetLink = response.data.meetingUrl;
        
        
        // Luego, guarda la sesión en la base de datos
        await axios.post(`${urigoogle}/save-session`, {
          teacher_id: tutorId,  // Asegúrate de pasar el ID correcto del profesor
          subject_id: selectedCourse.id_subject,
          title: title,
          description: description,
          start_time: formattedStartTime,
          end_time: formattedEndTime,
          googleMeetLink
        });

        toast.success('Sesión agregada exitosamente');
        setShow(false);
        setAdd(true);
      } catch (error) {
        console.error('Error adding session:', error);
        toast.error('Error al agregar la sesión');
      }
    } else {
      toast.error('Por favor, complete todos los campos');
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
            <Card>
              <Card.Body>
                <img src={pre + course.imagen} alt={course.name} className="card-img-top" style={{ height: 100, width: 300 }} />
                <Card.Title className='Principal'>{course.name}</Card.Title>
                <Button variant="primary" className='bg_secundario Blanco' onClick={() => handleShow(course)}>
                  Más información
                </Button>
                <Button variant="secondary" className='bg_terciario Negro mx-2' onClick={() => { confirmDelete(course.id) }}>
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
                <span>Aquí van las sesiones ya programadas para este curso de {selectedCourse?.name}</span>
              </ListGroup.Item>
            </ListGroup>
          </div>
          <div className='my-2'>
            <Form>
              <Form.Group controlId="sessionTitle">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="sessionDescription">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="sessionStartTime">
                <Form.Label>Fecha y Hora de Inicio</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={newSession.startTime}
                  onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="sessionEndTime">
                <Form.Label>Fecha y Hora de Fin</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={newSession.endTime}
                  onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                />
              </Form.Group>
            </Form>
          </div>
          <div className='my-2 d-flex justify-content-end'>
            <Button variant="secondary bg_principal Blanco" onClick={handleAddSession}>
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
              <ListGroup.Item key={course.id}>
                <div className='d-flex justify-content-between'>
                  <div>{course.id + ".- "}{course.name}</div>
                  <Button variant="secondary bg_principal Blanco" onClick={() => { addCourse(course.id) }}>
                    +
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className='mt-2'>
            <div>
              <span className='h6 Principal'>Mandar solicitud de nueva materia</span>
              <div className='d-flex justify-content-end'>
                <button className='btn bg_principal Blanco'>Nueva</button>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className='bg_secundario' onClick={handleClose2}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default MyCourses;
