import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import img1 from "../public/images/gamificacion02-2-768x400-1.png"
import img2 from "../public/images/crear-cursos-en-linea-coursifyme.jpg"
import img3 from "../public/images/curso-virtual.jpg"
import img4 from "../public/images/tip4.jpg"


const Articles = () => {
  return (
    <Row>
      <Col md={3}>
        <Card>
          <Card.Body>
            <img src={img1} alt="" style={{height:150}}/>
            <Card.Title className='small'>Cómo utilizar la gamificación en la creación de cursos online</Card.Title>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card>
          <Card.Body>
          <img src={img2} alt="" style={{height:150}}/>
            <Card.Title className='small'>Cómo estructurar tu propio curso online</Card.Title>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card>
          <Card.Body>
          <img src={img3} alt="" style={{height:150}}/>
            <Card.Title className='small'>¿Cómo hacer que tus lecciones sean más atractivas?</Card.Title>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card>
          <Card.Body>
          <img src={img4} alt="" style={{height:150}}/>
            <Card.Title className='small'>4 trucos para hacer tus cursos más PRO</Card.Title>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Articles;
