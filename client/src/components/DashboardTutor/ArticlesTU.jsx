import { useEffect, useState, useCallback } from 'react';
import { Row, Col, Card, Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';
import { confirmAlert } from 'react-confirm-alert';
import { decryptValue, encryptionKey } from '../hashes';
import { url, uritutor } from '../Urls';  // Asegúrate de que la URL está configurada correctamente
import { toast, ToastContainer } from 'react-toastify';
import { FaTrash, FaEdit } from 'react-icons/fa';

const ArticlesTU = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const [userRole, setUserRole] = useState('');
  const [teacherId, setTeacherId] = useState('');

  // Función para obtener el rol del usuario y su ID
  useEffect(() => {
    const session = Cookies.get('$3s1.4') ? decryptValue(Cookies.get('$3s1.4'), encryptionKey) : null;
    if (session) {
      const role = decryptValue(Cookies.get('&0l3'), encryptionKey);
      const id = decryptValue(Cookies.get('#gt156'), encryptionKey); // Esto obtiene el ID del usuario
      const leerTutor = async(ID) =>{
        try {
          const response = await axios.get(`${uritutor}/${ID}`);
          const idTutor = response.data.id;
          setTeacherId(idTutor)
        } catch (error) {
          
        }
      }
      leerTutor(id);
        
      setUserRole(role);
    }
  }, []);

  // Función para obtener todos los artículos
  const fetchArticles = useCallback(async () => {
    if (teacherId) {
      try {
        const response = await axios.get(`${url}/articles/teacher/${teacherId}`);
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    }
  }, [teacherId]);  // Dependencia en teacherId

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleCardClick = (article) => {
    setSelectedArticle(article);
    setFormData({ title: article.title, content: article.content });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
    setFormData({ title: '', content: '' });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${url}/articles/${selectedArticle.id}`, { ...formData });
        toast.success('Se ha modificado el artículo exitosamente')
      } else {
        await axios.post(`${url}/articles`, { ...formData, teacher_id: teacherId });
        toast.success('Se ha creado el artículo exitosamente')
      }
      fetchArticles();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('No se puede crear el artículo')
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/articles/${id}`);
      toast.warning('Se eliminó el artículo exitosamente')
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };
  const confirmDelete = (id) => {
    confirmAlert({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar el Artículo?',
      buttons: [
        {
          label: 'Sí',
          onClick: () => { handleDelete(id) },
        },
        {
          label: 'No',
          onClick: () => { },
        },
      ],
    });
  };
  return (
    <>
      <ToastContainer/>
      <div><span className='h3 Principal f_principal'>Tus Artículos</span></div>
      {userRole && ( // Comprobación del rol de usuario
        <div>
          <h2 className='Principal my-2'>Gestión de Artículos</h2>
          <Button variant="primary" className='bg_secundario' onClick={() => { setShowModal(true); setIsEditing(false); setFormData({ title: '', content: '' }); }}>
            Crear Artículo
          </Button>

          <Row style={{ width: '100%', marginTop: '20px' }}>
            {articles.map((article) => (
              <Col md={3} key={article.id} style={{ marginBottom: '20px' }}>
                <Card>
                  <Card.Body>
                    <Card.Title className='small'>{article.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{new Date(article.created_at).toLocaleDateString()}</Card.Subtitle>
                    <Button className='bg_principal' title='Editar' variant="secondary" onClick={() => handleCardClick(article)} style={{ marginRight: '5px' }}><FaEdit/></Button>
                    <Button variant="danger" title='Borrar' style={{backgroundColor:'red'}} onClick={() => confirmDelete(article.id)}><FaTrash/></Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>{isEditing ? 'Editar Artículo' : 'Crear Artículo'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formTitle">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formContent">
                  <Form.Label>Contenido</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  {isEditing ? 'Actualizar' : 'Crear'}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      )}
      {!userRole && <h2>No estás autorizado para ver esta sección.</h2>}
    </>
  );
};

export default ArticlesTU;