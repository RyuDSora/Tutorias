import { useEffect, useState } from 'react';
import { Card, ListGroup, ListGroupItem, Badge, Modal, Button } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaCalendar,FaTrashAlt } from 'react-icons/fa';
import { FaArrowRightToBracket } from "react-icons/fa6";
import axios from 'axios';
import { encryptionKey,decryptValue } from './hashes';
import Cookies from 'js-cookie';
import { uriestudiclasses, UriLesson } from './Urls';
import { confirmAlert } from 'react-confirm-alert';
import { toast, ToastContainer } from 'react-toastify';


const NextLessons = () => {
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [lessons, setLessons] = useState([]);
  const [deleteSD,setDeleteSD]= useState(false)
  const [upcomingLessons,setUpcomingLessons]=useState([])
  const toggleModal = () => setShowModal(!showModal);

  const onChange = (date) => {
    setDate(date);
  };

  const openMeetLink = (url) => {
    const width = 800;
    const height = 600;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
  
    window.open(
      url,
      'GoogleMeetWindow',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
    );
  };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        // Obtener el id del usuario
        const id = decryptValue(Cookies.get('#gt156'), encryptionKey);
        // Llamar a todas las lecciones del estudiante
        const response = await axios.get(`${uriestudiclasses}/${id}`);
        const datos1 = response.data
        
        // Llamar a todas las lecciones disponibles
        const response2 = await axios.get(UriLesson);
        const datos2 = response2.data
    
        // Combinar los datos de ambas respuestas
        const combinedLessons = datos1.map(lesson => {
          const lessonId = parseInt(lesson.class_id)
          const lessonDetails = datos2.find(l => l.id === lessonId);
          lesson.id=parseInt(lesson.id);
          return {
            ...lessonDetails,
            ...lesson,
          };
        });
        // Filtrar y ordenar las lecciones por student_id y start_time
        const filteredLessons = combinedLessons
          .filter(lesson => lesson.student_id === id)
          .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        // Establecer las lecciones filtradas en el estado
        setLessons(filteredLessons);
    
        // Filtrar solo las próximas 3 lecciones que aún no han empezado
        const only3 = filteredLessons
          .filter(lesson => new Date(lesson.start_time) >= new Date()) // Filtrar por fecha
          .slice(0, 3); // Tomar solo las primeras 3
    
        setUpcomingLessons(only3);
      } catch (error) {
        console.error('Error al recuperar sesiones:', error);
      }
    };
    fetchLessons();
    setDeleteSD(false)
  }, [deleteSD]);

  

  const handleDeleteSesion = (lesson) =>{
    const deleteS = async (id) =>{
      try {
        const response1 = await axios.delete(`${uriestudiclasses}/${id}`, {
          data: { eventId: lesson.meetid },
        });
        if (response1.status === 200) {
          toast.success('leccion borrada correctamente en BD');
        } else {
          console.error('Failed to delete event');
        }
        setDeleteSD(true)
        Window.href='/dashboardstudent/dashst'
      } catch (error) {
        toast.error(error)
      }
     console.log('borrar:' +id);
     
    }
    deleteS(lesson.id)
    toast.error('se borro la sesión')
  }
  const confirmDelete = (id,title,description) => {
    setShowModal(false)
    confirmAlert({
      title: `Confirmar eliminación de la Leccion de ${title}?`,
      message: `¿Estás seguro de que deseas eliminar ${description}?`,
      buttons: [
        {
          label: 'Sí',
          onClick: () => {handleDeleteSesion(id)},
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
      <Card className="Principal mx-auto" style={{ width: '95%' }}>
        <Card.Title className='mt-3 Principal mx-3'>
          <div className='d-flex justify-content-between'>
            <span className='h5'>Próximas Lecciones</span>
            <a onClick={toggleModal} className="text-primary" style={{ cursor: 'pointer' }}>
              <span className='h6' title='Ver Calendario'><FaCalendar className="icon Secundario" style={{ width: 20, height: 20 }} /></span>
            </a>
          </div>
        </Card.Title>
        <hr />
        <Card.Body>
          <ListGroup variant="flush">
            {upcomingLessons.length !==0 ?
            (upcomingLessons.map((lesson, index) => (
              <ListGroupItem key={index}>
                <div className='row'>
                  <div className='col-4 Principal'>
                    <div className="fw-bold my-auto">{format(parseISO(lesson.start_time), 'dd MMMM', { locale: es })}</div>
                    <Badge pill className='bg_secundario Blanco'>
                      {format(parseISO(lesson.start_time), 'h:mm a', { locale: es })} - {format(parseISO(lesson.end_time), 'h:mm a', { locale: es })}
                    </Badge>
                  </div>
                  <div className='col-8'>
                    <div className='row'>
                      <div className='Principal'>{lesson.title }</div>
                      <small className='Secundario'>{lesson.description}</small>
                      {lesson.google_meet_link && (
                        <div className='mt-2'>
                          <Button
                            title='Borrar esta leccion'
                            className='me-2'
                            variant="danger"
                            onClick={()=>{confirmDelete(lesson)}}
                            rel="noopener noreferrer"
                          >
                            <FaTrashAlt />
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => openMeetLink(lesson.google_meet_link)}
                            rel="noopener noreferrer"
                            title='Unirme a esta leccion'
                          >
                            <FaArrowRightToBracket />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ListGroupItem>
            ))):(<>No hay lecciones pendientes</>)}
          </ListGroup>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={toggleModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Calendario de Sesiones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Calendar onChange={onChange} value={date} />
          <ListGroup className="mt-3">
            {lessons
              .filter(lesson => isSameDay(parseISO(lesson.start_time), date))
              .map((lesson, index) => (
                <ListGroupItem key={index}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{lesson.title}</strong>
                      <div><small>{format(parseISO(lesson.start_time), 'd MMMM yyyy', { locale: es })}</small></div>
                      {lesson.description && <div><small>{lesson.description}</small></div>}
                    </div>
                    <div className="text-end">
                      <Badge bg="primary">{format(parseISO(lesson.start_time), 'HH:mm', { locale: es })}</Badge>
                      {lesson.google_meet_link && (
                        <div className='mt-2'>
                          <Button
                            title='Borrar esta leccion'
                            className='me-2'
                            variant="danger"
                            onClick={()=>{confirmDelete(lesson)}}
                            rel="noopener noreferrer"
                          >
                            Borrar
                          </Button>
                          <Button
                            variant="primary"
                            title='Unirme a esta leccion'
                            href={lesson.google_meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Unirme
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </ListGroupItem>
              ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal} className='bg_negro'>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer></ToastContainer>
    </>
  );
};

export default NextLessons;
