import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, ListGroup, Form, Button, Alert, Accordion, Offcanvas } from 'react-bootstrap';
import axios from 'axios';
import { FaChevronLeft, FaArrowLeft } from "react-icons/fa";
import { urichat, URIUser } from './Urls';

const Chats = ({ userId }) => {
  const UserId = parseInt(userId);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState('');
  const [connectedStudents, setConnectedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchChatHistory = async (user1, user2) => {
    try {
      const response = await axios.get(`${urichat}/${user1}/${user2}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(URIUser);
        const usuarios = response.data.filter(user => user.id !== UserId);
        setUsers(usuarios);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [UserId]);

  useEffect(() => {
    const filterUsers = async () => {
      const usersWithHistory = [];
      for (const user of users) {
        const chatHistory = await fetchChatHistory(UserId, user.id);
        usersWithHistory.push(user);
      }
      setFilteredUsers(usersWithHistory);
    };

    filterUsers();
  }, [users, connectedStudents]);

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
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedStudent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() && selectedStudent) {
      const msg = { emisor: UserId, mensaje: input, receptor: selectedStudent.id };

      try {
        await axios.post(urichat, msg);
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
    if (window.innerWidth < 768) {
      setShowUsers(false); 
    }
  };

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col xs={12}>
          <h3 className='Principal f_principal text-center'>Tus Chats</h3>
        </Col>
      </Row>

      <Row>
        <Col md={4} className={`d-md-block ${selectedStudent ? 'd-none d-md-block' : 'd-block'}`}>
          <h4 className='Principal'>Usuarios</h4>
          <Accordion defaultActiveKey="0">
            {['administrador', 'tutor', 'estudiante'].map((role, idx) => (
              <Accordion.Item eventKey={String(idx)} key={role}>
                <Accordion.Header>{role.charAt(0).toUpperCase() + role.slice(1)}</Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush">
                    {filteredUsers
                      .filter(user => user.role === role)
                      .map(user => (
                        <ListGroup.Item
                          key={user.id}
                          onClick={() => handleStudentSelect(user)}
                          style={{ cursor: 'pointer' }}
                        >
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              display: 'inline-block',
                              marginRight: '10px',
                            }}
                            className='bg_secundario'
                          />
                          {user.name + ' ' + user.last}
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>

        <Col md={8}>
          <h4 className='Principal'>Chat con {selectedStudent ? selectedStudent.name : 'Selecciona un estudiante'}</h4>
          {selectedStudent ? (
            <>
              <div
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  padding: '10px',
                  height: '400px',
                  overflowY: 'auto',
                  marginBottom: '20px',
                }}
                className='bg_secundario'
              >
                {messages[selectedStudent.id]?.map((message, index) => (
                  <div
                    key={index}
                    className={`d-flex mb-2 ${message.emisor === UserId ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '10px',
                        borderRadius: '15px',
                        border: '1px solid black',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        wordBreak: 'break-word',
                      }}
                    >
                      {message.mensaje}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <Form onSubmit={handleSubmit} className='d-flex'>
                <Form.Control
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className='flex-fill'
                />
                <Button type="submit" variant="primary" className='bg_secundario ms-2'>Enviar</Button>
              </Form>
            </>
          ) : (
            <Alert variant="info" className='bg_secundario Blanco'>
              <div>No tienes ningún chat abierto.</div>
              <div>Selecciona un usuario para empezar a chatear.</div>
            </Alert>
          )}
        </Col>
      </Row>

      <Offcanvas show={showUsers} onHide={() => setShowUsers(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Usuarios</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Accordion defaultActiveKey="0">
            {['administrador', 'tutor', 'estudiante'].map((role, idx) => (
              <Accordion.Item eventKey={String(idx)} key={role}>
                <Accordion.Header>{role.charAt(0).toUpperCase() + role.slice(1)}</Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush">
                    {filteredUsers
                      .filter(user => user.role === role)
                      .map(user => (
                        <ListGroup.Item
                          key={user.id}
                          onClick={() => handleStudentSelect(user)}
                          style={{ cursor: 'pointer' }}
                        >
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              display: 'inline-block',
                              marginRight: '10px',
                            }}
                            className='bg_secundario'
                          />
                          {user.name + ' ' + user.last}
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default Chats;
