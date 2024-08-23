import { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, ListGroup, Spinner, Alert, Form, Button, Modal } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { decryptValue, encryptionKey } from '../hashes';
import { url } from '../Urls';
import axios from 'axios';

const ArticlesST = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const session = Cookies.get('$3s1.4') ? decryptValue(Cookies.get('$3s1.4'), encryptionKey) : null;
    if (session) {
      const id = decryptValue(Cookies.get('#gt156'), encryptionKey);
      setUserId(id);
    }
  }, []);

  const fetchArticles = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/articles/`);
      setArticles(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Error al cargar los artículos');
      setLoading(false);
    }
  }, []);

  const fetchComments = async (articleId) => {
    try {
      const response = await axios.get(`${url}/comments/${articleId}`);
      return response.data; // Asegúrate de que la respuesta tenga la estructura correcta
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Error al cargar los comentarios');
      return [];
    }
  };

  const handleArticleSelect = async (article) => {
    const comments = await fetchComments(article.id);
    setSelectedArticle({ ...article, comments });
    setShowModal(true);
  };

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e, articleId) => {
    e.preventDefault();
    if (!userId) {
      setError('No se puede enviar el comentario sin un usuario autenticado.');
      return;
    }

    try {
      const response = await axios.post(`${url}/comments/${articleId}/comments`, {
        content: newComment,
        user_id: userId,
      });

      // Actualiza artículos para incluir el nuevo comentario
      setArticles(prevArticles =>
        prevArticles.map(article =>
          article.id === articleId ? { ...article, comments: [...(article.comments || []), response.data] } : article
        )
      );
      setNewComment(""); // Resetea el comentario
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Error al agregar el comentario.');
    }
  };

  return (
    <Container>
      <h1>Libros</h1>
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Row>
          <Col>
            <ListGroup>
              {articles.map(article => (
                <ListGroup.Item
                  key={article.id}
                  style={{ cursor: 'pointer', border: '1px solid lightgray', borderRadius: '5px', marginBottom: '10px', transition: '0.2s' }}
                  onClick={() => handleArticleSelect(article)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  <h5>{article.title}</h5>
                  <p>{article.summary}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      )}

      {/* Modal para mostrar detalles del artículo */}
      {selectedArticle && showModal && (
        <Modal show={true} onHide={() => { setShowModal(false); setSelectedArticle(null); }}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedArticle.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{selectedArticle.content}</p>
            <h6>Comentarios:</h6>
            {selectedArticle.comments && selectedArticle.comments.length > 0 ? (
              <div style={{ maxHeight: '300px', overflowY: 'scroll', border: '1px solid lightgray', borderRadius: '5px', padding: '10px', marginBottom: '15px' }}>
                {selectedArticle.comments.map(comment => (
                  <div key={comment.id} style={{ marginBottom: '10px' }}>
                    <p><strong>{comment.user_id}</strong>: {comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay comentarios aún.</p>
            )}

            {/* Campo para agregar nuevo comentario */}
            {userId ? (
              <Form onSubmit={(e) => handleCommentSubmit(e, selectedArticle.id)}>
                <Form.Group controlId="formComment">
                  <Form.Control
                    type="text"
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Escribe tu comentario aquí"
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-2">Enviar</Button>
              </Form>
            ) : (
              <p>Debes estar autenticado para agregar comentarios.</p>
            )}
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default ArticlesST;