import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';  // Importa los estilos de react-calendar

const NextLessons = () => {
  const [date, setDate] = useState(new Date());

  const onChange = (date) => {
    setDate(date);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Próximas lecciones</Card.Title>
        <Card.Text>
          {/* Lista de próximas lecciones */}
        </Card.Text>
        <Calendar onChange={onChange} value={date} />
      </Card.Body>
    </Card>
  );
}

export default NextLessons;


