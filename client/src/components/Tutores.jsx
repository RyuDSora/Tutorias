import React, { useEffect, useState } from 'react';
import { uritutor, URIUser } from './Urls';
import { Card, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import img from '/images/tutor1.jpg'
import img2 from '/images/tutor2.jpg'

// Componente para mostrar la tarjeta de un tutor
const TutorCard = ({ tutor, user }) => {
  const [female,setFemale] = useState(false);
  useEffect(()=>{
    if (user.gender==='Female') {
      setFemale(true)
    }
  },[])
  return (
    <>
    <Col md={3}>
      <Card className='m-2'>
        <Card.Body>
          <img src={female ? img2 : img} alt={tutor.name} className="image mt-1 rounded-3" />
          <Card.Title className='Principal my-2'>{user.name+" "+user.last }</Card.Title>
          <p className="description Principal my-2">{tutor.bio}</p>
          <p className="additionalInfo Principal my-2">{user.additionalInfo}</p>
        </Card.Body>
      </Card>
    </Col>
    </>
    
  );
};

// Componente principal para mostrar la cuadrícula de tutores
const Tutores = () => {
  const [tutorDetails, setTutorDetails] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Obtener los usuarios
        const userResponse = await axios.get(URIUser);
        const users = userResponse.data;
        const tutorIds = users.filter(user => user.role === 'tutor').map(user => user.id);

        // Obtener detalles de cada tutor
        const tutorRequests = tutorIds.map(id =>
          axios.get(`${uritutor}/${id}`) // Suponiendo que el ID del tutor está disponible
        );

        const tutorResponses = await Promise.all(tutorRequests);
        const detailedTutors = tutorResponses.map(response => response.data);

        // Combina los detalles de los tutores con los usuarios
        const tutorsWithDetails = detailedTutors.map(tutor => {
          const user = users.find(u => u.id === tutor.user_id);
          return { ...tutor, user };
        });
        setTutorDetails(tutorsWithDetails);
      } catch (error) {
        console.error('Error fetching tutors:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
    <h1 className="title">Nuestros Tutores</h1>
    <Row>
      {tutorDetails.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} user={tutor.user} />
        ))}
    </Row>
    </>
  );
};

export default Tutores;
