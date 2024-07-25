import React, { useEffect, useState } from 'react';
import './tutores.css';
import { uritutor, URIUser } from './components/Urls';
import axios from 'axios';
import img from '../public/images/tutor1.jpg'
import img2 from '../public/images/tutor2.jpg'

// Componente para mostrar la tarjeta de un tutor
const TutorCard = ({ tutor, user }) => {
  const [female,setFemale] = useState(false);
  useEffect(()=>{
    if (user.gender==='Female') {
      setFemale(true)
    }
  },[])
  return (
    <div className="card">
      {female ? (<img src={img2} alt={tutor.name} className="image" />):(<img src={img} alt={tutor.name} className="image" />)}
      
      <div className="textContainer">
        <h3 className="name">{user.name+" "+user.last }</h3>
        <p className="description">{tutor.bio}</p>
        <p className="additionalInfo">{user.additionalInfo}</p>
      </div>
    </div>
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
    <div>
      <h1 className="title">Nuestros Tutores</h1>
      <div className="gridContainer">
        {tutorDetails.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} user={tutor.user} />
        ))}
      </div>
    </div>
  );
};

export default Tutores;
