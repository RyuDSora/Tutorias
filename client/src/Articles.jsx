import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const Articles = () => {
  return (
    <Row>
      <Col md={3}>
        <Card>
          <Card.Body>
            <Card.Title>How to use gamification in creating online courses</Card.Title>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card>
          <Card.Body>
            <Card.Title>How to structure your own online course</Card.Title>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card>
          <Card.Body>
            <Card.Title>How to make your lessons more engaging?</Card.Title>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card>
          <Card.Body>
            <Card.Title>4 tricks to make your courses more PRO</Card.Title>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Articles;
