import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, ListGroup, Form, Button, Alert } from 'react-bootstrap';
import { io } from 'socket.io-client';
import axios from 'axios';
import { url, urichat,URIUser } from '../components/Urls';

// Configura la conexión con socket.io
const socket = io('https://tutorias-five.vercel.app');

const Chats = ({ userId }) => {
  const UserId = parseInt(userId);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState('');
  const [connectedStudents, setConnectedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const messagesEndRef = useRef(null);

  // Función para obtener el historial de chat entre dos usuarios
  const fetchChatHistory = async (user1, user2) => {
    try {
      const response = await axios.get(`${urichat}/${user1}/${user2}`);
      return response.data;
    } catch (error) {
      //console.log('Error fetching chat history:', error);
      return [];
    }
  };

  // Usuarios para chatear
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(URIUser);
        const usuarios = response.data.filter(user => user.id !== UserId);
        setUsers(usuarios);
      } catch (error) {
        //console.log('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [UserId]);

  // Usuarios activos y mensajes recibidos
  useEffect(() => {
    // Emitir el evento de conexión del usuario
    socket.emit('user_connected', UserId);

    if (UserId) {
      socket.on('active_users', (users) => {
        setConnectedStudents(users);
      });
    }
  }, [UserId]);

  // Obtener historial de mensajes cuando se selecciona un estudiante
  useEffect(() => {
    if (selectedStudent) {
      fetchChatHistory(UserId, selectedStudent.id).then(chatHistory => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedStudent.id]: chatHistory
        }));
      });
    }
  }, [selectedStudent]);

  // Verificar nuevos mensajes periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedStudent) {
        fetchChatHistory(UserId, selectedStudent.id).then(chatHistory => {
          setMessages((prevMessages) => ({
            ...prevMessages,
            [selectedStudent.id]: chatHistory
          }));
        });
      }
    }, 5000); // Verifica cada 5 segundos

    return () => clearInterval(interval);
  }, [selectedStudent]);

  // Filtrar usuarios conectados o con historial
  useEffect(() => {
    const filterUsers = async () => {
      const usersWithHistory = [];
      for (const user of users) {
        const chatHistory = await fetchChatHistory(UserId, user.id);
        if (chatHistory.length > 0 || connectedStudents.includes(user.id)) {
          usersWithHistory.push(user);
        }
      }
      setFilteredUsers(usersWithHistory);
    };

    filterUsers();
  }, [users, connectedStudents]);

  // Función para desplazar el contenedor de mensajes al final
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Llamar a scrollToBottom cuando los mensajes cambien
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedStudent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() && selectedStudent) {
      const msg = { emisor: UserId, mensaje: input, receptor: selectedStudent.id };

      try {
        await axios.post('http://localhost:3000/api/messages', msg);
        setMessages((prevMessages) => {
          const studentId = selectedStudent.id;
          return {
            ...prevMessages,
            [studentId]: [...(prevMessages[studentId] || []), msg],
          };
        });
        setInput('');
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
      }
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
            {filteredUsers.map(user => (
              <ListGroup.Item
                key={user.id}
                onClick={() => handleStudentSelect(user)}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: connectedStudents.includes(user.id) ? 'green' : 'red',
                    display: 'inline-block',
                    marginRight: '10px',
                  }}
                />
                {user.name + ' ' + user.last}
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
                  overflowY: 'auto', // Cambiar a 'auto' para permitir el desplazamiento dentro del contenedor
                  marginBottom: '20px',
                }}
              >
                {messages[selectedStudent.id]?.map((message, index) => (
                  <div
                    key={index}
                    className={`d-flex mb-2 ${message.emisor === UserId ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    <div
                      style={{
                        maxWidth: '60%',
                        padding: '10px',
                        borderRadius: '15px',
                        border: '1px solid black',
                        wordBreak: 'break-word',
                      }}
                    >
                      {message.mensaje}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
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
