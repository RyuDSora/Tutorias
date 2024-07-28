import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch articles from an API or local source
    axios.get('https://api.example.com/articles')
      .then(response => {
        setArticles(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      <div><span className='h3 Principal f_principal'>Tus Artículos</span></div>
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Row>
          <Col>
            <ListGroup>
              {articles.map(article => (
                <ListGroup.Item key={article.id}>
                  <h5>{article.title}</h5>
                  <p>{article.summary}</p>
                  <a href={`/articles/${article.id}`}>Read more</a>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Articles;

