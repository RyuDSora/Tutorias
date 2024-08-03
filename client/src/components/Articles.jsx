import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import img1 from "/images/gamificacion02-2-768x400-1.png"
import img2 from "/images/crear-cursos-en-linea-coursifyme.jpg"
import img3 from "/images/curso-virtual.jpg"
import img4 from "/images/tip4.jpg"


const Articles = () => {
  return (
    <Row style={{width:'100%'}}>
      {columna(img1,"Cómo utilizar la gamificación en la creación de cursos online")}
      {columna(img2,"Cómo estructurar tu propio curso online")}
      {columna(img3,"¿Cómo hacer que tus lecciones sean más atractivas?")}
      {columna(img4,"4 trucos para hacer tus cursos más PRO")}
    </Row>
  );
}
const columna = (img,frase) =>{
  return(
    <Col md={3}>
      <Card>
        <Card.Body>
        <img src={img} alt="" style={{height:150}}/>
          <Card.Title className='small'>{frase}</Card.Title>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default Articles;
