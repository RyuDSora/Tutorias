import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Form, Button, Alert } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { url } from '../components/Urls';

const socket = io(url); 

const Chats = ({ userId }) => {
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState('');
  const [connectedStudents, setConnectedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    // Emitir el evento de conexión del usuario
    socket.emit('user_connected', userId);

    // Escuchar la lista de usuarios activos
    socket.on('active_users', (users) => {
      setConnectedStudents(users);
    });

    // Escuchar mensajes recibidos
    socket.on('receive_message', (msg) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [msg.studentId]: [...(prevMessages[msg.studentId] || []), msg],
      }));
    });

    // Desconectar el socket al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && selectedStudent) {
      const msg = { userId, text: input, studentId: selectedStudent.id };
      socket.emit('send_message', msg); // Emitir el mensaje al servidor
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedStudent.id]: [...(prevMessages[selectedStudent.id] || []), { text: input, id: (prevMessages[selectedStudent.id] || []).length }],
      }));
      setInput('');
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  return (
    <Container>
      <Row>
        <Col md={4}>
          <h3>Estudiantes</h3>
          <ListGroup>
            {connectedStudents.map(student => (
              <ListGroup.Item
                key={student.id}
                onClick={() => handleStudentSelect(student)}
                style={{ cursor: 'pointer', backgroundColor: student.online ? '#d4edda' : '#f8d7da' }}
              >
                {student.name} {student.online ? <span className="text-success">(Online)</span> : <span className="text-danger">(Offline)</span>}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={8}>
          <h1>Chatear con {selectedStudent ? selectedStudent.name : 'Selecciona un estudiante'}</h1>
          {selectedStudent ? (
            <>
              <div
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  padding: '10px',
                  height: '400px',
                  overflowY: 'scroll',
                  marginBottom: '20px',
                }}
              >
                {messages[selectedStudent.id]?.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '10px',
                      padding: '10px',
                      borderRadius: '5px',
                      backgroundColor: '#f1f1f1',
                    }}
                  >
                    {message.text}
                  </div>
                ))}
              </div>
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe un mensaje..."
                  />
                </Form.Group>
                <Button type="submit" variant="primary">Enviar</Button>
              </Form>
            </>
          ) : (
            <Alert variant="info">
              Selecciona un estudiante para empezar a chatear.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Chats;
