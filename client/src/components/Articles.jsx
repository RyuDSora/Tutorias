import { useEffect, useState } from 'react';
import { Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { url } from './Urls';
import axios from 'axios';
import Cookies from 'js-cookie';
import { decryptValue, encryptionKey } from './hashes';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [teacherId, setTeacherId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(''); // Rol del usuario

  // Verificación de la sesión activa y recuperación del teacherId y rol
  useEffect(() => {
    const session = Cookies.get('$3s1.4') ? decryptValue(Cookies.get('$3s1.4'), encryptionKey) : null;
    if (session) {
      const id = decryptValue(Cookies.get('#gt156'), encryptionKey); // Obtiene el ID del profesor
      const role = decryptValue(Cookies.get('&0l3'), encryptionKey); // Obtiene el rol del usuario
      setTeacherId(id);
      setUserRole(role); // Establece el rol del usuario
      setIsLoggedIn(true); // Si hay sesión, marcamos que el usuario está logueado
    }
  }, []);

  // Función para obtener artículos según el rol
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        let response;
        if (userRole === 'tutor' && teacherId) {
          // Obtener todos los artículos del tutor
          response = await axios.get(`${url}/articles/teacher/${teacherId}`);
        } else {
          // Obtener todos los artículos independientemente del tutor
          response = await axios.get(`${url}/articles`);
        }

        // Suponiendo que el servidor devuelve los artículos, ahora debemos ordenarlos
        const articlesData = response.data;

        // Si el usuario es tutor, ordenamos por comentarios de mayor a menor
        if (userRole === 'tutor') {
          articlesData.sort((a, b) => b.comments.length - a.comments.length); // Suponiendo que 'comments' es un array en cada artículo
        }

        setArticles(articlesData);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    if (userRole) {
      fetchArticles();
    }
  }, [teacherId, userRole]);

  const handleCardClick = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <Row style={{ width: '100%' }}>
            {articles.map((article) => (
              <Col md={3} key={article.id}>
                <Card onClick={() => handleCardClick(article)} style={{ cursor: 'pointer' }}>
                  <Card.Body>
                    <Card.Title className='small'>{article.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{new Date(article.created_at).toLocaleDateString()}</Card.Subtitle>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {selectedArticle && (
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>{selectedArticle.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>{selectedArticle.content}</p>
                <p><strong>Fecha de creación:</strong> {new Date(selectedArticle.created_at).toLocaleDateString()}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
              </Modal.Footer>
            </Modal>
          )}
        </>
      ) : (
        <h2>No estás autorizado para ver esta sección.</h2>
      )}
    </>
  );
};

// Definir validaciones de PropTypes
Articles.propTypes = {
  // El componente no necesita props adicionales en este contexto
};

export default Articles;